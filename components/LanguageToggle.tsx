"use client";

import { useI18n } from "@/lib/i18n/context";

export function LanguageToggle() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="inline-flex rounded-full border border-black/10 bg-white p-1 text-sm dark:border-white/15 dark:bg-zinc-900">
      {(["ru", "uz"] as const).map((code) => (
        <button
          key={code}
          onClick={() => setLocale(code)}
          className={`rounded-full px-3 py-1 font-medium transition-colors ${
            locale === code
              ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50"
          }`}
        >
          {code === "ru" ? "Рус" : "Uz"}
        </button>
      ))}
    </div>
  );
}
