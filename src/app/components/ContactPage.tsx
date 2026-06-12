import { MapPin, Phone, Mail, Clock, ChevronDown, ChevronUp, FileText, Users } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    q: "如何申请使用肝硬化专病库数据？",
    a: "请通过页面联系方式联系数据中心，说明研究目的、数据使用范围和合作单位信息。数据中心将根据数据共享与科研合作要求进行后续沟通。",
  },
  {
    q: "数据申请有哪些资质要求？",
    a: "建议由医疗机构、高等院校或科研机构提出申请，并说明研究背景、数据需求、使用范围和安全管理方式。",
  },
  {
    q: "数据是否可以离线下载保存？",
    a: "肝硬化医学影像专病库支持数据线上查询与下载，具体下载范围和使用方式以数据中心审核后的授权为准。",
  },
  {
    q: "如何申请多中心联合科研合作？",
    a: "可由牵头单位提交合作意向，说明研究方向、参与单位、数据需求和成果计划，数据中心将组织后续对接。",
  },
  {
    q: "数据中心的数据安全保障措施是什么？",
    a: "所有影像数据严格遵循DICOM标准完成脱敏与匿名化处理，并通过标准化数据采集、脱敏存储与智能分析能力支撑科研使用。",
  },
  {
    q: "专病库数据是否支持在线可视化分析？",
    a: "当前网站展示专病库建设与数据服务信息；具体在线查询、下载和分析服务需通过数据中心授权后使用。",
  },
];

