import { useEffect, useRef } from "react";

const layers = [
  {
    title: "影像层",
    color: "#8b1a1a",
    fill: "#f8e8e8",
    x: 760,
    y: 140,
    w: 900,
    h: 180,
    items: ["增强CT", "腹部MRI", "弹性超声", "消化内镜"],
  },
  {
    title: "临床层",
    color: "#0d2b52",
    fill: "#e9eff7",
    x: 1530,
    y: 420,
    w: 760,
    h: 210,
    items: ["肝功能指标", "病因分型", "并发症记录", "干预治疗"],
  },
  {
    title: "病理层",
    color: "#a16b13",
    fill: "#fff4df",
    x: 760,
    y: 720,
    w: 900,
    h: 210,
    items: ["肝纤维化分期", "病理特征", "影像征象绑定", "科研字段体系"],
  },
  {
    title: "预后层",
    color: "#0f766e",
    fill: "#edf7f3",
    x: 430,
    y: 380,
    w: 430,
    h: 330,
    vertical: true,
    items: ["随访预后", "并发症预判", "分级诊疗", "科研输出"],
  },
];

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawArrow(ctx: CanvasRenderingContext2D, from: [number, number], to: [number, number], color: string) {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const angle = Math.atan2(y2 - y1, x2 - x1);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - 16 * Math.cos(angle - 0.46), y2 - 16 * Math.sin(angle - 0.46));
  ctx.lineTo(x2 - 16 * Math.cos(angle + 0.46), y2 - 16 * Math.sin(angle + 0.46));
  ctx.closePath();
  ctx.fill();
}

