import { useState } from "react";
import { BookOpen, ChevronRight, GraduationCap, X } from "lucide-react";
import { experts, getPreview, staff } from "../data/siteContent";
import { AnimatedNumber } from "./AnimatedNumber";
import { PageHero } from "./PageHero";

type TeamPerson = (typeof experts)[number];

function PersonDetailModal({
  person,
  onClose,
}: {
  person: TeamPerson | null;
  onClose: () => void;
}) {
  if (!person) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-black/55 px-4 py-6 md:py-10 overflow-y-auto">
      <div className="max-w-5xl mx-auto bg-white rounded shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 md:px-7 py-4 border-b border-black/8">
          <div>
            <div className="text-xs text-gray-500 tracking-widest uppercase">成员简介</div>
            <div className="text-lg font-medium mt-1" style={{ color: "#0d2b52" }}>
              {person.name}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full border border-black/10 flex items-center justify-center text-gray-500 hover:text-[#8b1a1a] hover:border-[#8b1a1a]/30 transition-colors"
            aria-label="关闭简介"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-0">
          <div className="bg-[#f7f6f4] p-6 md:p-8">
            <div className="rounded overflow-hidden bg-white border border-black/8">
              <img
                src={person.img}
                alt={person.name}
                className="w-full max-h-[560px] object-contain object-top"
                onError={(event) => {
                  event.currentTarget.src = "/images/center/center.png";
                }}
              />
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="mb-5">
              <div className="text-2xl font-medium mb-2" style={{ color: "#0d2b52" }}>
                {person.name}
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">{person.headline}</div>
              <div className="text-xs text-gray-500 mt-3 flex items-center gap-1.5">
                <GraduationCap size={13} />
                {person.hospital}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {(person.directions.length ? person.directions : ["医学影像", "数据治理"]).map((direction) => (
                <span
                  key={direction}
                  className="text-xs px-2.5 py-1 rounded border"
                  style={{ borderColor: "rgba(139,26,26,0.18)", color: "#8b1a1a", backgroundColor: "#fdf8f8" }}
                >
                  {direction}
                </span>
              ))}
            </div>

            <div className="border-t border-black/8 pt-5">
              <h3 className="text-sm font-medium mb-3" style={{ color: "#0d2b52" }}>
                完整简介
              </h3>
              <p className="text-sm text-gray-600 leading-8 whitespace-pre-line">
                {person.desc || person.headline}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ExpertTeamPage() {
  const [selectedPerson, setSelectedPerson] = useState<TeamPerson | null>(null);
  const visibleExperts = experts.slice(0, 23);
  const visibleStaff = staff.slice(0, 12);

  return (
    <div>
      <PageHero
        title="专家团队"
        description="汇聚医学影像、信息化、临床与科研领域专家，支撑数据中心共建、质量控制、数据治理与成果转化。"
        breadcrumbs={[{ label: "首页", to: "/" }, { label: "专家团队" }]}
        background="/images/page-bg/experts.png"
      />
      <div className="h-1" style={{ backgroundColor: "#8b1a1a" }} />

      <section className="bg-white border-b border-black/8 py-10">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: String(visibleExperts.length), unit: "位", label: "专家组成员" },
              { value: String(staff.length), unit: "人", label: "主要工作人员" },
              { value: "12", unit: "家", label: "省内外共建单位" },
              { value: "32", unit: "名", label: "信息中心支撑人员" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-medium mb-1" style={{ color: "#8b1a1a" }}>
                  <AnimatedNumber value={s.value} />
                  <span className="text-base font-normal text-gray-400 ml-0.5">{s.unit}</span>
                </div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: "#f7f6f4" }} className="py-20">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-5 rounded-sm" style={{ backgroundColor: "#8b1a1a" }} />
              <span className="text-xs text-gray-500 tracking-widest uppercase">专家组成员</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-medium" style={{ color: "#0d2b52" }}>
              多中心专家组
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleExperts.map((expert) => (
              <div
                key={`${expert.id}-${expert.name}`}
                className="bg-white border border-black/8 rounded overflow-hidden hover:shadow-md transition-shadow group"
              >
                <div className="relative h-48 overflow-hidden" style={{ backgroundColor: expert.id % 2 ? "#8b1a1a" : "#0d2b52" }}>
                  <img
                    src={expert.img}
                    alt={expert.name}
                    className="w-full h-full object-cover object-top opacity-75 group-hover:opacity-85 transition-opacity"
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.src = "/images/center/center.png";
                    }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(to bottom, transparent 35%, ${expert.id % 2 ? "#8b1a1a" : "#0d2b52"} 100%)` }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="text-white text-base font-medium">{expert.name}</div>
                    <div className="text-white/75 text-xs mt-0.5">{expert.title}</div>
                  </div>
                </div>

                <div className="p-5">
                  <div className="text-xs text-gray-500 mb-3 flex items-center gap-1.5">
                    <GraduationCap size={12} className="shrink-0" />
                    {expert.hospital}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(expert.directions.length ? expert.directions : ["医学影像", "数据中心"]).map((direction) => (
                      <span
                        key={direction}
                        className="text-xs px-2 py-0.5 rounded border"
                        style={{ borderColor: "rgba(0,0,0,0.1)", color: "#6b6b7b" }}
                      >
                        {direction}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-4 mb-4">
                    {getPreview(expert.desc || expert.headline, 128)}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedPerson(expert)}
                    className="flex items-center gap-1 text-xs font-medium"
                    style={{ color: "#8b1a1a" }}
                  >
                    <BookOpen size={12} />
                    查看简介
                    <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 border-t border-black/8">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-5 rounded-sm" style={{ backgroundColor: "#8b1a1a" }} />
              <span className="text-xs text-gray-500 tracking-widest uppercase">主要工作人员</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-medium" style={{ color: "#0d2b52" }}>
              数据治理与运行团队
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleStaff.map((person) => (
              <button
                type="button"
                onClick={() => setSelectedPerson(person)}
                key={`${person.id}-${person.name}`}
                className="border border-black/8 rounded p-5 flex gap-4 bg-[#fafafa] text-left hover:bg-white hover:border-[#8b1a1a]/25 hover:shadow-sm transition-all"
              >
                <img
                  src={person.img}
                  alt={person.name}
                  className="w-16 h-[85px] rounded object-cover object-top shrink-0"
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.src = "/images/center/center.png";
                  }}
                />
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-800">{person.name}</div>
                  <div className="text-xs text-gray-500 mt-1 line-clamp-2">{person.headline}</div>
                  <p className="text-xs text-gray-400 mt-2 line-clamp-2">{getPreview(person.desc, 72)}</p>
                  <div className="mt-3 flex items-center gap-1 text-xs font-medium" style={{ color: "#8b1a1a" }}>
                    展开查看
                    <ChevronRight size={12} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <PersonDetailModal person={selectedPerson} onClose={() => setSelectedPerson(null)} />
    </div>
  );
}
