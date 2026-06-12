import centerDoc from "./content/数据中心简介.doc.json";
import databaseDoc from "./content/25.06.25-数据库建设介绍.doc.json";
import expertsDoc from "./content/25.06.25-专家介绍.doc.json";
import achievementsWord from "./content/achievements.word.json";
import achievementsImages from "./content/achievements.images.json";

type Block = { type: "p"; text: string } | { type: "table"; rows: string[][] };

type Disease = {
  id: string;
  name: string;
  cases: string;
  modalities: string;
  types: string[];
  status: string;
  desc: string;
  sources: string[];
  featured?: boolean;
};

type Person = {
  id: number;
  name: string;
  title: string;
  headline: string;
  hospital: string;
  directions: string[];
  desc: string;
  img: string;
};

export type Partner = {
  name: string;
  shortName: string;
  url: string;
  logo: string;
};

const liverCirrhosis: Disease = {
  id: "liver-cirrhosis",
  name: "肝硬化医学影像专病库",
  cases: "3000+",
  modalities: "腹部增强CT/腹部MRI/弹性超声/消化内镜",
  types: ["腹部增强CT", "腹部MRI", "弹性超声", "消化内镜"],
  status: "已开放",
  featured: true,
  sources: [
    "兰州大学第二医院",
    "兰州大学第一医院",
    "甘肃省人民医院",
    "甘肃省肿瘤医院",
    "兰州市各大综合医院",
    "甘肃省卫生健康委员会信息中心",
  ],
  desc:
    "肝硬化医学影像专病库是整合多模态医学影像数据、临床检验信息、病理及预后特征的结构化科研数据库，依托标准化数据采集、脱敏存储与智能分析能力，为肝硬化发病机制研究、分级诊疗及并发症预判提供支撑平台。所有影像数据严格遵循DICOM标准完成脱敏与匿名化处理，汇集3000余例病例，支持数据线上查询与下载。",
};

const diseaseModalityFallback: Record<string, string[]> = {
  胃癌医学影像专病库: ["增强CT", "超声内镜", "DECT", "FDG-PET/CT"],
  结直肠癌医学影像专病库: ["CT", "MRI", "内窥镜", "病理切片"],
  肺癌医学影像专病库: ["CT", "PET/CT", "MRI", "功能成像"],
  脑肿瘤医学影像专病库: ["MRI", "CT", "HSI", "术中超声"],
  冠心病医学影像专病库: ["CCTA", "CMR", "SPECT/PET", "IVUS"],
  肺炎医学影像专病库: ["胸部X线", "HRCT", "超声"],
};

export function getParas(blocks: Block[]) {
  return blocks.filter((b) => b.type === "p").map((b) => (b as { type: "p"; text: string }).text);
}

export function getPreview(text: string, length = 120) {
  const compact = String(text ?? "").replace(/\s+/g, "");
  return compact.length > length ? `${compact.slice(0, length)}...` : compact;
}

export function afterLabel(paras: string[], label: string) {
  const idx = paras.findIndex((t) => t.trim() === label.trim());
  if (idx < 0) return "";
  return paras[idx + 1] ?? "";
}

