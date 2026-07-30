"use client";

import { useMemo, useState } from "react";
import ReactFamilyTree from "react-family-tree";
import type { ExtNode } from "relatives-tree/lib/types";
import { buildTreeNodes } from "@/lib/buildTree";
import type { PersonRow, SpouseRow } from "@/lib/types";
import { PersonCard, NODE_WIDTH, NODE_HEIGHT } from "./PersonCard";
import { useI18n } from "@/lib/i18n/context";

type Props = {
  people: PersonRow[];
  spouses: SpouseRow[];
  defaultRootId: string;
};

export function TreeView({ people, spouses, defaultRootId }: Props) {
  const { t } = useI18n();
  const [rootId, setRootId] = useState(defaultRootId);

  const byId = useMemo(() => new Map(people.map((p) => [p.id, p])), [people]);
  const nodes = useMemo(() => buildTreeNodes(people, spouses), [people, spouses]);
  const effectiveRootId = byId.has(rootId) ? rootId : defaultRootId;

  if (people.length === 0) {
    return (
      <p className="p-8 text-center text-zinc-500 dark:text-zinc-400">
        {t("empty")}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {effectiveRootId !== defaultRootId && (
        <button
          type="button"
          onClick={() => setRootId(defaultRootId)}
          className="self-start rounded-full border border-black/10 bg-white px-4 py-1.5 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-white/15 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          ← {t("backToRoot")}
        </button>
      )}
      <div className="overflow-auto rounded-2xl border border-black/5 bg-zinc-50 p-8 dark:border-white/10 dark:bg-zinc-950">
        <ReactFamilyTree
          nodes={nodes}
          rootId={effectiveRootId}
          width={NODE_WIDTH}
          height={NODE_HEIGHT}
          className="relative"
          renderNode={(node: ExtNode) => (
            <PersonCard
              key={node.id}
              node={node}
              person={byId.get(node.id)}
              isRoot={node.id === effectiveRootId}
              onFocus={setRootId}
            />
          )}
        />
      </div>
    </div>
  );
}
