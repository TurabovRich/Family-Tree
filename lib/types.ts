export type PersonRow = {
  id: string;
  full_name: string;
  gender: "male" | "female" | null;
  birth_year: number | null;
  death_year: number | null;
  photo_url: string | null;
  notes: string | null;
  needs_review: boolean;
  father_id: string | null;
  mother_id: string | null;
};

export type SpouseRow = {
  person_id: string;
  spouse_id: string;
  status: "married" | "divorced";
};
