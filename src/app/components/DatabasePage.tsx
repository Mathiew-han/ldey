import { ArrowRight, Camera, Shield, Tag, CheckSquare, Share2, Server, Cpu, Database, LayoutGrid } from "lucide-react";
import { Link } from "react-router";
import { configText, diseases, equipmentText, getPreview, researchPlatforms, sharingPlatformText, softwareIntro } from "../data/siteContent";
import { MetricValue } from "./MetricValue";
import { PageHero } from "./PageHero";

const processSteps = [
  {
    step: "01",
    title: "数据采集",
    desc: "多中心DICOM标准影像采集，覆盖CT、MRI、超声等模态",
    icon: Camera,
  },
  {
    step: "02",
    title: "数据治理",
    desc: "格式标准化、完整性校验、重复去除与质量审核",
    icon: LayoutGrid,
  },
  {
    step: "03",
    title: "脱敏匿名",
    desc: "患者隐私信息匿名化处理，符合国家医疗数据安全规范",
    icon: Shield,
  },
  {
    step: "04",
    title: "智能标注",
    desc: "专业医师多轮标注，ROI划分、病灶分级、结构标记",
    icon: Tag,
  },
  {
    step: "05",
    title: "数据质控",
    desc: "跨医院一致性审核，统计质检报告，专家终审确认",
    icon: CheckSquare,
  },
  {
    step: "06",
    title: "授权共享",
    desc: "合规授权管理，面向科研机构提供数据访问与下载服务",
    icon: Share2,
  },
];

const diseaseMatrix = diseases.map((disease) => ({
  name: disease.name,
  cases: disease.cases,
  modalities: disease.modalities,
  status: disease.status,
  featured: Boolean(disease.featured),
}));

const equipmentList = [
  { name: "GE Revolution 256排SCT", brand: "GE", qty: "1台", img: "CT" },
  { name: "西门子双源Force CT", brand: "Siemens", qty: "1台", img: "CT" },
  { name: "飞利浦128排SCT", brand: "Philips", qty: "1台", img: "CT" },
  { name: "佳能Aquilion Prime SP", brand: "Canon", qty: "1台", img: "CT" },
  { name: "联影uCT 780", brand: "United Imaging", qty: "1台", img: "CT" },
  { name: "美国NeuroLogica移动CT", brand: "NeuroLogica", qty: "1台", img: "CT" },
];

const platformCards = [
  {
    icon: Share2,
    title: "医学影像检查结果互认数据共享平台",
    features: ["基本覆盖甘肃省县级以上医学影像中心", "对接医院PACS系统", "对接DICOM标准影像设备", "支持影像数据实时调阅与共享"],
  },
  ...researchPlatforms.slice(0, 2).map((platform, index) => ({
    icon: index === 0 ? Database : Cpu,
    title: platform.name,
    features: platform.points.slice(0, 5),
  })),
];

