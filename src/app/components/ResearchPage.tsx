import { useEffect, useMemo, useState } from "react";
import { Award, Beaker, BookOpen, CalendarDays, Trophy, Users, X } from "lucide-react";
import { achievementImages, achievementSections, centerTeam, getPreview } from "../data/siteContent";
import { AnimatedNumber } from "./AnimatedNumber";
import { PageHero } from "./PageHero";

function countNumbered(lines: string[]) {
  return lines.filter((line) => /^\d+[.、]/.test(line.trim())).length;
}

function sectionByTitle(title: string) {
  return achievementSections.find((section) => section.title === title);
}

export function ResearchPage() {
  const projects = sectionByTitle("获批项目");
  const publications = sectionByTitle("发表文章");
  const awards = sectionByTitle("获奖");
  const students = sectionByTitle("学生培养及获奖");
  const imageItems = useMemo(
    () => achievementImages.flatMap((group) => group.items.map((item) => ({ ...item, groupTitle: group.title }))),
    [],
  );
  const [selectedExchange, setSelectedExchange] = useState<(typeof imageItems)[number] | null>(null);

  useEffect(() => {
    const match = window.location.hash.match(/exchange-(\d+)/);
    if (!match) {
      if (window.location.hash.includes("academic-exchange")) {
        window.requestAnimationFrame(() => {
          document.getElementById("academic-exchange")?.scrollIntoView({ block: "start" });
        });
      }
      return;
    }
    const index = Number(match[1]);
    if (!Number.isFinite(index) || !imageItems[index]) return;
    setSelectedExchange(imageItems[index]);
    window.requestAnimationFrame(() => {
      document.getElementById("academic-exchange")?.scrollIntoView({ block: "start" });
    });
  }, [imageItems]);

  const stats = [
    { icon: Beaker, value: projects ? String(countNumbered(projects.lines)) : "32", label: "获批项目", sub: "含国家、省市级科研项目" },
    { icon: BookOpen, value: publications ? String(countNumbered(publications.lines)) : "400+", label: "发表文章", sub: "中心团队科研产出" },
    { icon: Trophy, value: awards ? String(countNumbered(awards.lines)) : "3", label: "获奖成果", sub: "省科技进步一等奖等" },
    { icon: Users, value: students ? "15" : "15", label: "优秀毕业研究生", sub: "获2023年度优秀导师团队" },
  ];

  return (
    <div>
      <PageHero
        title="科研成果"
        description={getPreview(centerTeam, 150)}
        breadcrumbs={[{ label: "首页", to: "/" }, { label: "科研成果" }]}
        background="/images/page-bg/research.png"
      />
      <div className="h-1" style={{ backgroundColor: "#8b1a1a" }} />

      <section className="bg-white border-b border-black/8 py-12">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="text-center">
                  <div className="w-10 h-10 flex items-center justify-center rounded mx-auto mb-3" style={{ backgroundColor: "#f0efed" }}>
                    <Icon size={18} style={{ color: "#8b1a1a" }} />
                  </div>
                  <div className="text-3xl font-medium mb-1" style={{ color: "#8b1a1a" }}>
                    <AnimatedNumber value={item.value} />
                  </div>
                  <div className="text-sm text-gray-700 mb-0.5">{item.label}</div>
                  <div className="text-xs text-gray-400">{item.sub}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: "#f7f6f4" }} className="py-20">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-5 rounded-sm" style={{ backgroundColor: "#8b1a1a" }} />
              <span className="text-xs text-gray-500 tracking-widest uppercase">成果概览</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-medium" style={{ color: "#0d2b52" }}>
              项目、论文与人才培养
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              { title: "获批项目", icon: Beaker, lines: projects?.lines ?? [] },
              { title: "发表文章", icon: BookOpen, lines: publications?.lines ?? [] },
              { title: "学生培养及获奖", icon: Award, lines: students?.lines ?? [] },
            ].map((section) => {
              const Icon = section.icon;
              return (
                <div key={section.title} className="bg-white border border-black/8 rounded overflow-hidden">
                  <div className="px-6 py-4 flex items-center gap-3" style={{ backgroundColor: "#0d2b52" }}>
                    <Icon size={18} className="text-white/80" />
                    <span className="text-white font-medium text-sm">{section.title}</span>
                  </div>
                  <div className="p-6 space-y-3">
                    {section.lines.slice(0, section.title === "学生培养及获奖" ? 8 : 6).map((line, index) => (
                      <div key={`${section.title}-${index}`} className="flex gap-3 text-sm text-gray-600">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "#8b1a1a" }} />
                        <span className="leading-relaxed">{getPreview(line, 92)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="academic-exchange" className="bg-white py-20 border-t border-black/8 scroll-mt-28">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-5 rounded-sm" style={{ backgroundColor: "#8b1a1a" }} />
              <span className="text-xs text-gray-500 tracking-widest uppercase">学术交流</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-medium" style={{ color: "#0d2b52" }}>
              国内外学术交流
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {imageItems.map((item, index) => (
              <button
                type="button"
                key={item.src}
                id={`exchange-card-${index}`}
                onClick={() => setSelectedExchange(item)}
                className="border border-black/8 rounded overflow-hidden bg-[#fafafa] hover:shadow-md hover:-translate-y-0.5 transition-all text-left"
              >
                <img src={item.src} alt={item.caption || item.heading} className="w-full h-48 object-cover" />
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <CalendarDays size={13} className="text-gray-400" />
                    <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: "#f0efed", color: "#8b1a1a" }}>
                      {item.groupTitle}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-800 leading-snug mb-2">{item.caption || item.heading}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{getPreview(item.nearestText || item.heading, 116)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {selectedExchange && (
        <div className="fixed inset-0 z-[80] bg-black/55 px-4 py-6 md:py-10 overflow-y-auto">
          <div className="max-w-5xl mx-auto bg-white rounded shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 md:px-7 py-4 border-b border-black/8">
              <div>
                <div className="text-xs text-gray-500 tracking-widest uppercase">学术交流详情</div>
                <div className="text-lg font-medium mt-1" style={{ color: "#0d2b52" }}>
                  {selectedExchange.caption || selectedExchange.heading}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedExchange(null)}
                className="w-9 h-9 rounded-full border border-black/10 flex items-center justify-center text-gray-500 hover:text-[#8b1a1a] hover:border-[#8b1a1a]/30 transition-colors"
                aria-label="关闭详情"
              >
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="bg-[#f7f6f4] p-5 md:p-7">
                <img
                  src={selectedExchange.src}
                  alt={selectedExchange.caption || selectedExchange.heading}
                  className="w-full max-h-[620px] object-contain rounded bg-white border border-black/8"
                />
              </div>
              <div className="p-6 md:p-8">
                <span
                  className="inline-block text-xs px-2.5 py-1 rounded mb-4"
                  style={{ backgroundColor: "#f0efed", color: "#8b1a1a" }}
                >
                  {selectedExchange.groupTitle}
                </span>
                <h3 className="text-xl font-medium leading-snug mb-4" style={{ color: "#0d2b52" }}>
                  {selectedExchange.heading}
                </h3>
                <p className="text-sm text-gray-600 leading-8 whitespace-pre-line">
                  {selectedExchange.nearestText || selectedExchange.caption || selectedExchange.heading}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import { useEffect, useMemo, useState } from "react";
import { Award, Beaker, BookOpen, CalendarDays, Trophy, Users, X } from "lucide-react";
import { achievementImages, achievementSections, centerTeam, getPreview } from "../data/siteContent";
import { AnimatedNumber } from "./AnimatedNumber";
import { PageHero } from "./PageHero";

function countNumbered(lines: string[]) {
  return lines.filter((line) => /^\d+[.、]/.test(line.trim())).length;
}

function sectionByTitle(title: string) {
  return achievementSections.find((section) => section.title === title);
}

export function ResearchPage() {
  const projects = sectionByTitle("获批项目");
  const publications = sectionByTitle("发表文章");
  const awards = sectionByTitle("获奖");
  const students = sectionByTitle("学生培养及获奖");
  const imageItems = useMemo(
    () => achievementImages.flatMap((group) => group.items.map((item) => ({ ...item, groupTitle: group.title }))),
    [],
  );
  const [selectedExchange, setSelectedExchange] = useState<(typeof imageItems)[number] | null>(null);

  useEffect(() => {
    const match = window.location.hash.match(/exchange-(\d+)/);
    if (!match) {
      if (window.location.hash.includes("academic-exchange")) {
        window.requestAnimationFrame(() => {
          document.getElementById("academic-exchange")?.scrollIntoView({ block: "start" });
        });
      }
      return;
    }
    const index = Number(match[1]);
    if (!Number.isFinite(index) || !imageItems[index]) return;
    setSelectedExchange(imageItems[index]);
    window.requestAnimationFrame(() => {
      document.getElementById("academic-exchange")?.scrollIntoView({ block: "start" });
    });
  }, [imageItems]);

  const stats = [
    { icon: Beaker, value: projects ? String(countNumbered(projects.lines)) : "32", label: "获批项目", sub: "含国家、省市级科研项目" },
    { icon: BookOpen, value: publications ? String(countNumbered(publications.lines)) : "400+", label: "发表文章", sub: "中心团队科研产出" },
    { icon: Trophy, value: awards ? String(countNumbered(awards.lines)) : "3", label: "获奖成果", sub: "省科技进步一等奖等" },
    { icon: Users, value: students ? "15" : "15", label: "优秀毕业研究生", sub: "获2023年度优秀导师团队" },
  ];

  return (
    <div>
      <PageHero
        title="科研成果"
        description={getPreview(centerTeam, 150)}
        breadcrumbs={[{ label: "首页", to: "/" }, { label: "科研成果" }]}
        background="/images/page-bg/research.png"
      />
      <div className="h-1" style={{ backgroundColor: "#8b1a1a" }} />

      <section className="bg-white border-b border-black/8 py-12">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="text-center">
                  <div className="w-10 h-10 flex items-center justify-center rounded mx-auto mb-3" style={{ backgroundColor: "#f0efed" }}>
                    <Icon size={18} style={{ color: "#8b1a1a" }} />
                  </div>
                  <div className="text-3xl font-medium mb-1" style={{ color: "#8b1a1a" }}>
                    <AnimatedNumber value={item.value} />
                  </div>
                  <div className="text-sm text-gray-700 mb-0.5">{item.label}</div>
                  <div className="text-xs text-gray-400">{item.sub}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: "#f7f6f4" }} className="py-20">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-5 rounded-sm" style={{ backgroundColor: "#8b1a1a" }} />
              <span className="text-xs text-gray-500 tracking-widest uppercase">成果概览</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-medium" style={{ color: "#0d2b52" }}>
              项目、论文与人才培养
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              { title: "获批项目", icon: Beaker, lines: projects?.lines ?? [] },
              { title: "发表文章", icon: BookOpen, lines: publications?.lines ?? [] },
              { title: "学生培养及获奖", icon: Award, lines: students?.lines ?? [] },
            ].map((section) => {
              const Icon = section.icon;
              return (
                <div key={section.title} className="bg-white border border-black/8 rounded overflow-hidden">
                  <div className="px-6 py-4 flex items-center gap-3" style={{ backgroundColor: "#0d2b52" }}>
                    <Icon size={18} className="text-white/80" />
                    <span className="text-white font-medium text-sm">{section.title}</span>
                  </div>
                  <div className="p-6 space-y-3">
                    {section.lines.slice(0, 6).map((line, index) => (
                      <div key={`${section.title}-${index}`} className="flex gap-3 text-sm text-gray-600">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "#8b1a1a" }} />
                        <span className="leading-relaxed">{getPreview(line, 92)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="academic-exchange" className="bg-white py-20 border-t border-black/8 scroll-mt-28">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-5 rounded-sm" style={{ backgroundColor: "#8b1a1a" }} />
              <span className="text-xs text-gray-500 tracking-widest uppercase">学术交流</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-medium" style={{ color: "#0d2b52" }}>
              国内外学术交流
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {imageItems.map((item, index) => (
              <button
                type="button"
                key={item.src}
                id={`exchange-card-${index}`}
                onClick={() => setSelectedExchange(item)}
                className="border border-black/8 rounded overflow-hidden bg-[#fafafa] hover:shadow-md hover:-translate-y-0.5 transition-all text-left"
              >
                <img src={item.src} alt={item.caption || item.heading} className="w-full h-48 object-cover" />
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <CalendarDays size={13} className="text-gray-400" />
                    <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: "#f0efed", color: "#8b1a1a" }}>
                      {item.groupTitle}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-800 leading-snug mb-2">{item.caption || item.heading}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{getPreview(item.nearestText || item.heading, 116)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {selectedExchange && (
        <div className="fixed inset-0 z-[80] bg-black/55 px-4 py-6 md:py-10 overflow-y-auto">
          <div className="max-w-5xl mx-auto bg-white rounded shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 md:px-7 py-4 border-b border-black/8">
              <div>
                <div className="text-xs text-gray-500 tracking-widest uppercase">学术交流详情</div>
                <div className="text-lg font-medium mt-1" style={{ color: "#0d2b52" }}>
                  {selectedExchange.caption || selectedExchange.heading}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedExchange(null)}
                className="w-9 h-9 rounded-full border border-black/10 flex items-center justify-center text-gray-500 hover:text-[#8b1a1a] hover:border-[#8b1a1a]/30 transition-colors"
                aria-label="关闭详情"
              >
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="bg-[#f7f6f4] p-5 md:p-7">
                <img
                  src={selectedExchange.src}
                  alt={selectedExchange.caption || selectedExchange.heading}
                  className="w-full max-h-[620px] object-contain rounded bg-white border border-black/8"
                />
              </div>
              <div className="p-6 md:p-8">
                <span
                  className="inline-block text-xs px-2.5 py-1 rounded mb-4"
                  style={{ backgroundColor: "#f0efed", color: "#8b1a1a" }}
                >
                  {selectedExchange.groupTitle}
                </span>
                <h3 className="text-xl font-medium leading-snug mb-4" style={{ color: "#0d2b52" }}>
                  {selectedExchange.heading}
                </h3>
                <p className="text-sm text-gray-600 leading-8 whitespace-pre-line">
                  {selectedExchange.nearestText || selectedExchange.caption || selectedExchange.heading}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
