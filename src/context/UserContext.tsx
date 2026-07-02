import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { t as translate, type TranslationKey } from '../i18n/translations';
import type { Lang, ThemeMode } from '../types/weather';

const LANG_STORAGE_KEY = 'weather-lang';
const THEME_STORAGE_KEY = 'weather-theme';

interface UserContextValue {
  lang: Lang;
  themeMode: ThemeMode;
  setLang: (lang: Lang) => void;
  setThemeMode: (mode: ThemeMode) => void;
  t: (key: TranslationKey) => string;
}

const UserContext = createContext<UserContextValue | null>(null);

function readStoredLang(): Lang {
  const stored = localStorage.getItem(LANG_STORAGE_KEY);
  return stored === 'en' ? 'en' : 'uk';
}

function readStoredTheme(): ThemeMode {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored === 'night' ? 'night' : 'day';
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readStoredLang);
  const [themeMode, setThemeModeState] = useState<ThemeMode>(readStoredTheme);

  const setLang = useCallback((nextLang: Lang) => {
    setLangState(nextLang);
    localStorage.setItem(LANG_STORAGE_KEY, nextLang);
  }, []);

  const setThemeMode = useCallback((nextTheme: ThemeMode) => {
    setThemeModeState(nextTheme);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove('theme-day', 'theme-night');
    document.documentElement.classList.add(`theme-${themeMode}`);
    document.documentElement.lang = lang;
  }, [themeMode, lang]);

  const t = useCallback((key: TranslationKey) => translate(lang, key), [lang]);

  const value = useMemo(
    () => ({ lang, themeMode, setLang, setThemeMode, t }),
    [lang, themeMode, setLang, setThemeMode, t],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
