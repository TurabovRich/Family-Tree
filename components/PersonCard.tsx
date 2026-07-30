"use client";

import type { ExtNode } from "relatives-tree/lib/types";
import type { PersonRow } from "@/lib/types";
import { useI18n } from "@/lib/i18n/context";

export const NODE_WIDTH = 200;
export const NODE_HEIGHT = 220;

type Props = {
  node: ExtNode;
  person: PersonRow | undefined;
  isRoot: boolean;
  onFocus: (id: string) => void;
};

export function PersonCard({ node, person, isRoot, onFocus }: Props) {
  const { t } = useI18n();

  const style: React.CSSProperties = {
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
    position: "absolute",
    transform: `translate(${node.left * (NODE_WIDTH / 2)}px, ${node.top * (NODE_HEIGHT / 2)}px)`,
  };

  if (!person) {
    return <div style={style} />;
  }

  const years = [person.birth_year, person.death_year].filter(
    (y): y is number => y != null
  );
  const yearsLabel =
    years.length > 0
      ? `${t("born")} ${years[0]}${years[1] ? ` — ${t("died")} ${years[1]}` : ""}`
      : null;

  return (
    <div style={style} className="p-2">
      <button
        type="button"
        onClick={() => onFocus(person.id)}
        title={t("focusOn")}
        className={`flex h-full w-full flex-col items-center justify-start gap-2 rounded-xl border bg-white p-3 text-center shadow-sm transition-shadow hover:shadow-md dark:bg-zinc-900 ${
          isRoot
            ? "border-amber-400 ring-2 ring-amber-300"
            : "border-black/10 dark:border-white/15"
        }`}
      >
        <div className="relative h-20 w-20 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={person.photo_url || "/no-photo.svg"}
            alt={person.full_name}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/no-photo.svg";
            }}
          />
        </div>
        <div className="flex flex-col items-center">
          <span className="text-sm font-semibold leading-tight text-zinc-900 dark:text-zinc-50">
            {person.full_name}
          </span>
          {yearsLabel && (
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {yearsLabel}
            </span>
          )}
          {person.needs_review && (
            <span className="mt-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-800 dark:bg-amber-900 dark:text-amber-200">
              {t("needsReview")}
            </span>
          )}
        </div>
      </button>
    </div>
  );
}
