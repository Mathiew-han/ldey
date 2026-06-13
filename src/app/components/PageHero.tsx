import { Link } from "react-router";
import type { ReactNode } from "react";

type Breadcrumb = {
  label: string;
  to?: string;
};

export function PageHero({
  title,
  description,
  breadcrumbs,
  background,
  children,
}: {
  title: string;
  description: string;
  breadcrumbs: Breadcrumb[];
  background: string;
  children?: ReactNode;
}) {
  return (
    <div style={{ backgroundColor: "#0d2b52" }} className="relative overflow-hidden py-16 md:py-20">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.055) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />
      <div
        className="absolute inset-0 opacity-65 bg-cover bg-center"
        style={{ backgroundImage: `url('${background}')` }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(13,43,82,0.98) 0%, rgba(13,43,82,0.78) 42%, rgba(13,43,82,0.38) 100%)",
        }}
      />
      <div className="max-w-[1440px] mx-auto px-6 relative">
        <nav className="flex items-center gap-2 text-xs text-white/50 mb-6">
          {breadcrumbs.map((item, index) => (
            <span key={`${item.label}-${index}`} className="contents">
              {index > 0 && <span>/</span>}
              {item.to ? (
                <Link to={item.to} className="hover:text-white/80">
                  {item.label}
                </Link>
              ) : (
                <span className="text-white/80">{item.label}</span>
              )}
            </span>
          ))}
        </nav>
        {children}
        <h1 className="text-3xl md:text-4xl font-medium text-white mb-3">{title}</h1>
        <p className="text-white/60 text-sm max-w-2xl leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
