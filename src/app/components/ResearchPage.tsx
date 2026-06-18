import { useMemo, useState, type ElementType, type ReactNode } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import {
  Award,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronDown,
  ExternalLink,
  Filter,
  GraduationCap,
  Landmark,
  LibraryBig,
  Medal,
  ScrollText,
  Trophy,
  Users,
} from "lucide-react";
import {
  achievementImages,
  achievementSections,
  centerTeam,
  getPreview,
  researchAchievements,
  type ResearchProject,
  type ResearchPublication,
  type StudentCohort,
} from "../data/siteContent";

const allLabel = "全部";
const navy = "#0d2b52";
const red = "#8b1a1a";
const gold = "#c8a96e";

function countNumbered(lines: string[]) {
  return lines.filter((line) => /^\d+[.、]/.test(line.trim())).length;
}

function sectionByTitle(title: string) {
  return achievementSections.find((section) => section.title === title);
}

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function publicationHref(doi: string) {
  if (!doi) return "";
  if (/^https?:\/\//i.test(doi)) return doi;
  if (doi.includes("/")) return `https://doi.org/${doi.replace(/^doi[:：]?\s*/i, "")}`;
  return "";
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function sectionLink(id: string) {
  return `#${id}`;
}

function sectionColor(category: string) {
  if (category === "国家级") return gold;
  if (category === "省部级") return red;
  if (category === "地市级") return "#315f8c";
  return "#6b7280";
}

function groupByYear<T extends { year: string }>(items: T[]) {
  const grouped = new Map<string, T[]>();
  items.forEach((item) => {
    const year = item.year || "未标注";
    grouped.set(year, [...(grouped.get(year) ?? []), item]);
  });
  return Array.from(grouped.entries()).sort(([a], [b]) => toNumber(b) - toNumber(a));
}

function sortProjects(items: ResearchProject[]) {
  return [...items].sort((a, b) => toNumber(b.year) - toNumber(a.year) || toNumber(a.serial) - toNumber(b.serial));
}

function sortPublications(items: ResearchPublication[]) {
  return [...items].sort((a, b) => toNumber(b.year) - toNumber(a.year) || toNumber(a.serial) - toNumber(b.serial));
}

function getProjectYears(projects = researchAchievements.projects) {
  return Array.from(new Set(projects.map((item) => item.year).filter(Boolean))).sort((a, b) => toNumber(b) - toNumber(a));
}

function projectYearHref(year: string, category = allLabel) {
  const params = new URLSearchParams();
  if (category !== allLabel) params.set("category", category);
  return `/research/projects/${encodeURIComponent(year)}${params.toString() ? `?${params.toString()}` : ""}`;
}

function publicationsHref(year = allLabel, category = allLabel) {
  const params = new URLSearchParams();
  if (year !== allLabel) params.set("year", year);
  if (category !== allLabel) params.set("category", category);
  return `/research/publications${params.toString() ? `?${params.toString()}` : ""}`;
}

function SectionHeader({
  kicker,
  title,
  subtitle,
  align = "left",
}: {
  kicker: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("mb-8", align === "center" && "text-center")}>
      <div className={cn("flex items-center gap-3 mb-3", align === "center" && "justify-center")}>
        <div className="w-1 h-5 rounded-sm" style={{ backgroundColor: red }} />
        <span className="text-xs text-gray-500 tracking-widest uppercase">{kicker}</span>
      </div>
      <h2 className="text-2xl md:text-3xl font-medium mb-3" style={{ color: navy }}>
        {title}
      </h2>
      {subtitle && <p className="text-gray-500 text-sm leading-relaxed max-w-3xl">{subtitle}</p>}
    </div>
  );
}

function FilterButton({
  active,
  children,
  onClick,
  ariaLabel,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "h-9 px-3 rounded border text-xs font-medium transition-colors cursor-pointer",
        active ? "text-white border-transparent shadow-sm" : "bg-white text-gray-600 border-black/10 hover:border-[#8b1a1a]/35 hover:text-[#8b1a1a]",
      )}
      style={{ backgroundColor: active ? red : undefined }}
    >
      {children}
    </button>
  );
}

function MetricCell({
  value,
  label,
  sub,
  icon: Icon,
}: {
  value: string;
  label: string;
  sub: string;
  icon: ElementType;
}) {
  return (
    <div className="border-l border-black/8 first:border-l-0 px-5 py-4 min-h-[112px] flex flex-col justify-between">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-gray-500">{label}</span>
        <Icon size={16} style={{ color: red }} />
      </div>
      <div>
        <div className="text-3xl md:text-4xl font-medium leading-none" style={{ color: red }}>
          {value}
        </div>
        <div className="text-xs text-gray-400 mt-2">{sub}</div>
      </div>
    </div>
  );
}

