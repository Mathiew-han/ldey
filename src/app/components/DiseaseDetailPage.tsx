import { FileImage, Activity, Microscope, TrendingUp, Database, Users, Building2, ChevronRight, Download, Search } from "lucide-react";
import { liverCirrhosisDetail } from "../data/siteContent";

const dataSources = [
  "兰州大学第二医院",
  "兰州大学第一医院",
  "甘肃省人民医院",
  "甘肃省肿瘤医院",
  "兰州市各大综合医院",
  "甘肃省卫生健康委员会信息中心",
];

const imagingTypes = [
  { name: "腹部增强CT", count: "多模态影像资料", icon: "CT" },
  { name: "腹部MRI", count: "多模态影像资料", icon: "MRI" },
  { name: "弹性超声", count: "多模态影像资料", icon: "US" },
  { name: "消化内镜", count: "多模态影像资料", icon: "GI" },
];

const clinicalFields = [
  "肝功能指标",
  "肝纤维化分期",
  "病因分型",
  "并发症记录",
  "干预治疗",
  "随访预后",
];

const quadrants = [
  {
    layer: "影像层",
    icon: FileImage,
    color: "#8b1a1a",
    items: [
      "腹部增强CT",
      "腹部MRI",
      "弹性超声",
      "消化内镜",
      "多模态影像分层体系",
    ],
  },
  {
    layer: "临床层",
    icon: Activity,
    color: "#0d2b52",
    items: [
      "肝功能指标",
      "病因分型",
      "并发症记录",
      "干预治疗",
      "结构化临床字段绑定",
    ],
  },
  {
    layer: "病理层",
    icon: Microscope,
    color: "#8b1a1a",
    items: [
      "病理特征",
      "肝纤维化分期",
      "临床-病理关联字段",
      "影像征象结构化绑定",
      "科研分析字段体系",
    ],
  },
  {
    layer: "预后层",
    icon: TrendingUp,
    color: "#0d2b52",
    items: [
      "随访预后数据",
      "并发症预判支撑",
      "分级诊疗研究支撑",
      "发病机制研究支撑",
      "线上查询与下载服务",
    ],
  },
];

