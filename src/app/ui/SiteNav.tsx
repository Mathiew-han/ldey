import { useEffect, useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import styles from './site.module.css'
import { useAppSettings } from '../providers/useAppSettings'

export function SiteNav() {
  const [open, setOpen] = useState(false)
  const [scrollY, setScrollY] = useState(() => (typeof window === 'undefined' ? 0 : window.scrollY))
  const { lang, setLang, theme, toggleTheme } = useAppSettings()

  const nav = useMemo(() => {
    if (lang === 'en') {
      return [
        { to: '/', label: 'Home' },
        { to: '/experts', label: 'Experts' },
        { to: '/staff', label: 'Staff' },
        { to: '/center', label: 'Center' },
        { to: '/database', label: 'Database' },
        { to: '/achievements', label: 'Achievements' },
      ]
    }
    return [
      { to: '/', label: '首页' },
      { to: '/experts', label: '专家组成员' },
      { to: '/staff', label: '主要工作人员' },
      { to: '/center', label: '数据中心' },
      { to: '/database', label: '数据库建设' },
      { to: '/achievements', label: '项目成果' },
    ]
  }, [lang])

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const headerStrength = Math.max(0, Math.min(1, scrollY / 80))

  return (
    <header
      className={styles.header}
      style={{ ['--header-s' as string]: String(headerStrength) }}
    >
      <div className={styles.container}>
        <div className={styles.headerTop}>
          <div className={styles.brand}>
            <div className={styles.brandTitle}>{lang === 'en' ? 'Medical Imaging Database' : '医学影像数据库'}</div>
            <div className={styles.brandSubtitle}>Gansu Medical Imaging Science Data Center</div>
          </div>

          <nav className={styles.nav} aria-label="primary">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? styles.navLinkActive : styles.navLink)}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className={styles.headerRight}>
            <button className={styles.langToggle} onClick={() => setLang(lang === 'en' ? 'zh-CN' : 'en')} type="button">
              {lang === 'en' ? '中' : 'EN'}
            </button>
            <button
              className={styles.themeSwitch}
              data-checked={theme === 'dark'}
              role="switch"
              aria-checked={theme === 'dark'}
              aria-label={lang === 'en' ? 'Theme' : '主题'}
              onClick={toggleTheme}
              type="button"
            >
              <span className={styles.themeThumb} aria-hidden="true" />
            </button>
            <button
              className={styles.menuBtn}
              onClick={() => setOpen((v) => !v)}
              type="button"
            >
              {lang === 'en' ? 'Menu' : '菜单'}
            </button>
          </div>
        </div>

        {open ? (
          <nav className={styles.navMobile} aria-label="mobile">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? styles.navMobileActive : styles.navMobileLink)}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        ) : null}
      </div>
    </header>
  )
}
