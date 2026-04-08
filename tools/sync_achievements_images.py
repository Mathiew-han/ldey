import json
import os
import shutil


def main():
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    context_path = os.path.join(repo_root, "内容", "word_images", "context.json")
    if not os.path.exists(context_path):
        raise SystemExit("context.json not found; run map_docx_images_to_context.py first")

    with open(context_path, "r", encoding="utf-8") as f:
        ctx = json.load(f)

    group_map = {
        "国内交流.docx": "domestic",
        "国外交流.docx": "international",
    }

    dest_root = os.path.join(repo_root, "New_ldey", "public", "images", "achievements")
    os.makedirs(dest_root, exist_ok=True)

    output = {"groups": []}
    groups: dict[str, dict] = {}

    for item in ctx.get("images", []):
        docx = item.get("docx")
        group_key = group_map.get(docx)
        if not group_key:
            continue

        src_dir = item.get("out_dir")
        filename = item.get("file")
        if not src_dir or not filename:
            continue

        src_path = os.path.join(src_dir, filename)
        if not os.path.exists(src_path):
            continue

        dest_dir = os.path.join(dest_root, group_key)
        os.makedirs(dest_dir, exist_ok=True)
        dest_path = os.path.join(dest_dir, filename)
        shutil.copy2(src_path, dest_path)

        heading = (item.get("heading") or "").strip()
        nearest = (item.get("nearest_text") or "").strip()

        g = groups.get(group_key)
        if not g:
            g = {
                "key": group_key,
                "title": "国内交流" if group_key == "domestic" else "国外交流",
                "items": [],
            }
            groups[group_key] = g

        g["items"].append(
            {
                "src": f"/images/achievements/{group_key}/{filename}",
                "heading": heading,
                "nearestText": nearest,
                "docx": docx,
                "internalPath": item.get("internal_path"),
            }
        )

    output["groups"] = list(groups.values())

    out_path = os.path.join(repo_root, "New_ldey", "src", "shared", "content", "achievements.images.json")
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8", newline="\n") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()

