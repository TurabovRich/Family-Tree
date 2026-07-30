import type { Node as TreeNode, Relation } from "relatives-tree/lib/types";
import type { PersonRow, SpouseRow } from "./types";

// relatives-tree's .d.ts declares Gender/RelType as ambient `const enum`s,
// which TypeScript refuses to access as values under `isolatedModules`
// (Next.js's build requirement). Their runtime values are plain strings, so
// we use string-literal casts to the field types instead of the enums
// themselves.
type RelationType = Relation["type"];
type Gender = TreeNode["gender"];

/** Converts flat Supabase rows into the graph shape relatives-tree expects. */
export function buildTreeNodes(
  people: readonly PersonRow[],
  spouseRows: readonly SpouseRow[]
): TreeNode[] {
  const byId = new Map(people.map((p) => [p.id, p]));

  const childrenOf = new Map<string, PersonRow[]>();
  for (const p of people) {
    for (const parentId of [p.father_id, p.mother_id]) {
      if (!parentId || !byId.has(parentId)) continue;
      const list = childrenOf.get(parentId);
      if (list) list.push(p);
      else childrenOf.set(parentId, [p]);
    }
  }

  const spousesOf = new Map<string, Relation[]>();
  const addSpouse = (from: string, to: string, type: RelationType) => {
    const list = spousesOf.get(from);
    if (list) list.push({ id: to, type });
    else spousesOf.set(from, [{ id: to, type }]);
  };
  for (const s of spouseRows) {
    if (!byId.has(s.person_id) || !byId.has(s.spouse_id)) continue;
    const type = (s.status === "divorced" ? "divorced" : "married") as RelationType;
    addSpouse(s.person_id, s.spouse_id, type);
    addSpouse(s.spouse_id, s.person_id, type);
  }

  return people.map((p): TreeNode => {
    const parents: Relation[] = [p.father_id, p.mother_id]
      .filter((id): id is string => !!id && byId.has(id))
      .map((id) => ({ id, type: "blood" as RelationType }));

    const children: Relation[] = (childrenOf.get(p.id) ?? []).map((c) => ({
      id: c.id,
      type: "blood" as RelationType,
    }));

    const siblings: Relation[] = [];
    const seenSiblings = new Set<string>();
    for (const parentId of [p.father_id, p.mother_id]) {
      if (!parentId) continue;
      for (const sib of childrenOf.get(parentId) ?? []) {
        if (sib.id === p.id || seenSiblings.has(sib.id)) continue;
        seenSiblings.add(sib.id);
        const fullSiblings =
          !!p.father_id &&
          !!p.mother_id &&
          sib.father_id === p.father_id &&
          sib.mother_id === p.mother_id;
        siblings.push({
          id: sib.id,
          type: (fullSiblings ? "blood" : "half") as RelationType,
        });
      }
    }

    return {
      id: p.id,
      gender: (p.gender === "female" ? "female" : "male") as Gender,
      parents,
      children,
      siblings,
      spouses: spousesOf.get(p.id) ?? [],
    };
  });
}

/** Picks a sensible default root: the eldest known ancestor (no parents on record). */
export function pickDefaultRootId(people: readonly PersonRow[]): string | null {
  if (people.length === 0) return null;
  const ancestors = people.filter((p) => !p.father_id && !p.mother_id);
  const pool = ancestors.length > 0 ? ancestors : people;
  const withBirthYear = pool.filter((p) => p.birth_year != null);
  if (withBirthYear.length > 0) {
    return withBirthYear.reduce((oldest, p) =>
      (p.birth_year as number) < (oldest.birth_year as number) ? p : oldest
    ).id;
  }
  return pool[0].id;
}
