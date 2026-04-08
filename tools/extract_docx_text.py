import json
import os
import re
import zipfile
from xml.etree import ElementTree as ET


NS = {
    "w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
}


def _normalize(text: str) -> str:
    text = text.replace("\u00a0", " ")
    text = re.sub(r"[ \t]+", " ", text)
    return text.strip()


def extract_docx_text(docx_path: str) -> str:
    with zipfile.ZipFile(docx_path, "r") as z:
        xml = z.read("word/document.xml")
    root = ET.fromstring(xml)

    lines = []
    for p in root.findall(".//w:p", NS):
        texts = [t.text or "" for t in p.findall(".//w:t", NS)]
        line = _normalize("".join(texts))
        if line:
            lines.append(line)
    return "\n".join(lines).strip() + ("\n" if lines else "")


def to_lines(text: str):
    raw = [t.strip() for t in text.splitlines()]
    out = []
    for t in raw:
        t = _normalize(t)
        if not t:
            continue
        out.append(t)
    return out


def main():
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    input_dir = os.path.join(repo_root, "内容")
    out_dir = os.path.join(repo_root, "New_ldey", "src", "shared", "content")
    os.makedirs(out_dir, exist_ok=True)

    mapping = [
        ("获批项目.docx", "获批项目"),
        ("发表文章.docx", "发表文章"),
        ("国内交流.docx", "国内交流"),
        ("国外交流.docx", "国外交流"),
        ("学生培养及获奖.docx", "学生培养及获奖"),
        ("获奖.docx", "获奖"),
    ]

    data = {"sections": []}
    for filename, title in mapping:
        path = os.path.join(input_dir, filename)
        if not os.path.exists(path):
            continue
        text = extract_docx_text(path)
        lines = to_lines(text)
        data["sections"].append(
            {
                "key": filename,
                "title": title,
                "lines": lines,
            }
        )

    out_path = os.path.join(out_dir, "achievements.word.json")
    with open(out_path, "w", encoding="utf-8", newline="\n") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()