function ResearchOverviewStrip({
  totalFunding,
  admittedTotal,
  graduatedTotal,
  masterTotal,
  doctoralTotal,
  awardCount,
}: {
  totalFunding: number;
  admittedTotal: number;
  graduatedTotal: number;
  masterTotal: number;
  doctoralTotal: number;
  awardCount: number;
}) {
  const metrics = [
    { value: String(researchAchievements.projects.length), label: "获批项目", sub: "覆盖四类项目级别", icon: Landmark },
    { value: `${Math.round(totalFunding)}`, label: "累计经费", sub: "万元项目经费", icon: Medal },
    { value: String(researchAchievements.publications.length), label: "发表文章", sub: "2021-2025年论文索引", icon: BookOpen },
    { value: `${admittedTotal}`, label: "入学培养", sub: `${masterTotal}名硕士 / ${doctoralTotal}名博士`, icon: Users },
    { value: `${graduatedTotal}`, label: "毕业学生", sub: "硕博士毕业名单", icon: GraduationCap },
    { value: String(awardCount), label: "获奖成果", sub: "省科技进步奖等", icon: Trophy },
  ];

  return (
    <section className="bg-white border-b border-black/8">
      <div className="max-w-[1440px] mx-auto px-6 py-10">
        <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr] border border-black/8 rounded overflow-hidden bg-[#fafafa]">
          <div className="p-6 flex flex-col justify-between" style={{ backgroundColor: navy }}>
            <div>
              <div className="flex items-center gap-2 text-white/60 text-xs tracking-widest uppercase mb-4">
                <LibraryBig size={15} style={{ color: gold }} />
                成果总览
              </div>
              <h2 className="text-white text-xl font-medium leading-snug">科研成果档案馆</h2>
            </div>
            <p className="text-white/58 text-xs leading-relaxed mt-5">
              从项目、论文到人才培养，按年度和类型归档展示中心科研积累。
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 bg-white">
            {metrics.map((metric) => (
              <MetricCell key={metric.label} {...metric} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ResearchArchiveNav() {
  const items = [
    { label: "获批项目", id: "projects-archive", icon: Landmark },
    { label: "发表文章", id: "publications-archive", icon: BookOpen },
    { label: "学生培养", id: "students-archive", icon: GraduationCap },
  ];

  return (
    <div className="sticky top-[93px] z-30 bg-white/92 backdrop-blur border-b border-black/8">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="flex items-center gap-2 overflow-x-auto py-3">
          <span className="hidden md:inline-flex items-center gap-2 text-xs text-gray-400 mr-2 shrink-0">
            <ScrollText size={14} />
            成果目录
          </span>
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.id}
                href={sectionLink(item.id)}
                className="inline-flex items-center gap-2 h-9 px-4 rounded border border-black/10 bg-white text-xs font-medium text-gray-700 hover:text-[#8b1a1a] hover:border-[#8b1a1a]/35 transition-colors whitespace-nowrap"
              >
                <Icon size={14} />
                {item.label}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FundingSummaryPanel({
  categories,
  projects,
  activeCategory,
  onCategoryChange,
}: {
  categories: string[];
  projects: ResearchProject[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}) {
  return (
    <aside className="bg-white border border-black/8 rounded p-5 h-fit lg:sticky lg:top-[160px]">
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <Filter size={16} style={{ color: red }} />
          <span className="text-sm font-medium" style={{ color: navy }}>项目资助结构</span>
        </div>
        <FilterButton active={activeCategory === allLabel} onClick={() => onCategoryChange(allLabel)}>
          全部
        </FilterButton>
      </div>
      <div className="space-y-3">
        {categories.map((category) => {
          const scoped = projects.filter((item) => item.category === category);
          const amount = scoped.reduce((sum, item) => sum + (item.amountWan ?? 0), 0);
          const active = activeCategory === category;

          return (
            <button
              key={category}
              type="button"
              aria-pressed={active}
              onClick={() => onCategoryChange(category)}
              className={cn(
                "w-full text-left rounded border p-4 transition-colors cursor-pointer",
                active ? "border-[#8b1a1a]/45 bg-[#f7f0f0]" : "border-black/8 bg-[#fafafa] hover:border-[#8b1a1a]/25",
              )}
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-sm font-medium text-gray-800">{category}</span>
                <span className="text-lg font-medium" style={{ color: sectionColor(category) }}>{scoped.length}项</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>经费合计</span>
                <span>{Math.round(amount)} 万元</span>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function ProjectTimelineRow({ project }: { project: ResearchProject }) {
  const color = sectionColor(project.category);

  return (
    <article className="relative bg-white border border-black/8 rounded p-4 md:p-5 hover:border-[#8b1a1a]/25 hover:shadow-sm transition-colors">
      <div className="absolute left-0 top-4 bottom-4 w-1 rounded-r" style={{ backgroundColor: color }} />
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_220px] gap-4 pl-3">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs px-2 py-0.5 rounded text-white" style={{ backgroundColor: color }}>
              {project.category}
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-[#f0efed] text-gray-600">{project.level || "项目级别未填"}</span>
          </div>
          <h3 className="text-sm md:text-base font-medium text-gray-900 leading-relaxed line-clamp-2">
            {project.name}
          </h3>
          <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-xs text-gray-500">
            <span>负责人 <strong className="font-medium text-gray-700">{project.owner || "未填写"}</strong></span>
            {project.code && <span>项目编号 <strong className="font-medium text-gray-700">{project.code}</strong></span>}
          </div>
        </div>
        <div className="xl:text-right flex xl:block items-center justify-between gap-4 border-t xl:border-t-0 xl:border-l border-black/6 pt-3 xl:pt-0 xl:pl-5">
          <div className="text-xs text-gray-400">项目经费</div>
          <div className="text-2xl font-medium mt-1" style={{ color: red }}>
            {project.amountText || "未填"}
            {project.amountText && <span className="text-xs font-normal text-gray-400 ml-1">万元</span>}
          </div>
        </div>
      </div>
    </article>
  );
}

function ProjectTimeline({ projects, activeCategory }: { projects: ResearchProject[]; activeCategory: string }) {
  const grouped = groupByYear(projects);

  return (
    <div className="relative">
      <div className="hidden md:block absolute left-8 right-8 top-10 h-px bg-black/10" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {grouped.map(([year, items]) => (
        <Link
          key={year}
          to={projectYearHref(year, activeCategory)}
          className="group relative bg-white border border-black/8 rounded p-5 hover:border-[#8b1a1a]/35 hover:shadow-sm transition-colors"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-medium shadow-sm mb-4" style={{ backgroundColor: navy }}>
                {year}
              </div>
              <div className="text-xs text-gray-400">点击查看该年度项目</div>
            </div>
            <ArrowRight size={17} className="text-gray-300 group-hover:text-[#8b1a1a] transition-colors" />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div>
              <div className="text-2xl font-medium leading-none" style={{ color: red }}>{items.length}</div>
              <div className="text-xs text-gray-500 mt-1">获批项目</div>
            </div>
            <div>
              <div className="text-2xl font-medium leading-none" style={{ color: red }}>
                {Math.round(items.reduce((sum, item) => sum + (item.amountWan ?? 0), 0))}
              </div>
              <div className="text-xs text-gray-500 mt-1">万元经费</div>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {researchAchievements.projectCategories
              .map((category) => ({
                category,
                count: items.filter((item) => item.category === category).length,
              }))
              .filter((item) => item.count > 0)
              .map((item) => (
                <span
                  key={item.category}
                  className="text-xs px-2 py-1 rounded bg-[#f7f0f0]"
                  style={{ color: sectionColor(item.category) }}
                >
                  {item.category} {item.count}
                </span>
              ))}
          </div>
        </Link>
      ))}
      </div>
    </div>
  );
}

function PublicationMatrix({
  years,
  categories,
  publications,
  selectedYear,
  selectedCategory,
  onYearChange,
  onCategoryChange,
}: {
  years: string[];
  categories: string[];
  publications: ResearchPublication[];
  selectedYear: string;
  selectedCategory: string;
  onYearChange: (year: string) => void;
  onCategoryChange: (category: string) => void;
}) {
  return (
    <div className="bg-[#f7f6f4] border border-black/8 rounded overflow-hidden">
      <div className="px-5 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white border-b border-black/8">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium" style={{ color: navy }}>
            <BookOpen size={16} style={{ color: red }} />
            论文年份矩阵
          </div>
          <div className="text-xs text-gray-500 mt-1">点击年份或类别筛选下方论文索引</div>
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterButton active={selectedYear === allLabel} onClick={() => onYearChange(allLabel)}>全部年份</FilterButton>
          {years.map((year) => (
            <FilterButton key={year} active={selectedYear === year} onClick={() => onYearChange(year)}>{year}</FilterButton>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[760px] grid" style={{ gridTemplateColumns: `132px repeat(${years.length}, minmax(112px, 1fr))` }}>
          <div className="px-4 py-3 text-xs text-gray-500 border-b border-r border-black/8 bg-white">类别 / 年份</div>
          {years.map((year) => {
            const total = publications.filter((item) => item.year === year).length;
            return (
              <button
                type="button"
                key={year}
                onClick={() => onYearChange(year)}
                className={cn(
                  "px-4 py-3 text-left border-b border-r border-black/8 transition-colors cursor-pointer",
                  selectedYear === year ? "bg-[#f7f0f0]" : "bg-white hover:bg-[#fafafa]",
                )}
              >
                <div className="text-sm font-medium" style={{ color: selectedYear === year ? red : navy }}>{year}</div>
                <div className="text-xs text-gray-400 mt-1">{total} 篇</div>
              </button>
            );
          })}
          {categories.map((category) => (
            <div key={category} className="contents">
              <button
                type="button"
                onClick={() => onCategoryChange(category)}
                className={cn(
                  "px-4 py-3 text-left border-r border-b border-black/8 transition-colors cursor-pointer",
                  selectedCategory === category ? "bg-[#f7f0f0]" : "bg-white hover:bg-[#fafafa]",
                )}
              >
                <span className="text-sm font-medium" style={{ color: selectedCategory === category ? red : navy }}>{category}</span>
              </button>
              {years.map((year) => {
                const count = publications.filter((item) => item.year === year && item.category === category).length;
                const active = selectedYear === year || selectedCategory === category;
                return (
                  <button
                    type="button"
                    key={`${category}-${year}`}
                    onClick={() => {
                      onYearChange(year);
                      onCategoryChange(category);
                    }}
                    className={cn(
                      "px-4 py-3 text-left border-r border-b border-black/8 transition-colors cursor-pointer",
                      active ? "bg-white" : "bg-[#fbfbfb]",
                      count ? "hover:bg-[#f7f0f0]" : "text-gray-300 cursor-default",
                    )}
                    disabled={!count}
                  >
                    <span className="text-lg font-medium" style={{ color: count ? red : "#c7c7c7" }}>{count}</span>
                    <span className="text-xs text-gray-400 ml-1">篇</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="px-5 py-4 flex flex-wrap gap-2 bg-white">
        <FilterButton active={selectedCategory === allLabel} onClick={() => onCategoryChange(allLabel)}>全部类别</FilterButton>
        {categories.map((category) => (
          <FilterButton key={category} active={selectedCategory === category} onClick={() => onCategoryChange(category)}>
            {category}
          </FilterButton>
        ))}
      </div>
    </div>
  );
}

function PublicationIndexRow({ item }: { item: ResearchPublication }) {
  const href = publicationHref(item.doi);

  return (
    <article className="grid grid-cols-1 xl:grid-cols-[92px_1fr_180px_118px_44px] gap-3 xl:gap-5 bg-white border border-black/8 rounded p-4 hover:border-[#8b1a1a]/25 hover:shadow-sm transition-colors">
      <div className="flex xl:block items-center gap-2">
        <span className="inline-flex h-7 px-2 items-center rounded text-xs text-white" style={{ backgroundColor: navy }}>{item.year}</span>
        <span className="inline-flex h-7 px-2 items-center rounded text-xs bg-[#f7f0f0]" style={{ color: red }}>{item.category}</span>
      </div>
      <div>
        <h3 className="text-sm md:text-base font-medium text-gray-900 leading-snug line-clamp-2">{item.title}</h3>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
          {item.firstAuthor && <span>一作 <strong className="font-medium text-gray-700">{item.firstAuthor}</strong></span>}
          {item.correspondingAuthor && <span>通讯 <strong className="font-medium text-gray-700">{item.correspondingAuthor}</strong></span>}
        </div>
      </div>
      <div className="text-xs text-gray-600 leading-relaxed">
        <div className="font-medium text-gray-800 line-clamp-1">{item.journal || "期刊未填"}</div>
        <div className="text-gray-400 line-clamp-1 mt-1">{item.citation}</div>
      </div>
      <div className="flex xl:block items-center gap-2 text-xs">
        {item.impactFactor && <span className="inline-flex h-7 px-2 items-center rounded bg-[#f0efed] text-gray-600">IF {item.impactFactor}</span>}
        {item.quartile && <span className="inline-flex h-7 px-2 items-center rounded bg-white border border-black/10 text-gray-500">{item.quartile}</span>}
      </div>
      <div className="xl:text-right">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={`打开 DOI 链接：${item.doi}`}
            title={item.doi}
            className="inline-flex w-9 h-9 items-center justify-center rounded border border-black/10 text-[#8b1a1a] hover:border-[#8b1a1a]/45 hover:bg-[#f7f0f0] transition-colors"
          >
            <ExternalLink size={15} />
          </a>
        ) : item.doi ? (
          <span className="inline-flex h-9 px-2 items-center rounded border border-black/10 text-xs text-gray-500" title={item.doi}>DOI</span>
        ) : null}
      </div>
    </article>
  );
}

function PublicationIndex({
  publications,
  selectedYear,
  selectedCategory,
  previewLimit,
  moreHref,
}: {
  publications: ResearchPublication[];
  selectedYear: string;
  selectedCategory: string;
  previewLimit?: number;
  moreHref?: string;
}) {
  const summary = `${selectedYear === allLabel ? "全部年份" : `${selectedYear}年`} / ${selectedCategory === allLabel ? "全部类别" : selectedCategory}`;
  const visiblePublications = previewLimit ? publications.slice(0, previewLimit) : publications;
  const hiddenCount = publications.length - visiblePublications.length;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div className="text-sm text-gray-600">
          当前显示：<span className="font-medium" style={{ color: red }}>{summary}</span>
          <span className="text-gray-400 mx-2">/</span>
          <span className="font-medium" style={{ color: navy }}>{publications.length}</span> 篇论文
        </div>
        <div className="text-xs text-gray-400">标题最多显示两行，DOI 使用外链入口减少长文本干扰</div>
      </div>
      <div className="space-y-3">
        {visiblePublications.map((item) => (
          <PublicationIndexRow key={`${item.year}-${item.category}-${item.serial}-${item.title}`} item={item} />
        ))}
      </div>
      {moreHref && hiddenCount > 0 && (
        <div className="mt-5 flex justify-end">
          <Link
            to={moreHref}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#8b1a1a] hover:text-[#6f1212] transition-colors"
          >
            查看更多
            <span className="text-xs text-gray-400">剩余 {hiddenCount} 篇</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      )}
    </div>
  );
}

function PersonChips({ names, limit = 8 }: { names: string[]; limit?: number }) {
  const display = names.slice(0, limit);
  const remaining = names.length - display.length;

  return (
    <div className="flex flex-wrap gap-1.5">
      {display.map((name) => (
        <span key={name} className="text-xs px-2 py-1 rounded border border-black/8 bg-[#fafafa] text-gray-600">
          {name}
        </span>
      ))}
      {remaining > 0 && (
        <span className="text-xs px-2 py-1 rounded border border-[#8b1a1a]/15 bg-[#f7f0f0]" style={{ color: red }}>
          +{remaining}
        </span>
      )}
    </div>
  );
}

function CohortPanel({ cohort }: { cohort: StudentCohort }) {
  return (
    <article className="bg-white border border-black/8 rounded overflow-hidden">
      <div className="px-5 py-4 flex items-center justify-between" style={{ backgroundColor: navy }}>
        <div className="flex items-center gap-2 text-white">
          <GraduationCap size={16} style={{ color: gold }} />
          <h3 className="text-sm font-medium">{cohort.cohort}</h3>
        </div>
        <div className="text-xs text-white/60">入学 {cohort.admittedTotal} / 毕业 {cohort.graduatedTotal}</div>
      </div>
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <div className="text-sm font-medium mb-3" style={{ color: red }}>入学培养</div>
          <div className="space-y-4">
            <div>
              <div className="text-xs text-gray-400 mb-2">硕士 · {cohort.admitted.masters.length}人</div>
              <PersonChips names={cohort.admitted.masters} />
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-2">博士 · {cohort.admitted.doctors.length}人</div>
              <PersonChips names={cohort.admitted.doctors} />
            </div>
          </div>
        </div>
        <div className="md:border-l md:border-black/8 md:pl-5">
          <div className="text-sm font-medium mb-3" style={{ color: red }}>毕业学生</div>
          <div className="space-y-4">
            <div>
              <div className="text-xs text-gray-400 mb-2">硕士 · {cohort.graduated.masters.length}人</div>
              <PersonChips names={cohort.graduated.masters} />
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-2">博士 · {cohort.graduated.doctors.length}人</div>
              <PersonChips names={cohort.graduated.doctors} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function MobileCohortAccordion({ cohort }: { cohort: StudentCohort }) {
  const [open, setOpen] = useState(false);

  return (
    <article className="bg-white border border-black/8 rounded overflow-hidden md:hidden">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <GraduationCap size={16} style={{ color: red }} />
          <span className="text-sm font-medium" style={{ color: navy }}>{cohort.cohort}</span>
        </span>
        <span className="flex items-center gap-3 text-xs text-gray-500">
          入学 {cohort.admittedTotal} / 毕业 {cohort.graduatedTotal}
          <ChevronDown size={15} className={cn("transition-transform", open && "rotate-180")} />
        </span>
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-black/8 space-y-4">
          <div className="pt-4">
            <div className="text-xs text-gray-400 mb-2">入学硕士</div>
            <PersonChips names={cohort.admitted.masters} limit={20} />
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-2">入学博士</div>
            <PersonChips names={cohort.admitted.doctors} limit={20} />
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-2">毕业硕士</div>
            <PersonChips names={cohort.graduated.masters} limit={20} />
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-2">毕业博士</div>
            <PersonChips names={cohort.graduated.doctors} limit={20} />
          </div>
        </div>
      )}
    </article>
  );
}

function StudentTimeline({
  students,
  awards,
  admittedTotal,
  graduatedTotal,
  masterTotal,
  doctoralTotal,
}: {
  students: StudentCohort[];
  awards?: { lines: string[] };
  admittedTotal: number;
  graduatedTotal: number;
  masterTotal: number;
  doctoralTotal: number;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
      <div>
        <div className="hidden md:block relative mb-8">
          <div className="absolute left-0 right-0 top-7 h-px bg-black/10" />
          <div className="grid grid-cols-5 gap-4">
            {students.map((cohort) => (
              <div key={cohort.cohort} className="relative text-center">
                <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center text-white text-sm font-medium shadow-sm" style={{ backgroundColor: navy }}>
                  {cohort.cohort.replace("级", "")}
                </div>
                <div className="text-xs text-gray-500 mt-2">入学 {cohort.admittedTotal}</div>
                <div className="text-xs text-gray-400">毕业 {cohort.graduatedTotal}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden md:grid grid-cols-1 xl:grid-cols-2 gap-5">
          {students.map((cohort) => (
            <CohortPanel key={cohort.cohort} cohort={cohort} />
          ))}
        </div>
        <div className="md:hidden space-y-3">
          {students.map((cohort) => (
            <MobileCohortAccordion key={cohort.cohort} cohort={cohort} />
          ))}
        </div>
      </div>

      <aside className="bg-white border border-black/8 rounded p-6 lg:sticky lg:top-[160px]">
        <div className="flex items-center gap-2 mb-5">
          <Award size={17} style={{ color: red }} />
          <span className="text-sm font-medium" style={{ color: navy }}>人才培养概览</span>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { label: "入学培养", value: `${admittedTotal}人` },
            { label: "毕业学生", value: `${graduatedTotal}人` },
            { label: "硕士入学", value: `${masterTotal}人` },
            { label: "博士入学", value: `${doctoralTotal}人` },
          ].map((item) => (
            <div key={item.label} className="rounded border border-black/8 bg-[#fafafa] p-4 text-center">
              <div className="text-xl font-medium mb-1" style={{ color: red }}>{item.value}</div>
              <div className="text-xs text-gray-500">{item.label}</div>
            </div>
          ))}
        </div>
        {awards && (
          <div>
            <div className="text-sm font-medium mb-3" style={{ color: navy }}>人才与科研荣誉</div>
            <div className="space-y-3">
              {awards.lines
                .filter((line) => /^\d+[.、]/.test(line.trim()))
                .map((line) => (
                  <div key={line} className="flex gap-3 text-sm text-gray-600 leading-relaxed">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: red }} />
                    <span>{line.replace(/^\d+[.、]\s*/, "")}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

function ResearchDetailHero({
  title,
  description,
  current,
}: {
  title: string;
  description: string;
  current: string;
}) {
  return (
    <div style={{ backgroundColor: navy }} className="relative overflow-hidden py-14 md:py-16">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.055) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />
      <div className="max-w-[1440px] mx-auto px-6 relative">
        <nav className="flex items-center gap-2 text-xs text-white/50 mb-6">
          <Link to="/" className="hover:text-white/80">首页</Link>
          <span>/</span>
          <Link to="/research" className="hover:text-white/80">科研成果</Link>
          <span>/</span>
          <span className="text-white/80">{current}</span>
        </nav>
        <Link
          to="/research"
          className="inline-flex items-center gap-2 text-xs text-white/65 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={14} />
          返回科研成果
        </Link>
        <h1 className="text-3xl md:text-4xl font-medium text-white mb-3">{title}</h1>
        <p className="text-white/60 text-sm max-w-2xl leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export function ResearchProjectYearPage() {
  const { year = "" } = useParams();
  const [searchParams] = useSearchParams();
  const selectedYear = decodeURIComponent(year);
  const category = searchParams.get("category") || allLabel;
  const projects = sortProjects(
    researchAchievements.projects
      .filter((item) => item.year === selectedYear)
      .filter((item) => category === allLabel || item.category === category),
  );
  const projectYears = getProjectYears();
  const totalFunding = projects.reduce((sum, item) => sum + (item.amountWan ?? 0), 0);

  return (
    <div>
      <ResearchDetailHero
        title={`${selectedYear || "年度"}获批项目`}
        description="按年份进入项目详情页，集中查看该年度项目级别、负责人、编号与经费信息。"
        current={`${selectedYear || "年度"}获批项目`}
      />
      <div className="h-1" style={{ backgroundColor: red }} />
      <section style={{ backgroundColor: "#f7f6f4" }} className="py-16">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 items-start">
            <aside className="bg-white border border-black/8 rounded p-5 lg:sticky lg:top-[120px]">
              <div className="flex items-center gap-2 mb-5">
                <Landmark size={16} style={{ color: red }} />
                <span className="text-sm font-medium" style={{ color: navy }}>年度项目筛选</span>
              </div>
              <div className="space-y-2 mb-6">
                {projectYears.map((itemYear) => {
                  const active = itemYear === selectedYear;
                  const count = researchAchievements.projects.filter((item) => item.year === itemYear).length;
                  return (
                    <Link
                      key={itemYear}
                      to={projectYearHref(itemYear, category)}
                      className={cn(
                        "flex items-center justify-between rounded border px-3 py-2.5 text-sm transition-colors",
                        active ? "border-[#8b1a1a]/45 bg-[#f7f0f0] text-[#8b1a1a]" : "border-black/8 text-gray-600 hover:border-[#8b1a1a]/25",
                      )}
                    >
                      <span>{itemYear}</span>
                      <span className="text-xs text-gray-400">{count}项</span>
                    </Link>
                  );
                })}
              </div>
              <div className="text-xs text-gray-400 mb-2">项目类别</div>
              <div className="flex flex-wrap gap-2">
                {[allLabel, ...researchAchievements.projectCategories].map((itemCategory) => (
                  <Link
                    key={itemCategory}
                    to={projectYearHref(selectedYear, itemCategory)}
                    className={cn(
                      "h-8 inline-flex items-center px-3 rounded border text-xs font-medium transition-colors",
                      category === itemCategory ? "text-white border-transparent" : "bg-white text-gray-600 border-black/10 hover:border-[#8b1a1a]/35 hover:text-[#8b1a1a]",
                    )}
                    style={{ backgroundColor: category === itemCategory ? red : undefined }}
                  >
                    {itemCategory}
                  </Link>
                ))}
              </div>
            </aside>
            <div>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
                <SectionHeader
                  kicker="获批项目"
                  title={`${selectedYear} 年项目清单`}
                  subtitle={category === allLabel ? "当前显示该年度全部项目。" : `当前仅显示${category}项目。`}
                />
                <div className="grid grid-cols-2 gap-3 md:min-w-[260px]">
                  <div className="bg-white border border-black/8 rounded p-4">
                    <div className="text-2xl font-medium" style={{ color: red }}>{projects.length}</div>
                    <div className="text-xs text-gray-500 mt-1">项目数量</div>
                  </div>
                  <div className="bg-white border border-black/8 rounded p-4">
                    <div className="text-2xl font-medium" style={{ color: red }}>{Math.round(totalFunding)}</div>
                    <div className="text-xs text-gray-500 mt-1">万元经费</div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {projects.map((project) => (
                  <ProjectTimelineRow key={`${project.category}-${project.serial}-${project.code || project.name}`} project={project} />
                ))}
              </div>
              {projects.length === 0 && (
                <div className="bg-white border border-black/8 rounded p-8 text-sm text-gray-500">
                  暂无匹配项目，请切换年份或类别。
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export function ResearchPublicationsPage() {
  const [searchParams] = useSearchParams();
  const initialYear = searchParams.get("year") || allLabel;
  const initialCategory = searchParams.get("category") || allLabel;
  const [publicationYear, setPublicationYear] = useState(initialYear);
  const [publicationCategory, setPublicationCategory] = useState(initialCategory);

  const filteredPublications = useMemo(
    () =>
      sortPublications(
        researchAchievements.publications
          .filter((item) => publicationYear === allLabel || item.year === publicationYear)
          .filter((item) => publicationCategory === allLabel || item.category === publicationCategory),
      ),
    [publicationCategory, publicationYear],
  );

  return (
    <div>
      <ResearchDetailHero
        title="发表文章完整索引"
        description="从科研成果页矩阵进入完整论文列表，可继续按年份与类别筛选查看全部论文。"
        current="发表文章完整索引"
      />
      <div className="h-1" style={{ backgroundColor: red }} />
      <section className="bg-white py-16">
        <div className="max-w-[1440px] mx-auto px-6">
          <SectionHeader
            kicker="发表文章"
            title="论文完整列表"
            subtitle="保留年份矩阵和类别筛选，当前页面显示完整结果。"
          />
          <div className="space-y-8">
            <PublicationMatrix
              years={researchAchievements.publicationYears}
              categories={researchAchievements.publicationCategories}
              publications={researchAchievements.publications}
              selectedYear={publicationYear}
              selectedCategory={publicationCategory}
              onYearChange={setPublicationYear}
              onCategoryChange={setPublicationCategory}
            />
            <PublicationIndex
              publications={filteredPublications}
              selectedYear={publicationYear}
              selectedCategory={publicationCategory}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export function ResearchPage() {
  const projects = researchAchievements.projects;
  const publications = researchAchievements.publications;
  const students = researchAchievements.students;
  const awards = sectionByTitle("获奖");
  const imageItems = achievementImages.flatMap((group) => group.items.map((item) => ({ ...item, groupTitle: group.title })));

  const [projectCategory, setProjectCategory] = useState(allLabel);
  const [publicationYear, setPublicationYear] = useState(allLabel);
  const [publicationCategory, setPublicationCategory] = useState("SCI");

  const totalFunding = projects.reduce((sum, item) => sum + (item.amountWan ?? 0), 0);
  const admittedTotal = students.reduce((sum, item) => sum + item.admittedTotal, 0);
  const graduatedTotal = students.reduce((sum, item) => sum + item.graduatedTotal, 0);
  const doctoralTotal = students.reduce((sum, item) => sum + item.admitted.doctors.length, 0);
  const masterTotal = students.reduce((sum, item) => sum + item.admitted.masters.length, 0);
  const awardCount = awards ? countNumbered(awards.lines) : 4;

  const filteredProjects = useMemo(
    () => sortProjects(projects.filter((item) => projectCategory === allLabel || item.category === projectCategory)),
    [projectCategory, projects],
  );

  const filteredPublications = useMemo(
    () =>
      sortPublications(
        publications
          .filter((item) => publicationYear === allLabel || item.year === publicationYear)
          .filter((item) => publicationCategory === allLabel || item.category === publicationCategory),
      ),
    [publicationCategory, publicationYear, publications],
  );

  return (
    <div>
      <div style={{ backgroundColor: navy }} className="relative overflow-hidden py-16 md:py-20">
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
          <div className="flex items-start gap-4">
            <div className="hidden md:flex w-12 h-12 rounded items-center justify-center border border-white/15 bg-white/5">
              <LibraryBig size={22} style={{ color: gold }} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-medium text-white mb-3">科研成果</h1>
              <p className="text-white/60 text-sm max-w-2xl leading-relaxed">{getPreview(centerTeam, 150)}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="h-1" style={{ backgroundColor: red }} />

      <ResearchOverviewStrip
        totalFunding={totalFunding}
        admittedTotal={admittedTotal}
        graduatedTotal={graduatedTotal}
        masterTotal={masterTotal}
        doctoralTotal={doctoralTotal}
        awardCount={awardCount}
      />
      <ResearchArchiveNav />

      <section id="projects-archive" style={{ backgroundColor: "#f7f6f4" }} className="scroll-mt-36 py-20">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
            <SectionHeader
              kicker="获批项目"
              title="项目年度时间轴"
              subtitle="按年度展示获批项目入口，点击某一年进入详情页查看该年度完整项目清单。"
            />
            <div className="text-sm text-gray-500">
              当前显示 <span className="font-medium" style={{ color: red }}>{filteredProjects.length}</span> 项
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
            <FundingSummaryPanel
              categories={researchAchievements.projectCategories}
              projects={projects}
              activeCategory={projectCategory}
              onCategoryChange={setProjectCategory}
            />
            <ProjectTimeline projects={filteredProjects} activeCategory={projectCategory} />
          </div>
        </div>
      </section>

      <section id="publications-archive" className="scroll-mt-36 bg-white py-20 border-t border-black/8">
        <div className="max-w-[1440px] mx-auto px-6">
          <SectionHeader
            kicker="发表文章"
            title="论文索引与年份矩阵"
            subtitle="将 2021-2025 年论文按年份与 SCI/CSCD/其他类别组织，兼顾成果概览和 DOI 检索。"
          />
          <div className="space-y-8">
            <PublicationMatrix
              years={researchAchievements.publicationYears}
              categories={researchAchievements.publicationCategories}
              publications={publications}
              selectedYear={publicationYear}
              selectedCategory={publicationCategory}
              onYearChange={setPublicationYear}
              onCategoryChange={setPublicationCategory}
            />
            <PublicationIndex
              publications={filteredPublications}
              selectedYear={publicationYear}
              selectedCategory={publicationCategory}
              previewLimit={3}
              moreHref={publicationsHref(publicationYear, publicationCategory)}
            />
          </div>
        </div>
      </section>

      <section id="students-archive" style={{ backgroundColor: "#f7f6f4" }} className="scroll-mt-36 py-20 border-t border-black/8">
        <div className="max-w-[1440px] mx-auto px-6">
          <SectionHeader
            kicker="学生培养"
            title="人才培养时间轴"
            subtitle="按 2021级至2025级呈现硕博士入学培养与毕业情况，移动端以折叠清单降低信息负担。"
          />
          <StudentTimeline
            students={students}
            awards={awards}
            admittedTotal={admittedTotal}
            graduatedTotal={graduatedTotal}
            masterTotal={masterTotal}
            doctoralTotal={doctoralTotal}
          />
        </div>
      </section>

      <section className="bg-white py-20 border-t border-black/8">
        <div className="max-w-[1440px] mx-auto px-6">
          <SectionHeader kicker="学术交流" title="国内外学术交流图片" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {imageItems.map((item) => (
              <article key={item.src} className="border border-black/8 rounded overflow-hidden bg-[#fafafa] hover:shadow-md transition-shadow">
                <img src={item.src} alt={item.caption || item.heading} className="w-full h-48 object-cover" />
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <CalendarDays size={13} className="text-gray-400" />
                    <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: "#f0efed", color: red }}>
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
