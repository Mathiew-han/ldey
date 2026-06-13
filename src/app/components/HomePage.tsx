import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  Database,
  Building2,
  HardDrive,
  FlaskConical,
  ChevronRight,
  Microscope,
  Activity,
  FileImage,
  CalendarDays,
  ExternalLink,
} from "lucide-react";
import { achievementImages, centerIntro, diseases, getPreview, partners, siteStats } from "../data/siteContent";

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function smoothRange(progress: number, start: number, end: number) {
  const t = clamp((progress - start) / (end - start));
  return t * t * (3 - 2 * t);
}

function parseStatValue(value: string) {
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  return {
    target: match ? Number(match[1]) : 0,
    suffix: match?.[2] ?? value,
    numeric: Boolean(match),
  };
}

function AnimatedStatValue({ value, active }: { value: string; active: boolean }) {
  const [{ target, suffix, numeric }] = useState(() => parseStatValue(value));
  const [display, setDisplay] = useState(0);
  const hasPlayed = useRef(false);

  useEffect(() => {
    if (!active || hasPlayed.current) return;
    hasPlayed.current = true;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!numeric || prefersReducedMotion) {
      setDisplay(target);
      return;
    }

    let frame = 0;
    const start = performance.now();
    const duration = 1500;

    const tick = (now: number) => {
      const progress = clamp((now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, numeric, target]);

  if (!numeric) return <>{value}</>;

  return (
    <>
      {Math.round(display)}
      {suffix}
    </>
  );
}

function useHeroProgress() {
  const ref = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const node = ref.current;
      if (!node) return;

      const start = Math.max(0, node.offsetTop - 80);
      const travel = Math.max(1, window.innerHeight * 0.95);
      setProgress(clamp((window.scrollY - start) / travel));
    };

    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  return { ref, progress };
}

const statIcons = [Database, FlaskConical, Building2, HardDrive];
const stats = siteStats.map((item, index) => ({ ...item, icon: statIcons[index] ?? Database }));

const diseaseDBs = diseases.slice(0, 4).map((db) => ({
  title: db.name,
  cases: db.cases,
  types: db.types,
  tag: db.featured ? "重点专病库" : db.status,
  path: db.featured ? "/disease-detail" : "/database",
  featured: Boolean(db.featured),
}));

const news = achievementImages
  .flatMap((group) =>
    group.items.map((item) => ({
      category: group.title,
      title: item.caption || item.heading,
      image: item.src,
      summary: getPreview(item.nearestText, 68),
    })),
  )
  .map((item, exchangeIndex) => ({ ...item, exchangeIndex }))
  .map((item, index) => ({
    ...item,
    date: ["2025-11-30", "2025-03-01", "2024-12-01", "2024-11-14"][index % 4],
  }));

export function HomePage() {
  const [newsStart, setNewsStart] = useState(0);
  const { ref: heroRef, progress: heroProgress } = useHeroProgress();
  const titleReveal = smoothRange(heroProgress, 0.18, 0.48);
  const statsReveal = smoothRange(heroProgress, 0.55, 0.9);
  const statsActive = statsReveal > 0.2;
  const visibleNews = Array.from({ length: Math.min(4, news.length) }, (_, index) => news[(newsStart + index) % news.length]);

  return (
    <div>
      {/* Hero section */}
      <section ref={heroRef} className="relative min-h-[205vh] bg-[#0d2b52]">
        <div className="sticky top-0 h-screen overflow-hidden bg-[#0d2b52]">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            poster="/images/center/center.png"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/images/center/center.mp4" type="video/mp4" />
          </video>
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(90deg, rgba(13,43,82,${0.08 + titleReveal * 0.86}) 0%, rgba(13,43,82,${titleReveal * 0.78}) 45%, rgba(13,43,82,${titleReveal * 0.34}) 78%, rgba(13,43,82,${titleReveal * 0.18}) 100%)`,
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: titleReveal * 0.42,
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
              backgroundSize: "42px 42px",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none bg-cover bg-center"
            style={{
              opacity: titleReveal * 0.32,
              backgroundImage: "url('/images/page-bg/home.png')",
            }}
          />
          <div
            className="absolute right-0 top-0 w-[700px] h-[700px] pointer-events-none"
            style={{
              opacity: statsReveal * 0.75,
              background: `
                radial-gradient(circle, transparent 60px, rgba(255,255,255,0.03) 61px, transparent 80px),
                radial-gradient(circle, transparent 100px, rgba(255,255,255,0.03) 101px, transparent 120px),
                radial-gradient(circle, transparent 150px, rgba(255,255,255,0.02) 151px, transparent 170px),
                radial-gradient(circle, transparent 210px, rgba(255,255,255,0.02) 211px, transparent 230px),
                radial-gradient(circle, transparent 280px, rgba(255,255,255,0.015) 281px, transparent 300px)
              `,
              transform: "translate(30%, -20%)",
            }}
          />

          <div className="relative h-full max-w-[1440px] mx-auto px-6 flex items-center">
            <div className="max-w-4xl pt-10">
              <div
                className="mb-10"
                style={{
                  opacity: titleReveal,
                  transform: `translateY(${(1 - titleReveal) * 34}px)`,
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px w-8" style={{ backgroundColor: "#c8a96e" }} />
                  <span
                    className="text-sm tracking-widest uppercase font-medium"
                    style={{ color: "#c8a96e" }}
                  >
                    甘肃省医学影像科学数据中心
                  </span>
                </div>

                <h1
                  className="text-4xl md:text-5xl lg:text-6xl font-medium leading-tight text-white mb-6"
                  style={{ letterSpacing: "0.04em" }}
                >
                  医学影像专病数据库
                </h1>

                <p className="text-base md:text-lg text-white/72 leading-relaxed max-w-2xl">
                  {getPreview(centerIntro, 128)}
                </p>
              </div>

              <div
                className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 border-t border-white/15 pt-8 md:pt-10"
                style={{
                  opacity: statsReveal,
                  transform: `translateY(${(1 - statsReveal) * 30}px)`,
                }}
              >
                {stats.map((s, index) => {
                  const Icon = s.icon;
                  return (
                    <div
                      key={s.label}
                      className="pr-4 md:pr-8 first:pl-0"
                      style={{ transitionDelay: `${index * 90}ms` }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Icon size={15} style={{ color: "#c8a96e" }} />
                      </div>
                      <div
                        className="text-3xl md:text-4xl lg:text-5xl font-medium text-white mb-1"
                        style={{ fontVariantNumeric: "tabular-nums" }}
                      >
                        <AnimatedStatValue value={s.value} active={statsActive} />
                      </div>
                      <div className="text-white/58 text-xs tracking-wide">{s.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div
            className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, transparent, rgba(13,43,82,0.34))" }}
          />
        </div>
      </section>

      {/* Section divider bar */}
      <div style={{ backgroundColor: "#8b1a1a" }} className="h-1" />

      {/* Featured disease databases */}
      <section className="bg-white py-20">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-1 h-5 rounded-sm" style={{ backgroundColor: "#8b1a1a" }} />
                <span className="text-xs text-gray-500 tracking-widest uppercase">专病数据库</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-medium" style={{ color: "#0d2b52" }}>
                医学影像专病库矩阵
              </h2>
            </div>
            <Link
              to="/database"
              className="hidden md:flex items-center gap-2 text-sm transition-colors hover:opacity-80"
              style={{ color: "#8b1a1a" }}
            >
              查看全部专病库
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {diseaseDBs.map((db) => (
              <Link
                key={db.title}
                to={db.path}
                className={`block border transition-all hover:shadow-md group rounded ${
                  db.featured ? "border-[#8b1a1a]/30" : "border-black/10"
                }`}
                style={{ backgroundColor: db.featured ? "#fdf8f8" : "#fafafa" }}
              >
                {/* Card top accent */}
                <div
                  className="h-1 rounded-t"
                  style={{ backgroundColor: db.featured ? "#8b1a1a" : "#0d2b52" }}
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="text-xs px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: db.featured ? "#8b1a1a" : "#0d2b52",
                        color: "white",
                      }}
                    >
                      {db.tag}
                    </span>
                    <FileImage size={18} className="text-gray-300 group-hover:text-[#8b1a1a] transition-colors" />
                  </div>

                  <h3 className="text-base font-medium text-gray-800 leading-snug mb-3 group-hover:text-[#8b1a1a] transition-colors">
                    {db.title}
                  </h3>

                  <div
                    className="text-2xl font-medium mb-4"
                    style={{ color: db.featured ? "#8b1a1a" : "#0d2b52" }}
                  >
                    {db.cases}
                    <span className="text-sm font-normal text-gray-500 ml-1">病例</span>
                  </div>

                  <div className="space-y-1.5">
                    {db.types.map((t) => (
                      <div
                        key={t}
                        className="text-xs text-gray-500 flex items-center gap-1.5"
                      >
                        <span
                          className="w-1 h-1 rounded-full shrink-0"
                          style={{ backgroundColor: db.featured ? "#8b1a1a" : "#0d2b52" }}
                        />
                        {t}
                      </div>
                    ))}
                  </div>

                  <div
                    className="mt-5 pt-4 border-t border-black/6 flex items-center gap-1 text-xs font-medium"
                    style={{ color: db.featured ? "#8b1a1a" : "#0d2b52" }}
                  >
                    查看详情
                    <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Platform intro strip */}
      <section style={{ backgroundColor: "#0d2b52" }} className="py-16">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-5 rounded-sm" style={{ backgroundColor: "#c8a96e" }} />
                <span className="text-xs text-white/60 tracking-widest uppercase">数据中心</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-medium text-white mb-5">
                西北地区医学影像<br />科学数据基础设施
              </h2>
              <p className="text-white/65 text-sm leading-relaxed mb-8">
                {getPreview(centerIntro, 160)}
              </p>
              <div className="grid grid-cols-2 gap-5">
                {[
                  { label: "PACS 系统", desc: "全院级影像归档与传输" },
                  { label: "互认平台", desc: "省市县乡四级调阅共享" },
                  { label: "10+ 专病", desc: "常见疾病影像数据库" },
                  { label: "700T+ 存储", desc: "数据持续增长与治理" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="p-4 rounded border"
                    style={{ backgroundColor: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" }}
                  >
                    <div
                      className="text-sm font-medium mb-1"
                      style={{ color: "#c8a96e" }}
                    >
                      {item.label}
                    </div>
                    <div className="text-white/55 text-xs">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="/images/center/2.png"
                alt="甘肃省医学影像科学数据中心"
                className="w-full rounded object-cover"
                style={{ height: "360px" }}
              />
              <div
                className="absolute inset-0 rounded"
                style={{ background: "linear-gradient(to right, #0d2b52 0%, transparent 30%)" }}
              />
              <div
                className="absolute bottom-6 left-6 right-6 p-4 rounded border border-white/10"
                style={{ backgroundColor: "rgba(13,43,82,0.85)" }}
              >
                <div className="text-white/80 text-xs mb-1">系统建设单位</div>
                <div className="text-white text-sm font-medium">兰州大学第二医院 · 医学影像科</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key capabilities */}
      <section className="bg-white py-20">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-10" style={{ backgroundColor: "#8b1a1a" }} />
              <span className="text-xs text-gray-500 tracking-widest uppercase">核心能力</span>
              <div className="h-px w-10" style={{ backgroundColor: "#8b1a1a" }} />
            </div>
            <h2 className="text-2xl md:text-3xl font-medium" style={{ color: "#0d2b52" }}>
              四大核心服务能力
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: FileImage,
                title: "标准化采集",
                desc: "遵循DICOM国际标准，实现多模态影像数据采集、传输与归档，支持CT、MRI、超声、PET等影像类型。",
                color: "#8b1a1a",
              },
              {
                icon: Database,
                title: "脱敏治理",
                desc: "严格执行医疗数据脱敏规范，对患者身份信息进行匿名化处理，符合国家健康医疗大数据安全标准。",
                color: "#0d2b52",
              },
              {
                icon: Microscope,
                title: "智能标注",
                desc: "提供专业医学影像标注平台，支持影像分割、病灶标注、结构标记，为AI模型训练提供高质量数据集。",
                color: "#8b1a1a",
              },
              {
                icon: Activity,
                title: "共享服务",
                desc: "面向科研机构提供数据查询与下载服务，支持在线分析与可视化，推动多中心联合研究。",
                color: "#0d2b52",
              },
            ].map((cap) => {
              const Icon = cap.icon;
              return (
                <div
                  key={cap.title}
                  className="p-6 border border-black/8 rounded hover:shadow-md transition-shadow"
                  style={{ backgroundColor: "#fafafa" }}
                >
                  <div
                    className="w-10 h-10 flex items-center justify-center rounded mb-5"
                    style={{ backgroundColor: `${cap.color}15` }}
                  >
                    <Icon size={20} style={{ color: cap.color }} />
                  </div>
                  <h3 className="text-base font-medium text-gray-800 mb-3">{cap.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{cap.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* News section */}
      <section className="relative bg-[#f7f6f4] border-t border-black/8 pb-24">
        <div
          className="relative min-h-[430px] bg-cover bg-center"
          style={{ backgroundImage: "url('/images/brand/platform-dynamics-bg.png')" }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(13,43,82,0.18) 0%, rgba(13,43,82,0.58) 62%, rgba(13,43,82,0.86) 100%)",
            }}
          />
          <div className="relative max-w-[1440px] mx-auto px-6 pt-20 md:pt-24 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-10 bg-[#c8a96e]" />
              <span className="text-xs text-white/70 tracking-widest uppercase">科研动态</span>
              <div className="h-px w-10 bg-[#c8a96e]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-medium text-white mb-4">科研与平台动态</h2>
            <p className="text-white/72 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
              汇聚医学影像 AI、区域质控、学术交流与平台建设进展，持续呈现数据中心科研协同成果。
            </p>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-6 -mt-28 relative z-10">
          <div className="flex items-center justify-between mb-5">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setNewsStart((current) => (current - 1 + news.length) % news.length)}
                className="w-10 h-10 rounded-full bg-white/95 border border-black/8 shadow-sm flex items-center justify-center text-[#0d2b52] hover:text-[#8b1a1a] transition-colors"
                aria-label="上一条动态"
              >
                <ArrowLeft size={17} />
              </button>
              <button
                type="button"
                onClick={() => setNewsStart((current) => (current + 1) % news.length)}
                className="w-10 h-10 rounded-full bg-white/95 border border-black/8 shadow-sm flex items-center justify-center text-[#0d2b52] hover:text-[#8b1a1a] transition-colors"
                aria-label="下一条动态"
              >
                <ArrowRight size={17} />
              </button>
            </div>
            <Link
              to="/research#academic-exchange"
              className="flex items-center gap-2 text-sm bg-white/95 border border-black/8 px-4 py-2 rounded-full shadow-sm hover:text-[#8b1a1a] transition-colors"
              style={{ color: "#0d2b52" }}
            >
              全部动态
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {visibleNews.map((item) => (
              <Link
                key={item.title}
                to={`/research#exchange-${item.exchangeIndex}`}
                className="group bg-white rounded overflow-hidden shadow-[0_18px_45px_rgba(13,43,82,0.16)] border border-black/8 hover:-translate-y-1 transition-all"
              >
                <div className="relative h-44 overflow-hidden bg-[#0d2b52]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                  <div
                    className="absolute left-4 top-4 rounded px-2.5 py-1 text-xs text-white"
                    style={{ backgroundColor: "rgba(139,26,26,0.92)" }}
                  >
                    {item.category}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <CalendarDays size={13} className="text-[#8b1a1a]" />
                    <span>{item.date}</span>
                  </div>
                  <h4 className="text-base font-medium text-gray-900 leading-snug mb-3 line-clamp-2 group-hover:text-[#8b1a1a] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4">{item.summary}</p>
                  <div className="flex items-center gap-1 text-xs font-medium" style={{ color: "#8b1a1a" }}>
                    查看详情
                    <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Partners strip */}
      <section className="bg-white border-t border-black/8 py-12">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-8" style={{ backgroundColor: "#8b1a1a" }} />
            <span className="text-xs text-gray-400 tracking-widest uppercase">合作单位</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {partners.map((partner) => (
              <a
                key={partner.name}
                href={partner.url}
                target="_blank"
                rel="noreferrer"
                className="group border border-black/8 rounded bg-[#fafafa] px-3 py-4 text-center hover:border-[#8b1a1a]/35 hover:bg-white hover:shadow-sm transition-all"
              >
                <div className="h-12 mb-3 flex items-center justify-center">
                  <img
                    src={partner.logo}
                    alt={`${partner.name} logo`}
                    className="max-h-12 max-w-full object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="text-xs text-gray-700 leading-snug group-hover:text-[#8b1a1a] transition-colors">
                  {partner.shortName}
                </div>
                <div className="mt-2 flex items-center justify-center gap-1 text-[11px] text-gray-400">
                  官网链接
                  <ExternalLink size={10} />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
