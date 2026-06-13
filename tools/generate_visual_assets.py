from __future__ import annotations

import math
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
PAGE_DIR = ROOT / "public" / "images" / "page-bg"
BRAND_DIR = ROOT / "public" / "images" / "brand"

FONT_REGULAR = r"C:\Windows\Fonts\NotoSansSC-VF.ttf"
FONT_BOLD = r"C:\Windows\Fonts\msyhbd.ttc"
FONT_FALLBACK = r"C:\Windows\Fonts\msyh.ttc"


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    try:
      return ImageFont.truetype(FONT_BOLD if bold else FONT_REGULAR, size)
    except OSError:
      return ImageFont.truetype(FONT_FALLBACK, size)


def jittered_line(
    draw: ImageDraw.ImageDraw,
    points: list[tuple[float, float]],
    fill: tuple[int, int, int, int],
    width: int = 3,
    repeats: int = 2,
    seed: int = 0,
) -> None:
    rnd = random.Random(seed)
    for repeat in range(repeats):
        shifted = [
            (x + rnd.uniform(-2.2, 2.2), y + rnd.uniform(-2.2, 2.2))
            for x, y in points
        ]
        draw.line(shifted, fill=fill, width=max(1, width - repeat), joint="curve")


def rect_sketch(
    draw: ImageDraw.ImageDraw,
    box: tuple[float, float, float, float],
    fill: tuple[int, int, int, int],
    width: int = 3,
    radius: int = 0,
    seed: int = 0,
) -> None:
    rnd = random.Random(seed)
    for _ in range(2):
        offset = rnd.uniform(-2, 2)
        shifted = (box[0] + offset, box[1] - offset, box[2] - offset, box[3] + offset)
        if radius:
            draw.rounded_rectangle(shifted, radius=radius, outline=fill, width=width)
        else:
            draw.rectangle(shifted, outline=fill, width=width)


def circle_sketch(
    draw: ImageDraw.ImageDraw,
    box: tuple[float, float, float, float],
    fill: tuple[int, int, int, int],
    width: int = 3,
    seed: int = 0,
) -> None:
    rnd = random.Random(seed)
    for _ in range(2):
        offset = rnd.uniform(-3, 3)
        draw.ellipse(
            (box[0] + offset, box[1] - offset, box[2] - offset, box[3] + offset),
            outline=fill,
            width=width,
        )


def draw_ct_slice(draw: ImageDraw.ImageDraw, cx: float, cy: float, radius: float, seed: int) -> None:
    white = (255, 255, 255, 210)
    soft = (255, 255, 255, 118)
    faint = (255, 255, 255, 62)
    circle_sketch(draw, (cx - radius, cy - radius, cx + radius, cy + radius), white, 4, seed)
    circle_sketch(
        draw,
        (cx - radius * 0.58, cy - radius * 0.58, cx + radius * 0.58, cy + radius * 0.58),
        soft,
        2,
        seed + 1,
    )
    for angle in range(0, 360, 45):
        x = cx + math.cos(math.radians(angle)) * radius * 0.78
        y = cy + math.sin(math.radians(angle)) * radius * 0.78
        draw.line((cx, cy, x, y), fill=faint, width=1)


def draw_database_cylinder(
    draw: ImageDraw.ImageDraw,
    cx: float,
    cy: float,
    width: float,
    height: float,
    label: str | None,
    seed: int,
) -> None:
    white = (255, 255, 255, 210)
    soft = (255, 255, 255, 118)
    strong = (255, 255, 255, 232)
    x1, x2 = cx - width / 2, cx + width / 2
    y1, y2 = cy - height / 2, cy + height / 2
    draw.ellipse((x1, y1, x2, y1 + height * 0.18), outline=white, width=4)
    draw.arc((x1, y2 - height * 0.18, x2, y2), 0, 180, fill=soft, width=3)
    jittered_line(draw, [(x1, y1 + height * 0.09), (x1, y2 - height * 0.09)], white, 4, seed=seed + 1)
    jittered_line(draw, [(x2, y1 + height * 0.09), (x2, y2 - height * 0.09)], white, 4, seed=seed + 2)
    for part in (0.35, 0.55, 0.75):
        draw.arc((x1, y1 + height * part, x2, y1 + height * part + height * 0.18), 0, 180, fill=soft, width=2)
    if label:
        draw.text((cx, cy - 16), label, font=font(30, True), fill=strong, anchor="mm")


