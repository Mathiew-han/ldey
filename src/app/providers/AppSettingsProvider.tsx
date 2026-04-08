import { useEffect, useMemo, useState } from 'react'
import { AppSettingsContext, type AppSettings, type Lang, type Theme } from './AppSettingsContext'

function getInitialTheme(): Theme {
  const saved = localStorage.getItem('app:theme')
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getInitialLang(): Lang {
  const saved = localStorage.getItem('app:lang')
  if (saved === 'zh-CN' || saved === 'en') return saved
  return 'zh-CN'
}

export function AppSettingsProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => getInitialTheme())
  const [lang, setLangState] = useState<Lang>(() => getInitialLang())

  const setTheme = (t: Theme) => setThemeState(t)
  const toggleTheme = () => setThemeState((t) => (t === 'dark' ? 'light' : 'dark'))
  const setLang = (l: Lang) => setLangState(l)

  useEffect(() => {
    localStorage.setItem('app:theme', theme)
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    localStorage.setItem('app:lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  const value = useMemo<AppSettings>(
    () => ({
      theme,
      setTheme,
      toggleTheme,
      lang,
      setLang,
    }),
    [lang, theme],
  )

  return <AppSettingsContext.Provider value={value}>{children}</AppSettingsContext.Provider>
}
