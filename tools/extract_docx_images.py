import json
import os
import re
import shutil
import zipfile


def _safe_name(name: str) -> str:
    name = name.strip()
    name = name.replace("\\", "_").replace("/", "_")
    name = re.sub(r'[<>:"/\\|?*\x00-\x1F]+', "_", name)
    name = name.strip(" .")
    name = re.sub(r"_+", "_", name).strip("_")
    return name or "untitled"


def extract_images(docx_path: str, out_dir: str):
    os.makedirs(out_dir, exist_ok=True)

    extracted = []
    with zipfile.ZipFile(docx_path, "r") as z:
        names = z.namelist()
        media_files = [n for n in names if n.startswith("word/media/") and not n.endswith("/")]

        for internal in media_files:
            filename = os.path.basename(internal)
            filename = _safe_name(filename)
            out_path = os.path.join(out_dir, filename)

            base, ext = os.path.splitext(filename)
            suffix = 1
            while os.path.exists(out_path):
                out_path = os.path.join(out_dir, f"{base}_{suffix}{ext}")
                suffix += 1

            data = z.read(internal)
            with open(out_path, "wb") as f:
                f.write(data)

            extracted.append(
                {
                    "internal_path": internal,
                    "file": os.path.basename(out_path),
                    "bytes": len(data),
                }
            )

    return extracted


def main():
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    input_dir = os.path.join(repo_root, "内容")
    out_root = os.path.join(input_dir, "word_images")
    os.makedirs(out_root, exist_ok=True)

    manifest = {"root": out_root, "documents": []}

    for name in os.listdir(input_dir):
        if not name.lower().endswith(".docx"):
            continue
        docx_path = os.path.join(input_dir, name)
        if not os.path.isfile(docx_path):
            continue

        doc_base = os.path.splitext(name)[0]
        out_dir = os.path.join(out_root, _safe_name(doc_base))
        if os.path.exists(out_dir):
            shutil.rmtree(out_dir)
        images = extract_images(docx_path, out_dir)

        manifest["documents"].append(
            {
                "docx": name,
                "out_dir": out_dir,
                "image_count": len(images),
                "images": images,
            }
        )

    manifest_path = os.path.join(out_root, "manifest.json")
    with open(manifest_path, "w", encoding="utf-8", newline="\n") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()