function splitSources(raw: string) {
  const cleaned = raw
    .replace(/本数据库主要收集整理了/, "")
    .replace(/共.+$/, "")
    .replace(/数据，实现了.*$/, "")
    .trim();
  return Array.from(
    new Set(
      cleaned
        .replace(/及/g, "、")
        .replace(/和/g, "、")
        .split("、")
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  );
}

export function parseDiseases() {
  const paras = getParas((databaseDoc as { blocks: Block[] }).blocks);
  const start = paras.findIndex((t) => t.trim() === "专病库介绍：");
  if (start < 0) return [liverCirrhosis];

  const out: Disease[] = [];
  let current: Omit<Disease, "desc" | "modalities" | "types" | "status" | "cases"> | null = null;
  let desc: string[] = [];
  let cases = "";
  let sources: string[] = [];

  const flush = () => {
    if (!current) return;
    const fullDesc = desc.join("\n").trim();
    const fallback = diseaseModalityFallback[current.name] ?? [];
    out.push({
      ...current,
      desc: fullDesc,
      cases: cases ? `${cases}+` : "病例数据",
      modalities: fallback.join("/"),
      types: fallback,
      sources,
      status: "线上共享",
    });
    current = null;
    desc = [];
    cases = "";
    sources = [];
  };

  for (let i = start + 1; i < paras.length; i++) {
    const line = paras[i].trim();
    if (line === "团队荣誉介绍：") break;
    const head = line.match(/^(\d+)\.(.+专病库)$/);
    if (head) {
      flush();
      current = { id: head[1], name: head[2], sources: [] };
      continue;
    }
    if (!current) continue;
    if (line.startsWith("共享方式：")) continue;
    if (line.startsWith("联系人：")) continue;
    if (line.startsWith("联系方式：")) continue;
    const caseMatch = line.match(/共(\d+[^例]{0,6})例/);
    if (caseMatch) cases = caseMatch[1].replace(/余$/, "");
    const sourceMatch = line.match(/本数据库主要收集整理了(.+?)共/);
    if (sourceMatch) sources = splitSources(sourceMatch[0]);
    desc.push(line);
  }
  flush();
  return [liverCirrhosis, ...out];
}

export function parsePlatforms() {
  const paras = getParas((databaseDoc as { blocks: Block[] }).blocks);
  const platforms: { name: string; points: string[] }[] = [];
  let current: { name: string; points: string[] } | null = null;

  const push = () => {
    if (current && current.points.length) platforms.push(current);
    current = null;
  };

  for (const raw of paras) {
    const line = raw.trim();
    const head = line.match(/^(.*?)(?:科研)?平台操作平台特点[:：]$/);
    if (head) {
      push();
      current = { name: head[1].trim(), points: [] };
      continue;
    }
    if (!current) continue;
    if (line.endsWith("操作界面：") || line === "2.数据中心现有配置" || line === "专病库介绍：") {
      push();
      continue;
    }
    if (line.length <= 32) current.points.push(line);
  }
  push();
  return platforms;
}

function sliceBetween(paras: string[], startLabel: string, endLabel: string) {
  const startIdx = paras.findIndex((t) => t.trim() === startLabel.trim());
  const endIdx = paras.findIndex((t) => t.trim() === endLabel.trim());
  const start = startIdx >= 0 ? startIdx + 1 : 0;
  const end = endIdx >= 0 ? endIdx : paras.length;
  return paras.slice(start, end);
}

function sliceAfter(paras: string[], startLabel: string) {
  const idx = paras.findIndex((t) => t.trim() === startLabel.trim());
  return idx >= 0 ? paras.slice(idx + 1) : [];
}

function parsePeople(paras: string[], imageBase: "experts" | "staff") {
  const people: Person[] = [];
  let current: Person | null = null;
  let bio: string[] = [];

  const flush = () => {
    if (!current) return;
    const desc = bio.join("\n").trim();
    people.push({
      ...current,
      desc,
      directions: extractDirections(`${current.headline} ${desc}`),
    });
    current = null;
    bio = [];
  };

  for (const raw of paras) {
    const line = raw.trim();
    if (!line) continue;
    const match = line.match(/^(?:(\d+)\.\s*)?([^：]{2,16})：(.+)$/);
    if (match) {
      flush();
      const id = Number(match[1] || people.length + 1);
      const name = match[2].trim();
      const headline = match[3].trim();
      current = {
        id,
        name,
        headline,
        title: parseTitle(headline),
        hospital: parseHospital(headline),
        directions: [],
        desc: "",
        img: `/images/${imageBase}/${id}.png`,
      };
      continue;
    }
    if (current) bio.push(line);
  }
  flush();
  return people;
}

function parseTitle(headline: string) {
  const parts = headline.split(/[，,]/).map((s) => s.trim()).filter(Boolean);
  return parts.slice(-2).join(" / ") || headline;
}

function parseHospital(headline: string) {
  const match = headline.match(/^(.+?)(?:放射|影像|信息|主任|博士|，|,)/);
  return match?.[1]?.trim() || "医学影像数据中心";
}

function extractDirections(text: string) {
  const candidates = [
    "医学影像AI",
    "放射影像",
    "MRI",
    "CT",
    "数据治理",
    "医学信息",
    "质量控制",
    "心血管影像",
    "肿瘤影像",
    "肝脏影像",
    "影像技术",
  ];
  return candidates.filter((item) => text.includes(item)).slice(0, 3);
}

export const centerParagraphs = getParas((centerDoc as { blocks: Block[] }).blocks);
export const centerIntro = centerParagraphs[0] ?? "";
export const centerInfra = centerParagraphs[1] ?? "";
export const centerPlatform = centerParagraphs[2] ?? "";
export const centerTeam = centerParagraphs[3] ?? "";

export const databaseParas = getParas((databaseDoc as { blocks: Block[] }).blocks);
export const equipmentText = afterLabel(databaseParas, "设备介绍：");
export const sharingPlatformText = afterLabel(databaseParas, "共享数据库介绍：");
export const softwareIntro = afterLabel(databaseParas, "1.科研平台");
export const configText = afterLabel(databaseParas, "2.数据中心现有配置");
export const diseases = parseDiseases();
export const researchPlatforms = parsePlatforms();

const expertParas = getParas((expertsDoc as { blocks: Block[] }).blocks);
export const experts = parsePeople(sliceBetween(expertParas, "专家组成员：", "主要工作人员:"), "experts");
export const staff = parsePeople(sliceAfter(expertParas, "主要工作人员:"), "staff");

export const achievementSections = (achievementsWord as { sections: { key: string; title: string; lines: string[] }[] })
  .sections;
export const achievementImages = (achievementsImages as {
  groups: { key: string; title: string; items: { src: string; heading: string; caption?: string; nearestText: string }[] }[];
}).groups;

export const siteStats = [
  { value: "8000+", label: "医学影像病例" },
  { value: "10+", label: "常见疾病专病库" },
  { value: "32家", label: "合作医院" },
  { value: "700T+", label: "数据存储" },
];

export const partners: Partner[] = [
  {
    name: "兰州大学第二医院",
    shortName: "兰大二院",
    url: "https://www.lzush.com.cn/",
    logo: "/images/partners/lzush.png",
  },
  {
    name: "兰州大学第一医院",
    shortName: "兰大一院",
    url: "https://www.lzdxdyyy.com/web/ldyy/cover",
    logo: "/images/partners/lzdxdyyy.png",
  },
  {
    name: "甘肃省人民医院",
    shortName: "省人民医院",
    url: "https://www.gsyy.cn/",
    logo: "/images/partners/gsyy.svg",
  },
  {
    name: "甘肃省肿瘤医院",
    shortName: "省肿瘤医院",
    url: "https://gsszlyy.cn/menhu/home",
    logo: "/images/partners/gsszlyy.png",
  },
  {
    name: "甘肃省卫生健康委员会信息中心",
    shortName: "省卫健委",
    url: "https://wsjk.gansu.gov.cn/",
    logo: "/images/partners/wsjk.svg",
  },
  {
    name: "联勤保障部队第九四〇医院",
    shortName: "第940医院",
    url: "https://gsyygh.com/arweb/hospital/jumptohtml?hosCode=ljzy",
    logo: "/images/partners/940.svg",
  },
];

export const liverCirrhosisDetail = liverCirrhosis;
