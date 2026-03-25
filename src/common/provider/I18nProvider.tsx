"use client";

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Language } from "@/common/enum";
import { flattenMessages } from "@/common/i18n/flattenMessages";
import enMessages from "@/common/i18n/en.json";
import ptBRMessages from "@/common/i18n/pt-BR.json";

type Messages = Record<string, string>;

interface I18nContextType {
  locale: Language;
  changeLocale: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const LS_LOCALE = "locale";
const LS_CACHE_PREFIX = "i18n_";
const LS_CACHE_DATE = "i18n_cache_date";

const RAW_MESSAGES: Record<Language, object> = {
  [Language.EN]: enMessages,
  [Language.PT_BR]: ptBRMessages,
};

function invalidateCacheIfStale(): void {
  const today = new Date().toISOString().slice(0, 10);
  try {
    if (localStorage.getItem(LS_CACHE_DATE) !== today) {
      Object.values(Language).forEach((lang) =>
        localStorage.removeItem(`${LS_CACHE_PREFIX}${lang}`),
      );
      localStorage.setItem(LS_CACHE_DATE, today);
    }
  } catch {
    // localStorage unavailable — skip cache
  }
}

function loadMessages(lang: Language): Messages {
  invalidateCacheIfStale();
  const cacheKey = `${LS_CACHE_PREFIX}${lang}`;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached) as Messages;
  } catch {
    // corrupted cache — rebuild
  }
  const flat = flattenMessages(RAW_MESSAGES[lang] as Parameters<typeof flattenMessages>[0]);
  try {
    localStorage.setItem(cacheKey, JSON.stringify(flat));
  } catch {
    // localStorage full — skip cache
  }
  return flat;
}

const I18nContext = createContext<I18nContextType>({
  locale: Language.EN,
  changeLocale: () => {},
  t: (key) => key,
});

export function useTranslation() {
  return useContext(I18nContext);
}

// Pre-load English before mount to avoid null/flash
const defaultMessages = flattenMessages(enMessages as Parameters<typeof flattenMessages>[0]);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Language>(Language.EN);
  const [messages, setMessages] = useState<Messages>(defaultMessages);

  useEffect(() => {
    const saved = localStorage.getItem(LS_LOCALE) as Language | null;
    if (saved && Object.values(Language).includes(saved) && saved !== Language.EN) {
      setLocale(saved);
      setMessages(loadMessages(saved));
    }
  }, []);

  const changeLocale = useCallback((lang: Language) => {
    localStorage.setItem(LS_LOCALE, lang);
    setLocale(lang);
    setMessages(loadMessages(lang));
  }, []);

  const t = useCallback(
    (key: string, fallback?: string): string =>
      messages[key] ?? fallback ?? key,
    [messages],
  );

  return (
    <I18nContext.Provider value={{ locale, changeLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}
