"use client";

import { useMemo, useState } from "react";
import ReactFamilyTree from "react-family-tree";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import type { ExtNode } from "relatives-tree/lib/types";
import { buildTreeNodes } from "@/lib/buildTree";
import type { PersonRow, SpouseRow } from "@/lib/types";
import { PersonCard, NODE_WIDTH, NODE_HEIGHT } from "./PersonCard";

type Props = {
  people: PersonRow[];
  spouses: SpouseRow[];
  defaultRootId: string;
};

const controlButtonClass =
  "flex h-9 w-9 items-center justify-center rounded-lg text-lg font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800";

export function TreeView({ people, spouses, defaultRootId }: Props) {
  const [rootId, setRootId] = useState(defaultRootId);

  const byId = useMemo(() => new Map(people.map((p) => [p.id, p])), [people]);
  const nodes = useMemo(() => buildTreeNodes(people, spouses), [people, spouses]);
  const effectiveRootId = byId.has(rootId) ? rootId : defaultRootId;

  if (people.length === 0) {
    return (
      <p className="p-8 text-center text-zinc-500 dark:text-zinc-400">
        Bazada hali birorta odam yo&apos;q.
      </p>
    );
  }

  return (
    <div className="relative flex-1 bg-zinc-50 dark:bg-zinc-950">
      <TransformWrapper
        key={effectiveRootId}
        initialScale={1}
        minScale={0.15}
        maxScale={2.5}
        centerOnInit
        wheel={{ step: 0.12 }}
        doubleClick={{ disabled: true }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            {effectiveRootId !== defaultRootId && (
              <button
                type="button"
                onClick={() => setRootId(defaultRootId)}
                className="absolute left-4 top-4 z-10 rounded-full border border-black/10 bg-white px-4 py-1.5 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-white/15 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                ← Boshiga qaytish
              </button>
            )}
            <div className="absolute right-4 top-4 z-10 flex flex-col gap-0.5 rounded-xl border border-black/10 bg-white/95 p-1 shadow-sm backdrop-blur dark:border-white/15 dark:bg-zinc-900/95">
              <button
                type="button"
                onClick={() => zoomIn()}
                aria-label="Kattalashtirish"
                className={controlButtonClass}
              >
                +
              </button>
              <button
                type="button"
                onClick={() => zoomOut()}
                aria-label="Kichiklashtirish"
                className={controlButtonClass}
              >
                −
              </button>
              <button
                type="button"
                onClick={() => resetTransform()}
                aria-label="Asl holatga qaytarish"
                className={`${controlButtonClass} text-sm`}
              >
                ⤾
              </button>
            </div>
            <TransformComponent
              wrapperStyle={{ width: "100%", height: "100%" }}
              contentStyle={{ padding: 64 }}
            >
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
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}
