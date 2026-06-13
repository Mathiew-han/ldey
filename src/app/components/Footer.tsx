import { Link } from "react-router";
import { MapPin, Phone, Mail, ExternalLink, ArrowUp } from "lucide-react";
import { partners } from "../data/siteContent";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer style={{ backgroundColor: "#0d2b52" }} className="text-white/80">
      <div className="relative bg-white">
        <div
          role="img"
          aria-label="甘肃省医学影像科学数据中心校园与医学影像插画"
          className="w-full h-[260px] md:h-[360px] bg-cover bg-bottom"
          style={{
            backgroundImage:
              "linear-gradient(to top, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.24) 42%, rgba(255,255,255,0.82) 76%, #ffffff 100%), url('/images/brand/footer-campus-anime.png')",
          }}
        />
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="返回顶部"
          title="返回顶部"
          className="group absolute left-1/2 bottom-0 z-10 -translate-x-1/2 translate-y-[44%] w-28 h-28 md:w-40 md:h-40 rounded-full bg-white shadow-[0_18px_45px_rgba(13,43,82,0.28)] overflow-hidden flex items-start justify-center text-[#0d2b52] hover:text-[#8b1a1a] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c8a96e]"
        >
          <span className="absolute inset-0 bg-cover bg-bottom opacity-25 transition-opacity group-hover:opacity-32"
            style={{ backgroundImage: "url('/images/brand/footer-campus-anime.png')" }}
          />
          <span
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, #ffffff 0%, rgba(255,255,255,0.92) 38%, rgba(255,255,255,0.72) 100%)",
            }}
          />
          <span className="relative mt-8 md:mt-12 flex flex-col items-center">
            <span className="w-px h-6 md:h-8 bg-current opacity-80" />
            <ArrowUp size={34} strokeWidth={2.1} className="-mt-3 md:-mt-4" />
          </span>
        </button>
      </div>

      {/* Main footer content */}
      <div className="max-w-[1440px] mx-auto px-6 pt-24 md:pt-28 pb-14">
        <div className="grid grid-cols-1 md:grid-cols-[1.15fr_0.85fr_0.85fr_1fr] gap-10 items-start">
          {/* Column 1: Institution info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <img
                src="/images/brand/gsmi-logo.png"
                alt="甘肃省医学影像科学数据中心"
                className="w-11 h-11 object-contain shrink-0"
              />
              <div>
                <div className="text-white text-sm font-medium leading-snug">
                  甘肃省医学影像科学数据中心
                </div>
                <div className="text-white/50 text-xs mt-0.5 tracking-wider">
                  GSMI SCIENCE DATA CENTER
                </div>
              </div>
            </div>
            <p className="text-white/60 text-xs leading-relaxed mb-5">
              依托兰州大学第二医院，面向全省四级医疗机构，推动医学影像数据标准化、共享化与科研临床协同。
            </p>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2">
                <MapPin size={13} className="text-[#c8a96e] shrink-0 mt-0.5" />
                <span className="text-white/60 text-xs leading-relaxed">
                  甘肃省兰州市城关区萃英门82号<br />兰州大学第二医院
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={13} className="text-[#c8a96e] shrink-0" />
                <span className="text-white/60 text-xs">15809317062</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={13} className="text-[#c8a96e] shrink-0" />
                <span className="text-white/60 text-xs">contact@gansu-medical-imaging.cn</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick navigation */}
          <div>
            <h4 className="text-white text-sm font-medium mb-5 pb-2.5 border-b border-white/15">
              快速导航
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "数据中心简介", path: "/data-center" },
                { label: "数据库建设", path: "/database" },
                { label: "肝硬化专病库", path: "/disease-detail" },
                { label: "专家团队", path: "/experts" },
                { label: "科研成果", path: "/research" },
                { label: "联系我们", path: "/contact" },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-white/60 text-xs hover:text-[#c8a96e] transition-colors flex items-center gap-1.5"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#c8a96e] opacity-60 shrink-0" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Cooperation & services */}
          <div>
            <h4 className="text-white text-sm font-medium mb-5 pb-2.5 border-b border-white/15">
              数据服务
            </h4>
            <ul className="space-y-2.5">
              {[
                "数据申请流程",
                "科研合作申请",
                "数据共享协议",
                "伦理审查说明",
                "数据安全规范",
                "使用条款",
              ].map((item) => (
                <li key={item}>
                  <Link
                    to="/contact"
                    className="text-white/60 text-xs hover:text-[#c8a96e] transition-colors flex items-center gap-1.5"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#c8a96e] opacity-60 shrink-0" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Partners */}
          <div>
            <h4 className="text-white text-sm font-medium mb-5 pb-2.5 border-b border-white/15">
              主要依托单位
            </h4>
            <ul className="space-y-2.5">
              {partners.map((partner) => (
                <li key={partner.name}>
                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-white/60 text-xs hover:text-[#c8a96e] transition-colors flex items-center gap-1.5"
                  >
                    <ExternalLink size={11} className="shrink-0 opacity-60" />
                    {partner.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10" />
      </div>

      {/* Bottom bar */}
      <div style={{ backgroundColor: "rgba(0,0,0,0.25)" }} className="border-t border-white/10">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs text-center md:text-left">
            © 2026 甘肃省医学影像科学数据中心 · 兰州大学第二医院 保留所有权利
          </p>
          <div className="flex items-center gap-5">
            <a href="#" className="text-white/40 text-xs hover:text-white/70 transition-colors">
              隐私政策
            </a>
            <a href="#" className="text-white/40 text-xs hover:text-white/70 transition-colors">
              网站声明
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
