"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import ru from "./ru.json";
import uz from "./uz.json";

const dictionaries = { ru, uz } as const;
export type Locale = keyof typeof dictionaries;
type Dictionary = typeof ru;

const STORAGE_KEY = "family-tree-locale";

// Tiny external store so the persisted locale can be read without a
// setState-in-effect (which would either mismatch SSR output or trigger an
// extra render pass). useSyncExternalStore is the sanctioned way to read a
// browser API like localStorage that the server can't see.
const listeners = new Set<() => void>();

function readStoredLocale(): Locale {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "ru" || stored === "uz" ? stored : "ru";
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Locale {
  return readStoredLocale();
}

function getServerSnapshot(): Locale {
  return "ru";
}

function persistLocale(next: Locale) {
  window.localStorage.setItem(STORAGE_KEY, next);
  listeners.forEach((listener) => listener());
}

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof Dictionary) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const value = useMemo<I18nContextValue>(() => {
    const dict = dictionaries[locale];
    return {
      locale,
      setLocale: persistLocale,
      t: (key) => dict[key] ?? String(key),
    };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