function drawText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, size: number, color: string, weight = 500) {
  ctx.font = `${weight} ${size}px "Noto Sans SC", "Microsoft YaHei", sans-serif`;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

export function FourLayerArchitectureCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = 2400;
    const height = 1200;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = width * ratio;
    canvas.height = height * ratio;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = "#f7f8f6";
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = "#edf0f4";
    ctx.lineWidth = 1;
    for (let x = 90; x < width; x += 120) {
      ctx.beginPath();
      ctx.moveTo(x, 110);
      ctx.lineTo(x, height - 90);
      ctx.stroke();
    }
    for (let y = 120; y < height; y += 120) {
      ctx.beginPath();
      ctx.moveTo(80, y);
      ctx.lineTo(width - 80, y);
      ctx.stroke();
    }

    drawText(ctx, "肝硬化医学影像专病库 · 四层数据架构", 110, 90, 46, "#0d2b52", 700);
    drawText(ctx, "DICOM脱敏、标准化采集、多模态影像、临床-病理-预后字段结构化绑定", 112, 135, 21, "#667085");

    roundedRect(ctx, 90, 220, 280, 720, 24);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.strokeStyle = "#d8dde6";
    ctx.stroke();
    drawText(ctx, "多中心数据来源", 130, 280, 28, "#0d2b52", 700);
    ["兰州大学第二医院", "兰州大学第一医院", "甘肃省人民医院", "甘肃省肿瘤医院", "兰州市综合医院", "省卫健委信息中心"].forEach((item, index) => {
      const y = 340 + index * 88;
      roundedRect(ctx, 125, y, 210, 52, 10);
      ctx.fillStyle = "#f9fafb";
      ctx.fill();
      ctx.strokeStyle = "#e1e5ec";
      ctx.stroke();
      ctx.fillStyle = "#0d2b52";
      ctx.fillRect(145, y + 16, 22, 22);
      drawText(ctx, item, 182, y + 34, 16, "#344054");
    });

    roundedRect(ctx, 430, 250, 250, 610, 24);
    ctx.fillStyle = "#102f58";
    ctx.fill();
    drawText(ctx, "标准化采集", 475, 315, 30, "#ffffff", 700);
    drawText(ctx, "与治理闸门", 475, 355, 30, "#ffffff", 700);
    ["DICOM标准接入", "脱敏匿名化", "质控与索引", "授权访问"].forEach((item, index) => {
      const y = 415 + index * 105;
      roundedRect(ctx, 470, y, 170, 62, 12);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      drawText(ctx, item, 492, y + 39, 18, index === 1 ? "#8b1a1a" : "#0d2b52", 700);
      if (index < 3) drawArrow(ctx, [555, y + 70], [555, y + 96], "#c8a96e");
    });

    const hub = { x: 940, y: 390, w: 430, h: 320 };
    roundedRect(ctx, hub.x, hub.y, hub.w, hub.h, 24);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.strokeStyle = "#d8dde6";
    ctx.stroke();
    ctx.strokeStyle = "#0d2b52";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(hub.x + 215, hub.y + 105, 145, 48, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(hub.x + 215, hub.y + 215, 145, 48, 0, 0, Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(hub.x + 70, hub.y + 105);
    ctx.lineTo(hub.x + 70, hub.y + 215);
    ctx.moveTo(hub.x + 360, hub.y + 105);
    ctx.lineTo(hub.x + 360, hub.y + 215);
    ctx.stroke();
    drawText(ctx, "肝硬化专病", hub.x + 145, hub.y + 142, 30, "#0d2b52", 700);
    drawText(ctx, "结构化数据湖", hub.x + 128, hub.y + 180, 30, "#0d2b52", 700);
    drawText(ctx, "3000+ 病例", hub.x + 150, hub.y + 275, 28, "#8b1a1a", 700);

    layers.forEach((layer) => {
      roundedRect(ctx, layer.x, layer.y, layer.w, layer.h, 24);
      ctx.fillStyle = layer.fill;
      ctx.fill();
      ctx.strokeStyle = "#d8dde6";
      ctx.stroke();
      roundedRect(ctx, layer.x + 22, layer.y + 22, 115, 44, 10);
      ctx.fillStyle = layer.color;
      ctx.fill();
      drawText(ctx, layer.title, layer.x + 46, layer.y + 52, 22, "#ffffff", 700);

      if (layer.vertical) {
        layer.items.forEach((item, index) => {
          const y = layer.y + 82 + index * 58;
          roundedRect(ctx, layer.x + 26, y, layer.w - 52, 46, 11);
          ctx.fillStyle = "#ffffff";
          ctx.fill();
          ctx.fillStyle = layer.color;
          ctx.beginPath();
          ctx.arc(layer.x + 54, y + 23, 14, 0, Math.PI * 2);
          ctx.fill();
          drawText(ctx, String(index + 1), layer.x + 49, y + 30, 15, "#ffffff", 700);
          drawText(ctx, item, layer.x + 82, y + 30, 18, "#172033", 700);
        });
      } else {
        const cell = (layer.w - 68) / 4;
        layer.items.forEach((item, index) => {
          const x = layer.x + 24 + index * (cell + 6);
          const y = layer.y + 86;
          roundedRect(ctx, x, y, cell, layer.h - 112, 11);
          ctx.fillStyle = "#ffffff";
          ctx.fill();
          ctx.fillStyle = layer.color;
          ctx.beginPath();
          ctx.arc(x + 28, y + 28, 15, 0, Math.PI * 2);
          ctx.fill();
          drawText(ctx, String(index + 1), x + 23, y + 36, 15, "#ffffff", 700);
          drawText(ctx, item, x + 52, y + 36, 18, "#172033", 700);
        });
      }

      const cx = layer.x + layer.w / 2;
      const cy = layer.y + layer.h / 2;
      if (cy < hub.y) drawArrow(ctx, [cx, layer.y + layer.h + 8], [hub.x + hub.w / 2, hub.y - 14], layer.color);
      else if (cy > hub.y + hub.h) drawArrow(ctx, [cx, layer.y - 8], [hub.x + hub.w / 2, hub.y + hub.h + 14], layer.color);
      else if (cx < hub.x) drawArrow(ctx, [layer.x + layer.w + 8, cy], [hub.x - 14, hub.y + hub.h / 2], layer.color);
      else drawArrow(ctx, [layer.x - 8, cy], [hub.x + hub.w + 14, hub.y + hub.h / 2], layer.color);
    });

    roundedRect(ctx, 1680, 750, 560, 220, 24);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.strokeStyle = "#d8dde6";
    ctx.stroke();
    drawText(ctx, "科研与临床支撑", 1725, 815, 30, "#0d2b52", 700);
    [["发病机制研究", "分级诊疗"], ["并发症预判", "数据共享服务"]].forEach((row, rowIndex) => {
      row.forEach((item, colIndex) => {
        const x = 1725 + colIndex * 245;
        const y = 855 + rowIndex * 62;
        roundedRect(ctx, x, y, 210, 42, 10);
        ctx.fillStyle = "#f9fafb";
        ctx.fill();
        drawText(ctx, item, x + 20, y + 28, 17, item === "并发症预判" ? "#8b1a1a" : "#0d2b52", 700);
      });
    });
    drawArrow(ctx, [hub.x + hub.w + 14, hub.y + 210], [1680, 845], "#c8a96e");

    roundedRect(ctx, 110, 1015, 2180, 70, 16);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.strokeStyle = "#d8dde6";
    ctx.stroke();
    ["标准化采集", "DICOM脱敏", "匿名化存储", "变量字典", "跨机构索引", "访问审计"].forEach((item, index) => {
      const x = 170 + index * 350;
      ctx.fillStyle = index % 2 ? "#c8a96e" : "#8b1a1a";
      ctx.beginPath();
      ctx.arc(x, 1050, 12, 0, Math.PI * 2);
      ctx.fill();
      drawText(ctx, item, x + 28, 1058, 18, "#667085");
      if (index < 5) drawArrow(ctx, [x + 145, 1050], [x + 300, 1050], "#cfd5df");
    });
  }, []);

  return (
    <div className="bg-white border border-black/8 rounded overflow-hidden shadow-sm">
      <canvas
        ref={canvasRef}
        width={2400}
        height={1200}
        className="block w-full h-auto aspect-[2/1]"
        aria-label="肝硬化医学影像专病库四层数据架构 Canvas 图"
      />
    </div>
  );
}