export function DiseaseDetailPage() {
  return (
    <div>
      {/* Page header */}
      <div style={{ backgroundColor: "#0d2b52" }} className="relative overflow-hidden py-16 md:py-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 29px, rgba(255,255,255,0.05) 30px),
              repeating-linear-gradient(90deg, transparent, transparent 29px, rgba(255,255,255,0.05) 30px)
            `,
          }}
        />
        <div className="max-w-[1440px] mx-auto px-6 relative">
          <nav className="flex items-center gap-2 text-xs text-white/50 mb-6">
            <a href="/" className="hover:text-white/80">首页</a>
            <span>/</span>
            <a href="/database" className="hover:text-white/80">专病库</a>
            <span>/</span>
            <span className="text-white/80">肝硬化医学影像专病库</span>
          </nav>
          <div className="flex items-center gap-3 mb-4">
            <span
              className="text-xs px-2 py-0.5 rounded font-medium"
              style={{ backgroundColor: "#8b1a1a", color: "white" }}
            >
              重点专病库
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded"
              style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}
            >
              已开放查询与下载
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-medium text-white mb-3">
            肝硬化医学影像专病库
          </h1>
          <p className="text-white/60 text-sm max-w-2xl leading-relaxed">
            整合多模态医学影像数据、临床检验信息、病理及预后特征的结构化科研数据库
          </p>
        </div>
      </div>
      <div className="h-1" style={{ backgroundColor: "#8b1a1a" }} />

      {/* Main intro — two-column */}
      <section className="bg-white py-20">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Left: description */}
            <div className="lg:col-span-3">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-1 h-5 rounded-sm" style={{ backgroundColor: "#8b1a1a" }} />
                <span className="text-xs text-gray-500 tracking-widest uppercase">数据库介绍</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-medium mb-6" style={{ color: "#0d2b52" }}>
                肝硬化医学影像专病库
              </h2>
              <div className="space-y-4 text-sm text-gray-600 leading-relaxed mb-8">
                <p>{liverCirrhosisDetail.desc}</p>
              </div>

              {/* Imaging types */}
              <h3 className="text-sm font-medium mb-4" style={{ color: "#0d2b52" }}>
                影像数据类型
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {imagingTypes.map((im) => (
                  <div
                    key={im.name}
                    className="flex items-center gap-3 border border-black/8 rounded p-4"
                    style={{ backgroundColor: "#fafafa" }}
                  >
                    <div
                      className="w-10 h-10 flex items-center justify-center rounded text-xs font-medium shrink-0"
                      style={{ backgroundColor: "#0d2b52", color: "#c8a96e" }}
                    >
                      {im.icon}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">{im.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{im.count}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Clinical fields */}
              <h3 className="text-sm font-medium mb-4" style={{ color: "#0d2b52" }}>
                临床–病理字段
              </h3>
              <div className="space-y-2">
                {clinicalFields.map((f) => (
                  <div key={f} className="flex items-start gap-2 text-sm text-gray-600">
                    <span
                      className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: "#8b1a1a" }}
                    />
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: data archive panel */}
            <div className="lg:col-span-2">
              <div
                className="rounded border overflow-hidden sticky top-24"
                style={{ borderColor: "rgba(0,0,0,0.1)" }}
              >
                {/* Panel header */}
                <div
                  className="px-6 py-4"
                  style={{ backgroundColor: "#0d2b52" }}
                >
                  <div className="text-white/60 text-xs mb-1 tracking-widest uppercase">数据档案面板</div>
                  <div className="text-white font-medium text-sm">肝硬化医学影像专病库</div>
                </div>

                {/* Archive content */}
                <div style={{ backgroundColor: "#111d2d" }} className="p-6 space-y-4">
                  {/* Key metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "病例总数", value: "3000+" },
                      { label: "影像资料", value: "4类" },
                      { label: "关联字段", value: "6类" },
                      { label: "共享方式", value: "线上" },
                    ].map((m) => (
                      <div
                        key={m.label}
                        className="p-3 rounded"
                        style={{ backgroundColor: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.08)" }}
                      >
                        <div
                          className="text-xl font-medium leading-none mb-1"
                          style={{ color: "#c8a96e" }}
                        >
                          {m.value}
                        </div>
                        <div className="text-white/50 text-xs">{m.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-white/10" />

                  {/* Data sources */}
                  <div>
                    <div className="text-white/60 text-xs mb-3 uppercase tracking-widest">数据来源机构</div>
                    <div className="space-y-2">
                      {dataSources.map((src) => (
                        <div key={src} className="flex items-center gap-2">
                          <Building2 size={12} style={{ color: "#c8a96e" }} className="shrink-0" />
                          <span className="text-white/70 text-xs">{src}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-white/10" />

                  {/* Tags */}
                  <div>
                    <div className="text-white/60 text-xs mb-3 uppercase tracking-widest">数据标签</div>
                    <div className="flex flex-wrap gap-2">
                      {["DICOM", "脱敏匿名化", "多中心", "临床检验", "病理特征", "随访预后"].map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded border"
                          style={{ borderColor: "rgba(200,169,110,0.3)", color: "rgba(200,169,110,0.8)" }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-white/10" />

                  {/* Access buttons */}
                  <div className="space-y-2.5">
                    <button
                      className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded transition-opacity hover:opacity-90"
                      style={{ backgroundColor: "#8b1a1a", color: "white" }}
                    >
                      <Search size={14} />
                      申请查询数据
                    </button>
                    <a
                      href="/contact"
                      className="w-full flex items-center justify-center gap-2 py-2.5 text-sm rounded border transition-colors hover:bg-white/5"
                      style={{ borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)" }}
                    >
                      <Download size={14} />
                      数据申请说明
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Four-layer quadrant */}
      <section style={{ backgroundColor: "#f7f6f4" }} className="py-20 border-t border-black/8">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-5 rounded-sm" style={{ backgroundColor: "#8b1a1a" }} />
              <span className="text-xs text-gray-500 tracking-widest uppercase">数据层架构</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-medium" style={{ color: "#0d2b52" }}>
              四层数据架构
            </h2>
            <p className="text-gray-500 text-sm mt-3 max-w-xl leading-relaxed">
              肝硬化专病库构建影像层、临床层、病理层、预后层四层数据体系，支持多维度科研分析。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quadrants.map((q) => {
              const Icon = q.icon;
              return (
                <div
                  key={q.layer}
                  className="bg-white border border-black/8 rounded overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div
                    className="px-6 py-4 flex items-center gap-3"
                    style={{ backgroundColor: q.color }}
                  >
                    <Icon size={18} className="text-white/80" />
                    <span className="text-white font-medium text-sm">{q.layer}</span>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-2.5">
                      {q.items.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
                          <span
                            className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: q.color }}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Service capabilities */}
      <section className="bg-white py-20 border-t border-black/8">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-5 rounded-sm" style={{ backgroundColor: "#8b1a1a" }} />
              <span className="text-xs text-gray-500 tracking-widest uppercase">服务能力</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-medium" style={{ color: "#0d2b52" }}>
              数据访问与服务
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Search,
                title: "线上数据查询",
                desc: "通过数据服务门户实现按病种、影像模态、临床特征的多维度检索，支持队列筛选与统计汇总。",
                cta: "进入查询系统",
              },
              {
                icon: Download,
                title: "数据申请与下载",
                desc: "申请人提交数据使用申请，经伦理委员会审查与数据安全审核后，授权访问和批量下载指定数据集。",
                cta: "提交申请",
              },
              {
                icon: Users,
                title: "科研合作申请",
                desc: "支持多中心联合科研合作，研究团队可申请联合建库、共同分析及论文数据授权，签署合作协议后开展。",
                cta: "申请合作",
              },
            ].map((svc) => {
              const Icon = svc.icon;
              return (
                <div
                  key={svc.title}
                  className="border border-black/8 rounded p-6"
                  style={{ backgroundColor: "#fafafa" }}
                >
                  <div
                    className="w-10 h-10 flex items-center justify-center rounded mb-4"
                    style={{ backgroundColor: "#8b1a1a" }}
                  >
                    <Icon size={18} className="text-white" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-800 mb-3">{svc.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-5">{svc.desc}</p>
                  <a
                    href="/contact"
                    className="flex items-center gap-1.5 text-xs font-medium"
                    style={{ color: "#8b1a1a" }}
                  >
                    {svc.cta}
                    <ChevronRight size={13} />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
