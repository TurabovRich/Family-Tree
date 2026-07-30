"use client";

import { useI18n } from "@/lib/i18n/context";
import { LanguageToggle } from "./LanguageToggle";
import { TreeView } from "./TreeView";
import type { PersonRow, SpouseRow } from "@/lib/types";

type Props = {
  people: PersonRow[];
  spouses: SpouseRow[];
  defaultRootId: string | null;
  loadError?: boolean;
};

export function HomePage({ people, spouses, defaultRootId, loadError }: Props) {
  const { t } = useI18n();

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-black/5 px-6 py-4 dark:border-white/10">
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {t("title")}
        </h1>
        <LanguageToggle />
      </header>
      <main className="flex flex-1 flex-col p-6">
        {loadError ? (
          <p className="p-8 text-center text-red-600 dark:text-red-400">
            {t("loadError")}
          </p>
        ) : defaultRootId ? (
          <TreeView
            people={people}
            spouses={spouses}
            defaultRootId={defaultRootId}
          />
        ) : (
          <p className="p-8 text-center text-zinc-500 dark:text-zinc-400">
            {t("empty")}
          </p>
        )}
      </main>
    </div>
  );
}