export function DatabasePage() {
  return (
    <div>
      <PageHero
        title="数据库建设"
        description="遵循国际医学影像标准，构建涵盖采集、治理、标注、质控、授权、共享的全流程数据建设体系。"
        breadcrumbs={[{ label: "首页", to: "/" }, { label: "数据库建设" }]}
        background="/images/page-bg/database.png"
      />
      <div className="h-1" style={{ backgroundColor: "#8b1a1a" }} />

      {/* Process flow */}
      <section className="bg-white py-20">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-5 rounded-sm" style={{ backgroundColor: "#8b1a1a" }} />
              <span className="text-xs text-gray-500 tracking-widest uppercase">建设流程</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-medium" style={{ color: "#0d2b52" }}>
              数据全生命周期管理流程
            </h2>
          </div>

          {/* Desktop flow */}
          <div className="hidden md:flex items-stretch gap-0 overflow-x-auto pb-4">
            {processSteps.map((step, idx) => {
              const Icon = step.icon;
              const isLast = idx === processSteps.length - 1;
              return (
                <div key={step.step} className="flex items-stretch shrink-0" style={{ minWidth: "160px", flex: "1" }}>
                  <div
                    className="flex-1 border border-black/8 rounded p-5 flex flex-col"
                    style={{ backgroundColor: idx % 2 === 0 ? "#fafafa" : "white" }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="text-xs font-medium px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: "#8b1a1a", color: "white" }}
                      >
                        {step.step}
                      </span>
                    </div>
                    <div
                      className="w-9 h-9 flex items-center justify-center rounded mb-3"
                      style={{ backgroundColor: "#0d2b5215" }}
                    >
                      <Icon size={18} style={{ color: "#0d2b52" }} />
                    </div>
                    <div className="text-sm font-medium text-gray-800 mb-2">{step.title}</div>
                    <div className="text-xs text-gray-500 leading-relaxed flex-1">{step.desc}</div>
                  </div>
                  {!isLast && (
                    <div className="flex items-center justify-center w-6 shrink-0">
                      <ArrowRight size={16} className="text-gray-300" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile flow */}
          <div className="md:hidden space-y-3">
            {processSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className="flex gap-4 border border-black/8 rounded p-4 bg-white"
                >
                  <div
                    className="w-9 h-9 flex items-center justify-center rounded shrink-0"
                    style={{ backgroundColor: "#0d2b52" }}
                  >
                    <Icon size={16} className="text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-xs font-medium px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: "#8b1a1a", color: "white" }}
                      >
                        {step.step}
                      </span>
                      <span className="text-sm font-medium text-gray-800">{step.title}</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DICOM standard section */}
      <section style={{ backgroundColor: "#f7f6f4" }} className="py-20 border-t border-black/8">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-1 h-5 rounded-sm" style={{ backgroundColor: "#8b1a1a" }} />
                <span className="text-xs text-gray-500 tracking-widest uppercase">数据标准</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-medium mb-6" style={{ color: "#0d2b52" }}>
                DICOM标准与<br />脱敏匿名化规范
              </h2>
              <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                <p>
                  专病库影像数据严格遵循DICOM标准完成脱敏与匿名化处理，并通过标准化采集、质控与结构化字段管理，为医学影像科研提供可追溯的数据基础。
                </p>
                <p>
                  {getPreview(sharingPlatformText, 176)}
                </p>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { label: "DICOM标准", desc: "影像数据采集与归档" },
                  { label: "脱敏匿名化", desc: "影像数据合规治理" },
                  { label: "PACS对接", desc: "医院系统统一接入" },
                  { label: "线上服务", desc: "查询与下载支持" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="p-4 bg-white rounded border border-black/8"
                  >
                    <div className="text-sm font-medium mb-1" style={{ color: "#8b1a1a" }}>
                      {item.label}
                    </div>
                    <div className="text-xs text-gray-500">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* DICOM field table */}
            <div>
              <div className="text-xs text-gray-400 mb-3 uppercase tracking-widest">
                DICOM 匿名化字段清单（示例）
              </div>
              <div className="bg-white border border-black/8 rounded overflow-hidden">
                <div
                  className="grid grid-cols-3 text-xs font-medium px-4 py-2.5 border-b border-black/8"
                  style={{ backgroundColor: "#0d2b52", color: "white" }}
                >
                  <span>Tag</span>
                  <span>字段名称</span>
                  <span>处理方式</span>
                </div>
                {[
                  ["(0010,0010)", "Patient Name", "清空/替换随机ID"],
                  ["(0010,0020)", "Patient ID", "哈希匿名化"],
                  ["(0010,0030)", "Birth Date", "模糊化（仅保留年份）"],
                  ["(0008,0080)", "Institution Name", "代码化替换"],
                  ["(0008,0090)", "Referring Physician", "清空"],
                  ["(0010,0040)", "Patient Sex", "保留"],
                  ["(0008,0020)", "Study Date", "偏移处理"],
                  ["(0010,1010)", "Patient Age", "保留"],
                  ["(0010,1030)", "Patient Weight", "清空"],
                  ["(0018,1030)", "Protocol Name", "保留"],
                ].map(([tag, name, action]) => (
                  <div
                    key={tag}
                    className="grid grid-cols-3 text-xs px-4 py-2.5 border-b border-black/5 last:border-0 hover:bg-gray-50"
                  >
                    <span className="font-mono text-gray-400">{tag}</span>
                    <span className="text-gray-700">{name}</span>
                    <span style={{ color: "#8b1a1a" }}>{action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Equipment */}
      <section className="bg-white py-20">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-5 rounded-sm" style={{ backgroundColor: "#8b1a1a" }} />
              <span className="text-xs text-gray-500 tracking-widest uppercase">设备条件</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-medium" style={{ color: "#0d2b52" }}>
              主要影像采集设备
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed max-w-3xl mt-3">
              {getPreview(equipmentText, 150)}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {equipmentList.map((eq) => (
              <div
                key={eq.name}
                className="border border-black/8 rounded overflow-hidden bg-white hover:shadow-md transition-shadow"
              >
                <div
                  className="h-2"
                  style={{ backgroundColor: eq.img === "MRI" || eq.img === "PET" ? "#8b1a1a" : "#0d2b52" }}
                />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded"
                      style={{ backgroundColor: "#f0efed", color: "#8b1a1a" }}
                    >
                      {eq.img}
                    </span>
                    <span className="text-xs text-gray-400">{eq.qty}</span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-800 mb-1.5">{eq.name}</h3>
                  <p className="text-xs text-gray-500">{eq.brand}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Software platform */}
      <section style={{ backgroundColor: "#0d2b52" }} className="py-20">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-5 rounded-sm" style={{ backgroundColor: "#c8a96e" }} />
              <span className="text-xs text-white/60 tracking-widest uppercase">科研软件平台</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-medium text-white">
              互认共享与科研分析平台
            </h2>
            <p className="text-white/60 text-sm leading-relaxed max-w-3xl mt-3">
              {softwareIntro}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {platformCards.map((plat) => {
              const Icon = plat.icon;
              return (
                <div
                  key={plat.title}
                  className="rounded border p-6"
                  style={{ backgroundColor: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.12)" }}
                >
                  <div
                    className="w-10 h-10 flex items-center justify-center rounded mb-4"
                    style={{ backgroundColor: "#8b1a1a" }}
                  >
                    <Icon size={18} className="text-white" />
                  </div>
                  <h3 className="text-white font-medium text-sm mb-4">{plat.title}</h3>
                  <ul className="space-y-2">
                    {plat.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-white/60 text-xs">
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: "#c8a96e" }}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          {configText ? (
            <div
              className="mt-6 rounded border p-5 text-white/65 text-sm leading-relaxed"
              style={{ backgroundColor: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.12)" }}
            >
              <span className="text-white font-medium mr-3">数据中心现有配置</span>
              {configText}
            </div>
          ) : null}
        </div>
      </section>

      {/* Disease matrix */}
      <section style={{ backgroundColor: "#f7f6f4" }} className="py-20 border-t border-black/8">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-1 h-5 rounded-sm" style={{ backgroundColor: "#8b1a1a" }} />
                <span className="text-xs text-gray-500 tracking-widest uppercase">专病库矩阵</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-medium" style={{ color: "#0d2b52" }}>
                现有专病数据库
              </h2>
            </div>
          </div>

          <div className="bg-white border border-black/8 rounded overflow-hidden">
            <div
              className="grid grid-cols-12 text-xs font-medium px-6 py-3 border-b border-black/8"
              style={{ backgroundColor: "#0d2b52", color: "white" }}
            >
              <span className="col-span-5">专病库名称</span>
              <span className="col-span-2 text-center">病例规模</span>
              <span className="col-span-3">影像模态</span>
              <span className="col-span-2 text-center">状态</span>
            </div>
            {diseaseMatrix.map((db, idx) => (
              <div
                key={db.name}
                className={`grid grid-cols-12 px-6 py-3.5 text-sm border-b border-black/5 last:border-0 hover:bg-gray-50 items-center ${
                  db.featured ? "bg-[#fdf8f8]" : ""
                }`}
              >
                <div className="col-span-5 flex items-center gap-2">
                  {db.featured && (
                    <span
                      className="text-xs px-1.5 py-0.5 rounded shrink-0"
                      style={{ backgroundColor: "#8b1a1a", color: "white" }}
                    >
                      重点
                    </span>
                  )}
                  <Link
                    to="/disease-detail"
                    className="font-medium hover:text-[#8b1a1a] transition-colors"
                    style={{ color: db.featured ? "#8b1a1a" : "#1c1c1c" }}
                  >
                    {db.name}
                  </Link>
                </div>
                <div
                  className="col-span-2 text-center font-medium"
                  style={{ color: "#0d2b52" }}
                >
                  <MetricValue value={db.cases} suffixClassName="text-xs font-normal text-gray-500 ml-0.5" />
                </div>
                <div className="col-span-3 text-xs text-gray-500">{db.modalities}</div>
                <div className="col-span-2 text-center">
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: db.status === "已开放" ? "#e8f4ea" : db.status === "建设中" ? "#e8edf7" : "#f0efed",
                      color: db.status === "已开放" ? "#2d7a3a" : db.status === "建设中" ? "#0d2b52" : "#6b6b7b",
                    }}
                  >
                    {db.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
