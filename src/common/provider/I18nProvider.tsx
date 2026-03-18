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

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Messages = Record<string, string>;

interface I18nContextType {
  locale: Language;
  changeLocale: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

// ─── Chaves de localStorage ───────────────────────────────────────────────────

const LS_LOCALE = "locale";
const LS_CACHE_PREFIX = "i18n_";

// ─── Mapa de mensagens brutas por idioma ─────────────────────────────────────

const RAW_MESSAGES: Record<Language, object> = {
  [Language.EN]: enMessages,
  [Language.PT_BR]: ptBRMessages,
};

// ─── Função que carrega e cacheia as mensagens achatadas ──────────────────────

function loadMessages(lang: Language): Messages {
  const cacheKey = `${LS_CACHE_PREFIX}${lang}`;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached) as Messages;
  } catch {
    // cache inválido — reconstrói
  }
  const flat = flattenMessages(RAW_MESSAGES[lang] as Parameters<typeof flattenMessages>[0]);
  try {
    localStorage.setItem(cacheKey, JSON.stringify(flat));
  } catch {
    // localStorage cheio — ignora cache
  }
  return flat;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const I18nContext = createContext<I18nContextType>({
  locale: Language.EN,
  changeLocale: () => {},
  t: (key) => key,
});

export function useTranslation() {
  return useContext(I18nContext);
}

// ─── Provider ─────────────────────────────────────────────────────────────────

// Pré-carrega inglês sem esperar o mount (sem flash, sem null)
const defaultMessages = flattenMessages(enMessages as Parameters<typeof flattenMessages>[0]);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Language>(Language.EN);
  const [messages, setMessages] = useState<Messages>(defaultMessages);

  // Ao montar: lê preferência do localStorage e aplica
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