def draw_liver(draw: ImageDraw.ImageDraw, cx: float, cy: float, scale: float) -> None:
    white = (255, 255, 255, 210)
    soft = (255, 255, 255, 118)
    strong = (255, 255, 255, 232)
    points = [
        (cx - 220 * scale, cy - 20 * scale),
        (cx - 150 * scale, cy - 120 * scale),
        (cx + 70 * scale, cy - 138 * scale),
        (cx + 230 * scale, cy - 84 * scale),
        (cx + 215 * scale, cy + 38 * scale),
        (cx + 88 * scale, cy + 104 * scale),
        (cx - 80 * scale, cy + 90 * scale),
        (cx - 210 * scale, cy + 38 * scale),
    ]
    jittered_line(draw, points + [points[0]], white, 5, seed=23)
    for i, offset in enumerate((-70, -35, 0, 35, 70)):
        jittered_line(
            draw,
            [(cx - 145 * scale, cy + offset * scale), (cx + 170 * scale, cy + (offset * 0.35) * scale)],
            soft,
            2,
            seed=70 + i,
        )
    jittered_line(draw, [(cx - 10 * scale, cy + 60 * scale), (cx + 20 * scale, cy + 10 * scale), (cx + 70 * scale, cy - 42 * scale)], strong, 3, seed=80)
    jittered_line(draw, [(cx + 20 * scale, cy + 10 * scale), (cx - 52 * scale, cy - 34 * scale)], strong, 3, seed=81)
    jittered_line(draw, [(cx + 20 * scale, cy + 10 * scale), (cx + 120 * scale, cy + 8 * scale)], strong, 3, seed=82)


def draw_building(draw: ImageDraw.ImageDraw, x: float, y: float, width: float, height: float, seed: int) -> None:
    white = (255, 255, 255, 210)
    soft = (255, 255, 255, 118)
    faint = (255, 255, 255, 62)
    rect_sketch(draw, (x, y, x + width, y + height), white, 3, seed=seed)
    for i in range(1, 5):
        yy = y + i * height / 5
        jittered_line(draw, [(x, yy), (x + width, yy)], soft, 2, seed=seed + i)
    for i in range(1, 7):
        xx = x + i * width / 7
        jittered_line(draw, [(xx, y + 8), (xx, y + height - 8)], faint, 1, seed=seed + 10 + i)
    tower_x = x + width * 0.46
    tower_w = width * 0.18
    rect_sketch(draw, (tower_x, y - height * 0.36, tower_x + tower_w, y + height * 0.18), white, 3, seed=seed + 30)
    circle_sketch(
        draw,
        (tower_x + tower_w * 0.26, y - height * 0.18, tower_x + tower_w * 0.74, y - height * 0.18 + tower_w * 0.48),
        soft,
        2,
        seed=seed + 31,
    )
    jittered_line(draw, [(tower_x + tower_w / 2, y - height * 0.36), (tower_x + tower_w / 2, y - height * 0.54)], white, 3, seed=seed + 32)


def draw_people(draw: ImageDraw.ImageDraw, cx: float, cy: float, count: int, seed: int) -> None:
    white = (255, 255, 255, 210)
    soft = (255, 255, 255, 118)
    for i in range(count):
        x = cx + (i - (count - 1) / 2) * 150
        circle_sketch(draw, (x - 36, cy - 110, x + 36, cy - 38), white, 3, seed + i)
        jittered_line(draw, [(x - 75, cy + 90), (x - 48, cy - 20), (x + 48, cy - 20), (x + 75, cy + 90)], white, 3, seed=seed + 10 + i)
        jittered_line(draw, [(x - 42, cy + 12), (x + 42, cy + 12)], soft, 2, seed=seed + 20 + i)


