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


def rounded(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], fill: str, outline: str = "#ffffff", width: int = 0, radius: int = 32) -> None:
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def arrow(draw: ImageDraw.ImageDraw, p1: tuple[float, float], p2: tuple[float, float], fill: str = "#98a2b3", width: int = 6) -> None:
    draw.line((p1[0], p1[1], p2[0], p2[1]), fill=fill, width=width)
    angle = math.atan2(p2[1] - p1[1], p2[0] - p1[0])
    length = 28
    points = [
        p2,
        (p2[0] - length * math.cos(angle - 0.45), p2[1] - length * math.sin(angle - 0.45)),
        (p2[0] - length * math.cos(angle + 0.45), p2[1] - length * math.sin(angle + 0.45)),
    ]
    draw.polygon(points, fill=fill)


def draw_centered_text(
    draw: ImageDraw.ImageDraw,
    box: tuple[int, int, int, int],
    text: str,
    text_font: ImageFont.FreeTypeFont,
    fill: str,
    max_chars: int,
) -> None:
    lines: list[str] = []
    for part in text.split("\n"):
        while len(part) > max_chars:
            lines.append(part[:max_chars])
            part = part[max_chars:]
        lines.append(part)
    metrics = [draw.textbbox((0, 0), line, font=text_font) for line in lines]
    heights = [m[3] - m[1] for m in metrics]
    widths = [m[2] - m[0] for m in metrics]
    gap = 8
    total_h = sum(heights) + gap * (len(lines) - 1)
    y = box[1] + (box[3] - box[1] - total_h) / 2
    for line, line_w, line_h in zip(lines, widths, heights):
        draw.text((box[0] + (box[2] - box[0] - line_w) / 2, y), line, font=text_font, fill=fill)
        y += line_h + gap


