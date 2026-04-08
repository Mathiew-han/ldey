import { createContext } from 'react'

export type Theme = 'light' | 'dark'
export type Lang = 'zh-CN' | 'en'

export type AppSettings = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  lang: Lang
  setLang: (lang: Lang) => void
}

export const AppSettingsContext = createContext<AppSettings | null>(null)