export function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
            <span className="text-white/80">联系我们</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-medium text-white mb-3">联系我们</h1>
          <p className="text-white/60 text-sm max-w-2xl leading-relaxed">
            如需申请数据访问、寻求科研合作或了解更多信息，请通过以下方式与我们联系。
          </p>
        </div>
      </div>
      <div className="h-1" style={{ backgroundColor: "#8b1a1a" }} />

      {/* Main contact section */}
      <section className="bg-white py-20">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact info */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-5 rounded-sm" style={{ backgroundColor: "#8b1a1a" }} />
                <span className="text-xs text-gray-500 tracking-widest uppercase">联系方式</span>
              </div>

              <div className="space-y-6">
                <div>
                  <div
                    className="text-xs font-medium mb-2 uppercase tracking-widest"
                    style={{ color: "#8b1a1a" }}
                  >
                    办公地址
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin size={15} className="text-gray-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600 leading-relaxed">
                      甘肃省兰州市城关区天水南路222号<br />
                      兰州大学第二医院<br />
                      甘肃省医学影像科学数据中心
                    </p>
                  </div>
                </div>

                <div className="border-t border-black/6 pt-6">
                  <div
                    className="text-xs font-medium mb-3 uppercase tracking-widest"
                    style={{ color: "#8b1a1a" }}
                  >
                    联系电话
                  </div>
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3">
                      <Phone size={14} className="text-gray-400 shrink-0" />
                      <div>
                        <div className="text-sm text-gray-700">15809317062</div>
                        <div className="text-xs text-gray-400">综合咨询</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone size={14} className="text-gray-400 shrink-0" />
                      <div>
                        <div className="text-sm text-gray-700">15809317062</div>
                        <div className="text-xs text-gray-400">数据申请专线</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-black/6 pt-6">
                  <div
                    className="text-xs font-medium mb-3 uppercase tracking-widest"
                    style={{ color: "#8b1a1a" }}
                  >
                    电子邮箱
                  </div>
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3">
                      <Mail size={14} className="text-gray-400 shrink-0" />
                      <div>
                        <div className="text-sm text-gray-700">contact@gansu-medical-imaging.cn</div>
                        <div className="text-xs text-gray-400">数据申请与合作</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail size={14} className="text-gray-400 shrink-0" />
                      <div>
                        <div className="text-sm text-gray-700">contact@gansu-medical-imaging.cn</div>
                        <div className="text-xs text-gray-400">科研合作</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-black/6 pt-6">
                  <div
                    className="text-xs font-medium mb-3 uppercase tracking-widest"
                    style={{ color: "#8b1a1a" }}
                  >
                    办公时间
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock size={14} className="text-gray-400 shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>周一至周五 08:30 – 17:30</div>
                      <div className="text-xs text-gray-400">法定节假日除外</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Application guide */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-5 rounded-sm" style={{ backgroundColor: "#8b1a1a" }} />
                <span className="text-xs text-gray-500 tracking-widest uppercase">申请指南</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {/* Data application */}
                <div
                  className="border border-black/8 rounded overflow-hidden"
                >
                  <div
                    className="px-6 py-4 flex items-center gap-3"
                    style={{ backgroundColor: "#8b1a1a" }}
                  >
                    <FileText size={16} className="text-white/80" />
                    <span className="text-white font-medium text-sm">数据申请说明</span>
                  </div>
                  <div className="p-6 space-y-3">
                    {[
                      { step: "01", text: "填写《数据使用申请表》，明确研究目的与数据需求范围" },
                      { step: "02", text: "提交所在单位伦理委员会批件" },
                      { step: "03", text: "数据中心技术与伦理审核（约15个工作日）" },
                      { step: "04", text: "审核通过后签署《数据使用协议》" },
                      { step: "05", text: "获得授权访问账号，开始使用数据" },
                    ].map((s) => (
                      <div key={s.step} className="flex items-start gap-3 text-sm text-gray-600">
                        <span
                          className="shrink-0 w-5 h-5 flex items-center justify-center rounded text-white text-xs font-medium mt-0.5"
                          style={{ backgroundColor: "#8b1a1a" }}
                        >
                          {s.step}
                        </span>
                        {s.text}
                      </div>
                    ))}
                    <div className="pt-3 border-t border-black/6">
                      <a
                        href="#"
                        className="text-sm font-medium flex items-center gap-2"
                        style={{ color: "#8b1a1a" }}
                      >
                        <FileText size={13} />
                        下载申请表模板
                      </a>
                    </div>
                  </div>
                </div>

                {/* Collaboration application */}
                <div className="border border-black/8 rounded overflow-hidden">
                  <div
                    className="px-6 py-4 flex items-center gap-3"
                    style={{ backgroundColor: "#0d2b52" }}
                  >
                    <Users size={16} className="text-white/80" />
                    <span className="text-white font-medium text-sm">科研合作申请</span>
                  </div>
                  <div className="p-6 space-y-3">
                    {[
                      { step: "01", text: "提交合作意向函，说明研究方向与预期目标" },
                      { step: "02", text: "双方召开对接会议，确定合作范围与数据需求" },
                      { step: "03", text: "签署《多中心联合研究合作协议》" },
                      { step: "04", text: "完成伦理审查与数据权限配置" },
                      { step: "05", text: "正式开展联合研究，中心提供数据与技术支持" },
                    ].map((s) => (
                      <div key={s.step} className="flex items-start gap-3 text-sm text-gray-600">
                        <span
                          className="shrink-0 w-5 h-5 flex items-center justify-center rounded text-white text-xs font-medium mt-0.5"
                          style={{ backgroundColor: "#0d2b52" }}
                        >
                          {s.step}
                        </span>
                        {s.text}
                      </div>
                    ))}
                    <div className="pt-3 border-t border-black/6">
                      <a
                        href="#"
                        className="text-sm font-medium flex items-center gap-2"
                        style={{ color: "#0d2b52" }}
                      >
                        <FileText size={13} />
                        下载合作申请书模板
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact form */}
              <div className="border border-black/8 rounded p-6" style={{ backgroundColor: "#fafafa" }}>
                <div className="text-sm font-medium mb-5" style={{ color: "#0d2b52" }}>
                  在线留言
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5">姓名 *</label>
                    <input
                      type="text"
                      placeholder="请输入您的姓名"
                      className="w-full px-3 py-2.5 text-sm border border-black/10 rounded bg-white outline-none focus:border-[#8b1a1a] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5">所在单位 *</label>
                    <input
                      type="text"
                      placeholder="医疗机构或高校名称"
                      className="w-full px-3 py-2.5 text-sm border border-black/10 rounded bg-white outline-none focus:border-[#8b1a1a] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5">电子邮箱 *</label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="w-full px-3 py-2.5 text-sm border border-black/10 rounded bg-white outline-none focus:border-[#8b1a1a] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5">联系类型 *</label>
                    <select className="w-full px-3 py-2.5 text-sm border border-black/10 rounded bg-white outline-none focus:border-[#8b1a1a] transition-colors text-gray-600">
                      <option>数据申请咨询</option>
                      <option>科研合作申请</option>
                      <option>技术问题反馈</option>
                      <option>其他咨询</option>
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-xs text-gray-500 mb-1.5">留言内容 *</label>
                  <textarea
                    rows={4}
                    placeholder="请描述您的需求或问题..."
                    className="w-full px-3 py-2.5 text-sm border border-black/10 rounded bg-white outline-none focus:border-[#8b1a1a] transition-colors resize-none"
                  />
                </div>
                <button
                  className="px-6 py-2.5 text-sm font-medium text-white rounded transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#8b1a1a" }}
                >
                  提交留言
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section style={{ backgroundColor: "#f7f6f4" }} className="py-12 border-t border-black/8">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-5 rounded-sm" style={{ backgroundColor: "#8b1a1a" }} />
            <span className="text-xs text-gray-500 tracking-widest uppercase">地图位置</span>
          </div>
          <div
            className="w-full rounded border border-black/8 overflow-hidden flex items-center justify-center"
            style={{ height: "320px", backgroundColor: "#e8edf7" }}
          >
            <div className="text-center">
              <div
                className="w-12 h-12 flex items-center justify-center rounded-full mx-auto mb-4"
                style={{ backgroundColor: "#0d2b52" }}
              >
                <MapPin size={22} className="text-white" />
              </div>
              <div className="text-sm font-medium text-gray-700 mb-1">
                兰州大学第二医院 — 甘肃省医学影像科学数据中心
              </div>
              <div className="text-xs text-gray-500">
                甘肃省兰州市城关区天水南路222号（地图加载中…）
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20 border-t border-black/8">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-5 rounded-sm" style={{ backgroundColor: "#8b1a1a" }} />
              <span className="text-xs text-gray-500 tracking-widest uppercase">常见问题</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-medium" style={{ color: "#0d2b52" }}>
              常见问题解答
            </h2>
          </div>

          <div className="max-w-3xl space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-black/8 rounded overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                >
                  <span className="text-sm font-medium text-gray-800 pr-4">{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp size={16} style={{ color: "#8b1a1a" }} className="shrink-0" />
                  ) : (
                    <ChevronDown size={16} className="text-gray-400 shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div
                    className="px-6 pb-5 pt-0 border-t border-black/6"
                    style={{ backgroundColor: "#fdf8f8" }}
                  >
                    <p className="text-sm text-gray-600 leading-relaxed pt-4">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
