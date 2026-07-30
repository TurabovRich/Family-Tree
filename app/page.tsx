import { supabase } from "@/lib/supabase/client";
import { pickDefaultRootId } from "@/lib/buildTree";
import type { PersonRow, SpouseRow } from "@/lib/types";
import { HomePage } from "@/components/HomePage";

export const revalidate = 0;

async function loadData() {
  const [peopleRes, spousesRes] = await Promise.all([
    supabase.from("people").select("*"),
    supabase.from("spouses").select("*"),
  ]);

  if (peopleRes.error) throw peopleRes.error;
  if (spousesRes.error) throw spousesRes.error;

  return {
    people: (peopleRes.data ?? []) as PersonRow[],
    spouses: (spousesRes.data ?? []) as SpouseRow[],
  };
}

export default async function Page() {
  let data: { people: PersonRow[]; spouses: SpouseRow[] } | null = null;
  try {
    data = await loadData();
  } catch (err) {
    console.error("Failed to load family tree data:", err);
  }

  if (!data) {
    return (
      <HomePage people={[]} spouses={[]} defaultRootId={null} loadError />
    );
  }

  return (
    <HomePage
      people={data.people}
      spouses={data.spouses}
      defaultRootId={pickDefaultRootId(data.people)}
    />
  );
}