def draw_architecture() -> None:
    width, height = 3840, 2160
    image = Image.new("RGB", (width, height), "#f7f8f6")
    draw = ImageDraw.Draw(image)
    navy = "#0d2b52"
    crimson = "#8b1a1a"
    gold = "#c8a96e"
    ink = "#172033"
    muted = "#667085"

    for x in range(180, width, 180):
        draw.line((x, 210, x, height - 170), fill="#eef0f3", width=2)
    for y in range(240, height, 170):
        draw.line((140, y, width - 140, y), fill="#eef0f3", width=2)

    draw.text((180, 110), "肝硬化医学影像专病库 · 四层数据架构", font=font(78, True), fill=navy)
    draw.text((185, 208), "DICOM 脱敏匿名化、多模态影像分层、临床-病理-预后字段结构化绑定", font=font(35), fill=muted)
    draw.line((180, 282, 3660, 282), fill="#d6d9df", width=4)

    rounded(draw, (170, 370, 740, 1790), "#ffffff", "#e4e7ec", 4, 44)
    draw.text((230, 430), "多中心数据来源", font=font(48, True), fill=navy)
    sources = ["兰州大学第二医院", "兰州大学第一医院", "甘肃省人民医院", "甘肃省肿瘤医院", "兰州市综合医院", "省卫健委信息中心"]
    for i, source in enumerate(sources):
        y = 540 + i * 175
        rounded(draw, (235, y, 675, y + 112), "#f9fafb", "#d9dee8", 3, 24)
        draw.rectangle((255, y + 28, 305, y + 82), fill=navy)
        draw.rectangle((315, y + 44, 360, y + 82), fill="#24496f")
        draw.text((385, y + 36), source, font=font(29), fill=ink)

    rounded(draw, (820, 530, 1215, 1640), "#102f58", "#d0dae8", 3, 42)
    draw.text((880, 590), "标准化采集", font=font(48, True), fill="#ffffff")
    draw.text((880, 652), "与治理闸门", font=font(48, True), fill="#ffffff")
    governance = [
        ("DICOM 标准接入", "统一影像元数据"),
        ("脱敏匿名化", "去除身份字段 · 重置访问标识"),
        ("质控与索引", "模态、时间、机构、病种索引"),
        ("授权访问", "线上查询 · 审核下载 · 日志追踪"),
    ]
    for i, (title, desc) in enumerate(governance):
        y = 770 + i * 190
        rounded(draw, (885, y, 1150, y + 126), "#ffffff", "#ffffff", 0, 24)
        draw.text((915, y + 22), title, font=font(36, True), fill=crimson if i == 1 else navy)
        draw.text((915, y + 76), desc, font=font(23), fill=muted)
        if i < len(governance) - 1:
            arrow(draw, (1018, y + 136), (1018, y + 178), gold, 5)

    hub = (1580, 760, 2260, 1405)
    rounded(draw, hub, "#ffffff", "#d7dce5", 4, 52)
    draw.ellipse((1685, 835, 2155, 1140), fill="#edf3f8", outline=navy, width=5)
    draw.arc((1685, 835, 2155, 910), 0, 360, fill=navy, width=5)
    draw.line((1685, 872, 1685, 1065), fill=navy, width=5)
    draw.line((2155, 872, 2155, 1065), fill=navy, width=5)
    draw.arc((1685, 1030, 2155, 1140), 0, 180, fill=navy, width=5)
    draw_centered_text(draw, (1690, 890, 2150, 1075), "肝硬化专病\n结构化数据湖", font(46, True), navy, 8)
    draw.text((1645, 1200), "病例主索引 · 影像征象 · 检验指标 · 病理分期 · 随访事件", font=font(29), fill=muted)
    draw.text((1775, 1288), "3000+ 病例", font=font(45, True), fill=crimson)

    layers = [
        {
            "name": "影像层",
            "box": (1355, 410, 2485, 665),
            "color": "#f7e8e8",
            "accent": crimson,
            "nodes": [("增强CT", "门静脉期/延迟期"), ("腹部MRI", "T1/T2/DWI/增强"), ("弹性超声", "LSM/脾硬度"), ("消化内镜", "静脉曲张征象")],
        },
        {
            "name": "临床层",
            "box": (2495, 760, 3550, 1035),
            "color": "#eaf0f7",
            "accent": navy,
            "nodes": [("肝功能指标", "ALT/AST/TBil/INR"), ("病因分型", "乙肝/酒精/代谢"), ("并发症记录", "腹水/出血/感染"), ("干预治疗", "药物/内镜/介入")],
        },
        {
            "name": "病理层",
            "box": (1355, 1500, 2485, 1810),
            "color": "#fff4df",
            "accent": "#a16b13",
            "nodes": [("肝纤维化分期", "F1-F4 结构化记录"), ("病理特征", "炎症活动度/结节形成"), ("影像征象绑定", "脾大/侧支循环/腹水"), ("科研字段体系", "可追溯变量字典")],
        },
        {
            "name": "预后层",
            "box": (1165, 760, 1565, 1405),
            "color": "#edf7f3",
            "accent": "#0f766e",
            "vertical": True,
            "nodes": [("随访预后", "复诊/再入院/死亡"), ("并发症预判", "出血/肝癌/肝衰竭"), ("分级诊疗", "风险分层与转诊"), ("科研输出", "机制研究/模型验证")],
        },
    ]

    for layer in layers:
        x1, y1, x2, y2 = layer["box"]
        rounded(draw, (x1, y1, x2, y2), layer["color"], "#d7dce5", 4, 42)
        rounded(draw, (x1 + 28, y1 + 30, x1 + 230, y1 + 92), layer["accent"], layer["accent"], 0, 18)
        draw.text((x1 + 70, y1 + 43), layer["name"], font=font(38, True), fill="#ffffff")
        if layer.get("vertical"):
            node_height = (y2 - y1 - 155) / 4
            for j, (title, desc) in enumerate(layer["nodes"]):
                nx1, nx2 = x1 + 35, x2 - 35
                ny1 = int(y1 + 120 + j * (node_height + 9))
                ny2 = int(ny1 + node_height)
                rounded(draw, (nx1, ny1, nx2, ny2), "#ffffff", "#e4e7ec", 3, 24)
                draw.ellipse((nx1 + 22, ny1 + 22, nx1 + 72, ny1 + 72), fill=layer["accent"])
                draw.text((nx1 + 47, ny1 + 30), str(j + 1), font=font(27, True), fill="#ffffff", anchor="ma")
                draw.text((nx1 + 90, ny1 + 20), title, font=font(28, True), fill=ink)
                draw.text((nx1 + 28, ny1 + 72), desc, font=font(21), fill=muted)
        else:
            node_width = (x2 - x1 - 90) / 4
            for j, (title, desc) in enumerate(layer["nodes"]):
                nx1 = int(x1 + 35 + j * (node_width + 8))
                nx2 = int(nx1 + node_width)
                ny1, ny2 = y1 + 122, y2 - 35
                rounded(draw, (nx1, ny1, nx2, ny2), "#ffffff", "#e4e7ec", 3, 24)
                draw.ellipse((nx1 + 22, ny1 + 22, nx1 + 72, ny1 + 72), fill=layer["accent"])
                draw.text((nx1 + 47, ny1 + 30), str(j + 1), font=font(27, True), fill="#ffffff", anchor="ma")
                draw.text((nx1 + 90, ny1 + 22), title, font=font(28, True), fill=ink)
                draw.text((nx1 + 28, ny1 + 84), desc, font=font(22), fill=muted)
        cx, cy = (x1 + x2) / 2, (y1 + y2) / 2
        hub_c = ((hub[0] + hub[2]) / 2, (hub[1] + hub[3]) / 2)
        if cy < hub[1]:
            arrow(draw, (cx, y2 + 8), (hub_c[0], hub[1] - 12), layer["accent"], 7)
        elif cy > hub[3]:
            arrow(draw, (cx, y1 - 8), (hub_c[0], hub[3] + 12), layer["accent"], 7)
        elif cx < hub[0]:
            arrow(draw, (x2 + 8, cy), (hub[0] - 12, hub_c[1]), layer["accent"], 7)
        else:
            arrow(draw, (x1 - 8, cy), (hub[2] + 12, hub_c[1]), layer["accent"], 7)

    rounded(draw, (2600, 1220, 3550, 1800), "#ffffff", "#d7dce5", 4, 42)
    draw.text((2660, 1280), "科研与临床支撑", font=font(48, True), fill=navy)
    outputs = [("发病机制研究", "跨模态变量关联与队列分析"), ("分级诊疗", "按病程、风险和机构能力协同"), ("并发症预判", "随访事件驱动的风险提示"), ("数据共享服务", "授权查询、下载与使用审计")]
    for i, (title, desc) in enumerate(outputs):
        x = 2670 + (i % 2) * 430
        y = 1385 + (i // 2) * 180
        rounded(draw, (x, y, x + 380, y + 125), "#f9fafb", "#e4e7ec", 3, 24)
        draw.text((x + 28, y + 26), title, font=font(29, True), fill=crimson if i == 2 else navy)
        draw.text((x + 28, y + 76), desc, font=font(22), fill=muted)
    arrow(draw, (2265, 1225), (2600, 1430), gold, 8)
    arrow(draw, (2265, 1205), (2600, 1620), gold, 8)

    rounded(draw, (180, 1910, 3660, 2030), "#ffffff", "#d7dce5", 3, 24)
    strip = ["标准化采集", "DICOM 脱敏", "匿名化存储", "变量字典", "跨机构索引", "访问审计"]
    for i, item in enumerate(strip):
        x = 260 + i * 560
        draw.ellipse((x, 1940, x + 42, 1982), fill=gold if i % 2 else crimson)
        draw.text((x + 62, 1938), item, font=font(29), fill=ink)
        if i < len(strip) - 1:
            arrow(draw, (x + 250, 1962), (x + 490, 1962), "#cfd5df", 4)
    draw.text((180, 2074), "Figure prompt contract: layer labels are embedded inside modules; no detached legend-only text layer; conceptual architecture only, not a statistical figure.", font=font(24), fill="#98a2b3")
    image.save(BRAND_DIR / "four-layer-architecture-4k.png", quality=95)


def write_architecture_prompt() -> None:
    prompt = """Use case: infographic-diagram
Asset type: website architecture figure, 3840x2160 landscape
Primary request: Redesign the cirrhosis medical imaging special-disease database four-layer data architecture as an academic professional schematic. The text must be embedded naturally inside the architecture modules, nodes, pipeline bands, data cards, DICOM thumbnails, pathology tiles, timeline chips, and central data-lake cylinder. Do not place the four layer texts as detached labels floating above boxes or as a separate high-level legend. Avoid four isolated boxes.
Required in-image text, verbatim: 肝硬化医学影像专病库 · 四层数据架构; 多中心数据来源; 标准化采集与治理闸门; DICOM 标准接入; 脱敏匿名化; 质控与索引; 授权访问; 影像层; 增强CT; 腹部MRI; 弹性超声; 消化内镜; 临床层; 肝功能指标; 病因分型; 并发症记录; 干预治疗; 病理层; 肝纤维化分期; 病理特征; 影像征象绑定; 科研字段体系; 预后层; 随访预后; 并发症预判; 分级诊疗; 科研输出; 肝硬化专病结构化数据湖; 科研与临床支撑.
Style/medium: Nature/Figure4papers-inspired medical imaging architecture diagram, clean white/ivory canvas, restrained Lanzhou University navy, crimson, and gold accents, precise arrows, publication-grade typography, clear Chinese labels.
Composition/framing: left-to-right data governance pipeline with a central structured data-lake hub and four integrated multimodal layer bands around it, plus downstream research/clinical support outputs. Labels live inside their corresponding nodes.
Constraints: text legible at 4K, no watermark, no detached top-level text list, no decorative unrelated icons, conceptual figure only.
"""
    (BRAND_DIR / "four-layer-architecture-prompt.md").write_text(prompt, encoding="utf-8")
    svg = """<svg xmlns="http://www.w3.org/2000/svg" width="3840" height="2160" viewBox="0 0 3840 2160">
  <rect width="3840" height="2160" fill="#f7f8f6"/>
  <text x="180" y="175" font-family="Noto Sans SC, Microsoft YaHei, sans-serif" font-size="78" font-weight="700" fill="#0d2b52">肝硬化医学影像专病库 · 四层数据架构</text>
  <text x="185" y="245" font-family="Noto Sans SC, Microsoft YaHei, sans-serif" font-size="35" fill="#667085">DICOM 脱敏匿名化、多模态影像分层、临床-病理-预后字段结构化绑定</text>
  <g font-family="Noto Sans SC, Microsoft YaHei, sans-serif">
    <rect x="170" y="370" width="570" height="1420" rx="44" fill="#fff" stroke="#e4e7ec" stroke-width="4"/>
    <text x="230" y="485" font-size="48" font-weight="700" fill="#0d2b52">多中心数据来源</text>
    <rect x="820" y="530" width="395" height="1110" rx="42" fill="#102f58"/>
    <text x="880" y="645" font-size="48" font-weight="700" fill="#fff">标准化采集与治理闸门</text>
    <rect x="1580" y="760" width="680" height="645" rx="52" fill="#fff" stroke="#d7dce5" stroke-width="4"/>
    <text x="1740" y="990" font-size="48" font-weight="700" fill="#0d2b52">肝硬化专病结构化数据湖</text>
    <rect x="1355" y="410" width="1130" height="255" rx="42" fill="#f7e8e8"/>
    <text x="1425" y="490" font-size="38" font-weight="700" fill="#8b1a1a">影像层：增强CT · 腹部MRI · 弹性超声 · 消化内镜</text>
    <rect x="2495" y="760" width="1055" height="275" rx="42" fill="#eaf0f7"/>
    <text x="2565" y="845" font-size="38" font-weight="700" fill="#0d2b52">临床层：肝功能指标 · 病因分型 · 并发症记录 · 干预治疗</text>
    <rect x="1355" y="1500" width="1130" height="310" rx="42" fill="#fff4df"/>
    <text x="1425" y="1590" font-size="38" font-weight="700" fill="#a16b13">病理层：肝纤维化分期 · 病理特征 · 影像征象绑定 · 科研字段体系</text>
    <rect x="525" y="760" width="985" height="275" rx="42" fill="#edf7f3"/>
    <text x="595" y="845" font-size="38" font-weight="700" fill="#0f766e">预后层：随访预后 · 并发症预判 · 分级诊疗 · 科研输出</text>
    <rect x="2600" y="1220" width="950" height="580" rx="42" fill="#fff" stroke="#d7dce5" stroke-width="4"/>
    <text x="2660" y="1335" font-size="48" font-weight="700" fill="#0d2b52">科研与临床支撑</text>
  </g>
</svg>"""
    (BRAND_DIR / "four-layer-architecture-4k.svg").write_text(svg, encoding="utf-8")


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
    draw_architecture()
    write_architecture_prompt()


if __name__ == "__main__":
    main()