def draw_page_background(name: str, title: str, mode: str) -> None:
    width, height = 1800, 760
    white = (255, 255, 255, 210)
    soft = (255, 255, 255, 118)
    faint = (255, 255, 255, 62)
    strong = (255, 255, 255, 232)
    image = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    seed = sum(ord(ch) for ch in name)
    rnd = random.Random(seed)
    for x in range(80, width, 150):
        jittered_line(draw, [(x, 85), (x + rnd.randint(-18, 18), height - 90)], (255, 255, 255, 28), 1, 1, seed + x)
    for y in range(100, height, 130):
        jittered_line(draw, [(40, y), (width - 70, y + rnd.randint(-12, 12))], (255, 255, 255, 26), 1, 1, seed + y)

    if mode == "data-center":
        draw_building(draw, 980, 300, 620, 250, seed=11)
        draw_database_cylinder(draw, 760, 430, 190, 260, "PACS", seed=12)
        for i, (x, y) in enumerate([(1120, 170), (1320, 145), (1520, 190), (1660, 300), (930, 245)]):
            circle_sketch(draw, (x - 26, y - 26, x + 26, y + 26), strong, 3, 20 + i)
            jittered_line(draw, [(760, 430), (x, y)], soft, 2, seed=30 + i)
        for x, y, text in [(1080, 610, "省"), (1230, 625, "市"), (1380, 610, "县"), (1530, 625, "乡")]:
            rect_sketch(draw, (x - 48, y - 32, x + 48, y + 32), soft, 2, 10, seed=x)
            draw.text((x, y), text, font=font(28, True), fill=strong, anchor="mm")
    elif mode == "database":
        for i, (cx, cy, label) in enumerate([(830, 380, "DICOM"), (1110, 430, "CT/MR"), (1390, 380, "US")]):
            draw_database_cylinder(draw, cx, cy, 210, 290, label, seed=50 + i)
        for i, (cx, cy) in enumerate([(690, 235), (1580, 250), (1570, 570), (720, 600)]):
            draw_ct_slice(draw, cx, cy, 70, seed=80 + i)
    elif mode == "disease-detail":
        draw_liver(draw, 1180, 390, 1.28)
        for i, (cx, cy, label) in enumerate([(790, 235, "CT"), (1580, 250, "MRI"), (780, 580, "US"), (1585, 565, "内镜")]):
            draw_ct_slice(draw, cx, cy, 62, seed=120 + i)
            draw.text((cx, cy + 86), label, font=font(26, True), fill=strong, anchor="mm")
            jittered_line(draw, [(cx + 70 if cx < 1000 else cx - 70, cy), (1050 if cx < 1000 else 1320, 370)], soft, 2, seed=130 + i)
    elif mode == "experts":
        draw_people(draw, 1240, 450, 4, 140)
        rect_sketch(draw, (880, 180, 1610, 650), faint, 2, 28, 150)
        for i, (x, y) in enumerate([(930, 230), (1510, 230), (980, 620), (1450, 615)]):
            draw_ct_slice(draw, x, y, 42, seed=155 + i)
    elif mode == "research":
        rect_sketch(draw, (780, 180, 1620, 630), soft, 3, 18, 170)
        rect_sketch(draw, (900, 250, 1330, 470), white, 3, 8, 171)
        for i, bar_height in enumerate([80, 130, 105, 165, 115]):
            x = 950 + i * 62
            draw.rectangle((x, 430 - bar_height, x + 34, 430), outline=soft, width=3)
        jittered_line(draw, [(1220, 410), (1285, 335), (1320, 368), (1385, 285), (1450, 320)], strong, 3, seed=172)
        circle_sketch(draw, (1370, 220, 1520, 370), white, 3, 173)
    elif mode == "contact":
        draw_building(draw, 1000, 305, 540, 245, seed=190)
        for i, points in enumerate([
            [(760, 610), (960, 500), (1220, 555), (1660, 430)],
            [(850, 245), (1050, 330), (1320, 305), (1620, 210)],
            [(840, 180), (920, 380), (890, 620)],
            [(1510, 165), (1400, 340), (1460, 650)],
        ]):
            jittered_line(draw, points, soft, 8 if i < 2 else 5, seed=200 + i)
        cx, cy = 1250, 240
        circle_sketch(draw, (cx - 56, cy - 56, cx + 56, cy + 56), strong, 5, 210)
        jittered_line(draw, [(cx, cy + 76), (cx - 36, cy + 20), (cx + 36, cy + 20), (cx, cy + 76)], strong, 5, seed=211)
        draw.text((cx, cy + 4), "兰大二院", font=font(24, True), fill=strong, anchor="mm")

    draw.text((width - 140, 105), title, font=font(34, True), fill=(255, 255, 255, 150), anchor="ra")
    image = Image.alpha_composite(image.filter(ImageFilter.GaussianBlur(0.35)), image)
    image.save(PAGE_DIR / f"{name}.png")


def main() -> None:
    PAGE_DIR.mkdir(parents=True, exist_ok=True)
    BRAND_DIR.mkdir(parents=True, exist_ok=True)
    pages = {
        "data-center": ("数据中心简介", "data-center"),
        "database": ("数据库建设", "database"),
        "disease-detail": ("肝硬化专病库", "disease-detail"),
        "experts": ("专家团队", "experts"),
        "research": ("科研成果", "research"),
        "contact": ("联系我们", "contact"),
    }
    for name, (title, mode) in pages.items():
        draw_page_background(name, title, mode)


if __name__ == "__main__":
    main()
