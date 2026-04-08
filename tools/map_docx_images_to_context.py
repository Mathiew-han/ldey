import json
import os
import re
import zipfile
from xml.etree import ElementTree as ET


NS = {
    "w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    "v": "urn:schemas-microsoft-com:vml",
}


def _norm(text: str) -> str:
    text = (text or "").replace("\u00a0", " ")
    text = re.sub(r"[ \t]+", " ", text)
    return text.strip()


def _is_heading(text: str, style: str | None) -> bool:
    if style:
        if "Heading" in style or "标题" in style or style in {"1", "2", "3"}:
            return True
    if not text:
        return False
    if re.match(r"^\d{4}年", text):
        return True
    if text.endswith("：") and len(text) <= 50:
        return True
    if any(k in text for k in ("大会", "年会", "国际会议", "RSNA", "ECR", "ISMRM", "CCR")) and len(text) <= 60:
        return True
    return False


def _p_style(p) -> str | None:
    ppr = p.find("w:pPr", NS)
    if ppr is None:
        return None
    ps = ppr.find("w:pStyle", NS)
    if ps is None:
        return None
    return ps.attrib.get(f"{{{NS['w']}}}val")


def _p_text(p) -> str:
    texts = [t.text or "" for t in p.findall(".//w:t", NS)]
    return _norm("".join(texts))


def _p_image_rids(p) -> list[str]:
    rids: list[str] = []
    for blip in p.findall(".//a:blip", NS):
        rid = blip.attrib.get(f"{{{NS['r']}}}embed")
        if rid:
            rids.append(rid)
    for img in p.findall(".//v:imagedata", NS):
        rid = img.attrib.get(f"{{{NS['r']}}}id")
        if rid:
            rids.append(rid)
    return rids


def _load_rels(zipf: zipfile.ZipFile) -> dict[str, str]:
    rels_path = "word/_rels/document.xml.rels"
    if rels_path not in zipf.namelist():
        return {}
    xml = zipf.read(rels_path)
    root = ET.fromstring(xml)
    rels: dict[str, str] = {}
    for rel in root.findall(".//{http://schemas.openxmlformats.org/package/2006/relationships}Relationship"):
        rid = rel.attrib.get("Id")
        target = rel.attrib.get("Target")
        rtype = rel.attrib.get("Type") or ""
        if rid and target and "image" in rtype:
            rels[rid] = target
    return rels


def extract_image_context(docx_path: str):
    with zipfile.ZipFile(docx_path, "r") as z:
        if "word/document.xml" not in z.namelist():
            return []
        rels = _load_rels(z)
        root = ET.fromstring(z.read("word/document.xml"))

    entries = []
    history: list[dict] = []

    paras = root.findall(".//w:p", NS)
    for idx, p in enumerate(paras):
        text = _p_text(p)
        style = _p_style(p)
        rids = _p_image_rids(p)

        if text:
            history.append({"text": text, "style": style})
            if len(history) > 25:
                history = history[-25:]

        if not rids:
            continue

        prev_non_empty = next((h["text"] for h in reversed(history) if h["text"]), "")
        heading = ""
        for h in reversed(history):
            if _is_heading(h["text"], h.get("style")):
                heading = h["text"]
                break

        context_snippet = [h["text"] for h in history[-6:] if h["text"]]

        for rid in rids:
            target = rels.get(rid)
            if not target:
                continue
            internal_path = f"word/{target}".replace("\\", "/")
            entries.append(
                {
                    "docx": os.path.basename(docx_path),
                    "paragraph_index": idx,
                    "rid": rid,
                    "internal_path": internal_path,
                    "heading": heading,
                    "nearest_text": text or prev_non_empty,
                    "context": context_snippet,
                }
            )

    return entries


def main():
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    input_dir = os.path.join(repo_root, "内容")
    manifest_path = os.path.join(input_dir, "word_images", "manifest.json")
    if not os.path.exists(manifest_path):
        raise SystemExit("manifest.json not found; run extract_docx_images.py first")

    with open(manifest_path, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    internal_to_exported: dict[tuple[str, str], dict] = {}
    for d in manifest.get("documents", []):
        docx_name = d.get("docx")
        if not docx_name:
            continue
        for img in d.get("images", []):
            internal_path = img.get("internal_path")
            if not internal_path:
                continue
            internal_to_exported[(docx_name, internal_path)] = {"out_dir": d["out_dir"], "file": img["file"]}

    all_entries = []
    for d in manifest.get("documents", []):
        docx = d.get("docx")
        if not docx:
            continue
        docx_path = os.path.join(input_dir, docx)
        if not os.path.exists(docx_path):
            continue
        all_entries.extend(extract_image_context(docx_path))

    merged = []
    for e in all_entries:
        export = internal_to_exported.get((e["docx"], e["internal_path"]))
        if not export:
            continue
        merged.append({**e, **export})

    out_dir = os.path.join(input_dir, "word_images")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "context.json")
    with open(out_path, "w", encoding="utf-8", newline="\n") as f:
        json.dump({"images": merged}, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()
