import { useState } from "react";
import { Link, NavLink } from "react-router";
import { Menu, X, Search, Phone, ChevronDown } from "lucide-react";

const navItems = [
  { label: "首页", path: "/" },
  { label: "数据中心", path: "/data-center" },
  { label: "数据库建设", path: "/database" },
  {
    label: "专病库",
    path: "/disease-detail",
    children: [
      { label: "肝硬化医学影像专病库", path: "/disease-detail" },
      { label: "胃癌医学影像专病库", path: "/database" },
      { label: "结直肠癌医学影像专病库", path: "/database" },
      { label: "肺癌医学影像专病库", path: "/database" },
      { label: "脑肿瘤医学影像专病库", path: "/database" },
      { label: "冠心病医学影像专病库", path: "/database" },
      { label: "肺炎医学影像专病库", path: "/database" },
    ],
  },
  { label: "专家团队", path: "/experts" },
  { label: "科研成果", path: "/research" },
  { label: "联系我们", path: "/contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* Top utility bar */}
      <div style={{ backgroundColor: "#0d2b52" }} className="hidden md:block">
        <div className="max-w-[1440px] mx-auto px-6 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-white/70 text-xs tracking-wide">
              甘肃省医学影像科学数据中心
            </span>
            <span className="text-white/30 text-xs">|</span>
            <span className="text-white/70 text-xs">依托单位：兰州大学第二医院</span>
          </div>
          <div className="flex items-center gap-5">
            <a
              href="tel:15809317062"
              className="flex items-center gap-1.5 text-white/70 text-xs hover:text-white transition-colors"
            >
              <Phone size={11} />
              <span>15809317062</span>
            </a>
            <span className="text-white/30 text-xs">|</span>
            <Link
              to="/contact"
              className="text-white/70 text-xs hover:text-white transition-colors"
            >
              数据申请
            </Link>
            <span className="text-white/30 text-xs">|</span>
            <Link
              to="/contact"
              className="text-white/70 text-xs hover:text-white transition-colors"
            >
              合作申请
            </Link>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav className="bg-white border-b border-black/10">
        <div className="max-w-[1440px] mx-auto px-6 flex items-center justify-between h-16">
          {/* Logo area */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img
              src="/images/brand/gsmi-logo.png"
              alt="甘肃省医学影像科学数据中心"
              className="w-11 h-11 object-contain shrink-0"
            />
            <div>
              <div
                className="text-sm font-medium leading-tight tracking-wide"
                style={{ color: "#8b1a1a" }}
              >
                甘肃省医学影像科学数据中心
              </div>
              <div className="text-xs text-gray-500 leading-tight mt-0.5 tracking-widest">
                GSMI SCIENCE DATA CENTER
              </div>
            </div>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center gap-0">
            {navItems.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setDropdownOpen(item.label)}
                  onMouseLeave={() => setDropdownOpen(null)}
                >
                  <button className="flex items-center gap-1 px-4 py-5 text-sm text-gray-700 hover:text-[#8b1a1a] transition-colors font-medium">
                    {item.label}
                    <ChevronDown size={13} className="opacity-60" />
                  </button>
                  {dropdownOpen === item.label && (
                    <div className="absolute top-full left-0 bg-white border border-black/10 shadow-lg min-w-[200px] z-50">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className="block px-5 py-3 text-sm text-gray-700 hover:bg-[#f7f0f0] hover:text-[#8b1a1a] border-b border-black/5 last:border-0 transition-colors"
                          onClick={() => setDropdownOpen(null)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `px-4 py-5 text-sm font-medium transition-colors border-b-2 ${
                      isActive
                        ? "text-[#8b1a1a] border-[#8b1a1a]"
                        : "text-gray-700 border-transparent hover:text-[#8b1a1a]"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              )
            )}
          </div>

          {/* Search + mobile toggle */}
          <div className="flex items-center gap-3">
            <button
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-xs text-gray-500 border border-gray-200 rounded hover:border-[#8b1a1a] hover:text-[#8b1a1a] transition-colors"
            >
              <Search size={13} />
              <span>检索数据库</span>
            </button>
            <button
              className="lg:hidden p-2 text-gray-600"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-black/10">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `block px-6 py-3.5 text-sm border-b border-black/5 ${
                    isActive ? "text-[#8b1a1a] bg-[#f7f0f0]" : "text-gray-700"
                  }`
                }
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            <div style={{ backgroundColor: "#0d2b52" }} className="px-6 py-3 text-xs text-white/70">
              咨询热线：15809317062
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
