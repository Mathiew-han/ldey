import { Award, Beaker, BookOpen, CalendarDays, Trophy, Users } from "lucide-react";
import { achievementImages, achievementSections, centerTeam, getPreview } from "../data/siteContent";

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
  const imageItems = achievementImages.flatMap((group) => group.items.map((item) => ({ ...item, groupTitle: group.title })));

  const stats = [
    { icon: Beaker, value: projects ? String(countNumbered(projects.lines)) : "32", label: "获批项目", sub: "含国家、省市级科研项目" },
    { icon: BookOpen, value: publications ? String(countNumbered(publications.lines)) : "400+", label: "发表文章", sub: "中心团队科研产出" },
    { icon: Trophy, value: awards ? String(countNumbered(awards.lines)) : "3", label: "获奖成果", sub: "省科技进步一等奖等" },
    { icon: Users, value: students ? "15" : "15", label: "优秀毕业研究生", sub: "获2023年度优秀导师团队" },
  ];

  return (
    <div>
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
            <span className="text-white/80">科研成果</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-medium text-white mb-3">科研成果</h1>
          <p className="text-white/60 text-sm max-w-2xl leading-relaxed">
            {getPreview(centerTeam, 150)}
          </p>
        </div>
      </div>
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
                    {item.value}
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

      <section className="bg-white py-20 border-t border-black/8">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-5 rounded-sm" style={{ backgroundColor: "#8b1a1a" }} />
              <span className="text-xs text-gray-500 tracking-widest uppercase">学术交流</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-medium" style={{ color: "#0d2b52" }}>
              国内外学术交流图片
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {imageItems.map((item) => (
              <article key={item.src} className="border border-black/8 rounded overflow-hidden bg-[#fafafa] hover:shadow-md transition-shadow">
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
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
