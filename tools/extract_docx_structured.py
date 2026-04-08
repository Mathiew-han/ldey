import json
import os
import re
import zipfile
from xml.etree import ElementTree as ET


NS = {
    "w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
}


def _norm(text: str) -> str:
    text = (text or "").replace("\u00a0", " ")
    text = re.sub(r"[ \t]+", " ", text)
    return text.strip()


def _run_text(el) -> str:
    texts = [t.text or "" for t in el.findall(".//w:t", NS)]
    return _norm("".join(texts))


def _table_to_matrix(tbl):
    rows = []
    for tr in tbl.findall("./w:tr", NS):
        row = []
        for tc in tr.findall("./w:tc", NS):
            cell_texts = []
            for p in tc.findall(".//w:p", NS):
                t = _run_text(p)
                if t:
                    cell_texts.append(t)
            row.append("\n".join(cell_texts).strip())
        if any(c for c in row):
            rows.append(row)
    return rows


def extract_docx_blocks(docx_path: str):
    with zipfile.ZipFile(docx_path, "r") as z:
        xml = z.read("word/document.xml")
    root = ET.fromstring(xml)

    body = root.find(".//w:body", NS)
    if body is None:
        return []

    blocks = []
    for child in list(body):
        tag = child.tag.rsplit("}", 1)[-1]
        if tag == "p":
            text = _run_text(child)
            if text:
                blocks.append({"type": "p", "text": text})
        elif tag == "tbl":
            matrix = _table_to_matrix(child)
            if matrix:
                blocks.append({"type": "table", "rows": matrix})
    return blocks


def table_to_objects(rows):
    if not rows:
        return []
    header = [c.strip() for c in rows[0]]
    if not any(header):
        return []
    objs = []
    for r in rows[1:]:
        obj = {}
        for i, key in enumerate(header):
            if not key:
                continue
            obj[key] = (r[i] if i < len(r) else "").strip()
        if any(v for v in obj.values()):
            objs.append(obj)
    return objs


def extract_summary(blocks):
    paras = [b["text"] for b in blocks if b["type"] == "p"]
    take = []
    for t in paras:
        if len(t) < 4:
            continue
        take.append(t)
        if len(take) >= 6:
            break
    return take


def main():
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    input_dir = os.path.join(repo_root, "内容")
    out_dir = os.path.join(repo_root, "New_ldey", "src", "shared", "content")
    os.makedirs(out_dir, exist_ok=True)

    files = [
        "数据中心简介.docx",
        "25.06.25-数据库建设介绍.docx",
        "25.06.25-专家介绍.docx",
    ]

    for filename in files:
        src = os.path.join(input_dir, filename)
        if not os.path.exists(src):
            continue
        blocks = extract_docx_blocks(src)
        tables = [b for b in blocks if b["type"] == "table"]
        first_table_objects = table_to_objects(tables[0]["rows"]) if tables else []

        payload = {
            "source": filename,
            "summary": extract_summary(blocks),
            "blocks": blocks,
            "firstTable": first_table_objects,
        }

        out_name = _norm(os.path.splitext(filename)[0])
        out_name = re.sub(r'[<>:"/\\|?*\x00-\x1F]+', "_", out_name)
        out_path = os.path.join(out_dir, f"{out_name}.doc.json")
        with open(out_path, "w", encoding="utf-8", newline="\n") as f:
            json.dump(payload, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()

