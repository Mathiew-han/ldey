import { Building2, Server, Database, Users, Shield, Network, CheckCircle, Monitor, FileImage } from "lucide-react";
import { centerInfra, centerIntro, centerPlatform, centerTeam, getPreview } from "../data/siteContent";
import { PageHero } from "./PageHero";

function SectionHeader({ tag, title, subtitle }: { tag: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-1 h-5 rounded-sm" style={{ backgroundColor: "#8b1a1a" }} />
        <span className="text-xs text-gray-500 tracking-widest uppercase">{tag}</span>
      </div>
      <h2 className="text-2xl md:text-3xl font-medium mb-3" style={{ color: "#0d2b52" }}>
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">{subtitle}</p>
      )}
    </div>
  );
}

export function DataCenterPage() {
  return (
    <div>
      <PageHero
        title="数据中心介绍"
        description="甘肃省医学影像科学数据中心依托兰州大学第二医院建立，是面向西北地区四级医疗机构的省级医学影像数据基础设施平台。"
        breadcrumbs={[{ label: "首页", to: "/" }, { label: "数据中心" }]}
        background="/images/page-bg/data-center.png"
      />
      <div className="h-1" style={{ backgroundColor: "#8b1a1a" }} />

      {/* About section */}
      <section className="bg-white py-20">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <SectionHeader
                tag="中心简介"
                title="甘肃省医学影像科学数据中心"
              />
              <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                <p>{centerIntro}</p>
                <p>{centerInfra}</p>
              </div>
            </div>
            <div>
              <img
                src="/images/center/2.png"
                alt="数据中心设备"
                className="w-full rounded object-cover mb-6"
                style={{ height: "300px" }}
              />
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "3500张", label: "开放床位" },
                  { value: "700T+", label: "存储规模" },
                  { value: "136台", label: "现有服务器" },
                  { value: "8000+", label: "医学影像病例" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="p-4 rounded border text-center"
                    style={{ backgroundColor: "#f7f6f4", borderColor: "rgba(0,0,0,0.08)" }}
                  >
                    <div className="text-2xl font-medium mb-1" style={{ color: "#8b1a1a" }}>
                      {s.value}
                    </div>
                    <div className="text-xs text-gray-500">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 依托单位 */}
      <section style={{ backgroundColor: "#f7f6f4" }} className="py-20 border-t border-black/8">
        <div className="max-w-[1440px] mx-auto px-6">
          <SectionHeader
            tag="依托单位"
            title="兰州大学第二医院"
            subtitle={getPreview(centerInfra, 150)}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <img
                src="/images/center/1.png"
                alt="兰州大学第二医院"
                className="w-full rounded object-cover mb-6"
                style={{ height: "260px" }}
              />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "连续七年顶级医院百强", icon: Building2 },
                  { label: "中国医院竞争力智慧医院HIC300强", icon: Monitor },
                  { label: "开放床位3500张", icon: Database },
                  { label: "模块化数据中心机房", icon: Server },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="p-4 rounded border border-black/8 bg-white flex flex-col items-center text-center"
                    >
                      <div
                        className="w-9 h-9 flex items-center justify-center rounded mb-3"
                        style={{ backgroundColor: "#0d2b52" }}
                      >
                        <Icon size={16} className="text-white" />
                      </div>
                      <span className="text-xs text-gray-600 leading-snug">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-base font-medium" style={{ color: "#0d2b52" }}>
                影像科简介
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {centerInfra}
              </p>
              <div className="space-y-2">
                {[
                  "放射诊断学",
                  "核磁共振成像",
                  "CT影像诊断",
                  "介入放射学",
                  "医学影像人工智能",
                  "多模态影像融合",
                ].map((s) => (
                  <div key={s} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle size={13} style={{ color: "#8b1a1a" }} className="shrink-0" />
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Infrastructure */}
      <section className="bg-white py-20">
        <div className="max-w-[1440px] mx-auto px-6">
          <SectionHeader
            tag="基础设施"
            title="服务器与存储资源"
            subtitle="数据中心配备高性能计算集群、大容量存储阵列及数据安全备份系统，为海量影像数据的存储、计算与传输提供可靠基础设施保障。"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "计算服务器集群",
                icon: Server,
                specs: ["现有服务器136台", "服务器总装机容量可达200台左右", "模块化数据中心机房", "为影像数据治理和科研计算提供支撑"],
              },
              {
                title: "存储阵列系统",
                icon: Database,
                specs: ["数据存储量已经达到700多T", "数据以每天1T持续增长", "影像资料与临床数据持续集成", "支撑标准化数据集建设"],
              },
              {
                title: "网络与安全",
                icon: Shield,
                specs: ["全省统一医学影像数据存储共享平台", "对接医院PACS系统", "对接DICOM标准影像设备", "支持实时调阅与共享"],
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="border border-black/8 rounded overflow-hidden"
                >
                  <div
                    className="px-6 py-4 flex items-center gap-3"
                    style={{ backgroundColor: "#0d2b52" }}
                  >
                    <Icon size={18} className="text-white/80" />
                    <span className="text-white font-medium text-sm">{item.title}</span>
                  </div>
                  <div className="p-6 space-y-2.5">
                    {item.specs.map((spec) => (
                      <div
                        key={spec}
                        className="text-sm text-gray-600 flex items-start gap-2"
                      >
                        <span
                          className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: "#8b1a1a" }}
                        />
                        {spec}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Systems */}
      <section style={{ backgroundColor: "#0d2b52" }} className="py-20">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-5 rounded-sm" style={{ backgroundColor: "#c8a96e" }} />
              <span className="text-xs text-white/60 tracking-widest uppercase">系统平台</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-medium text-white">
              PACS / CDR / 主索引 / 数据应用平台
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                abbr: "PACS",
                name: "影像归档与传输系统",
                desc: "符合DICOM 3.0标准，支持CT、MRI、超声、DSA等多模态影像数据的采集、归档、传输与查阅。",
              },
              {
                abbr: "CDR",
                name: "临床数据仓库",
                desc: "整合HIS/LIS/EMR多源临床数据，为影像专病库提供配套的结构化临床信息。",
              },
              {
                abbr: "主索引",
                name: "患者主索引平台",
                desc: "跨机构患者身份统一管理，实现多院区、多系统的患者数据关联与追踪。",
              },
              {
                abbr: "数据应用",
                name: "科研数据应用库",
                desc: "面向科研人员的数据查询、筛选、下载与分析平台，支持在线可视化与批量导出。",
              },
            ].map((sys) => (
              <div
                key={sys.abbr}
                className="p-6 rounded border"
                style={{ backgroundColor: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" }}
              >
                <div
                  className="text-2xl font-medium mb-2"
                  style={{ color: "#c8a96e" }}
                >
                  {sys.abbr}
                </div>
                <div className="text-white/90 text-sm font-medium mb-3">{sys.name}</div>
                <p className="text-white/55 text-xs leading-relaxed">{sys.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage */}
      <section className="bg-white py-20">
        <div className="max-w-[1440px] mx-auto px-6">
          <SectionHeader
            tag="覆盖范围"
            title="四级医疗机构覆盖体系"
            subtitle={getPreview(centerPlatform, 160)}
          />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border border-black/8 rounded overflow-hidden">
            {[
              { level: "依托单位", count: "兰大二院", bg: "#8b1a1a", text: "white", hospitals: ["开放床位3500张", "现有服务器136台", "数据存储700多T", "数据以每天1T持续增长"] },
              { level: "共建医院", count: "省内主要三甲", bg: "#0d2b52", text: "white", hospitals: ["兰州大学第一医院", "甘肃省人民医院", "甘肃省肿瘤医院", "甘肃省940医院"] },
              { level: "平台支撑", count: "省卫健委", bg: "#f7f6f4", text: "#1c1c1c", hospitals: ["甘肃省卫生健康委员会信息中心", "全省统一互认平台", "对接医院PACS系统", "对接DICOM标准影像设备"] },
              { level: "服务覆盖", count: "四级医疗机构", bg: "#f0efed", text: "#1c1c1c", hospitals: ["省-市-县-乡", "县级以上医学影像中心", "地市级放射质控中心", "多中心联合研究"] },
            ].map((tier, idx) => (
              <div
                key={tier.level}
                className={`p-6 ${idx < 3 ? "border-r border-black/8" : ""}`}
                style={{ backgroundColor: tier.bg, color: tier.text as string }}
              >
                <div
                  className="text-3xl font-medium mb-1"
                  style={{ color: idx < 2 ? "#c8a96e" : "#8b1a1a" }}
                >
                  {tier.count}
                </div>
                <div
                  className="text-sm font-medium mb-4 pb-3 border-b"
                  style={{ borderColor: idx < 2 ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)" }}
                >
                  {tier.level}
                </div>
                <ul className="space-y-2">
                  {tier.hospitals.map((h) => (
                    <li key={h} className="text-xs leading-snug opacity-75">{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Multidisciplinary team */}
      <section style={{ backgroundColor: "#f7f6f4" }} className="py-20 border-t border-black/8">
        <div className="max-w-[1440px] mx-auto px-6">
          <SectionHeader
            tag="人才队伍"
            title="多学科专业人才团队"
            subtitle={getPreview(centerTeam, 180)}
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {[
              { field: "学科带头人", count: "20", unit: "位", color: "#8b1a1a", icon: FileImage },
              { field: "主要工作人员", count: "26", unit: "人", color: "#0d2b52", icon: Users },
              { field: "博士学历", count: "11", unit: "人", color: "#8b1a1a", icon: Network },
              { field: "高级职称", count: "24", unit: "人", color: "#0d2b52", icon: Monitor },
              { field: "信息中心支撑", count: "32", unit: "人", color: "#8b1a1a", icon: Database },
              { field: "在读博硕士", count: "50+", unit: "人", color: "#0d2b52", icon: Server },
            ].map((item) => {
              const Icon = item.icon || Users;
              return (
                <div
                  key={item.field}
                  className="bg-white border border-black/8 rounded p-5 text-center"
                >
                  <div
                    className="w-10 h-10 flex items-center justify-center rounded mx-auto mb-3"
                    style={{ backgroundColor: `${item.color}15` }}
                  >
                    <Icon size={18} style={{ color: item.color }} />
                  </div>
                  <div
                    className="text-2xl font-medium mb-0.5"
                    style={{ color: item.color }}
                  >
                    {item.count}
                    <span className="text-xs font-normal text-gray-400 ml-0.5">{item.unit}</span>
                  </div>
                  <div className="text-xs text-gray-500">{item.field}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
