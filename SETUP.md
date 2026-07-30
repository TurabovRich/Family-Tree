# Family Tree — Setup

The site itself is **read-only**: it only ever runs `SELECT` queries against Supabase.
Adding, editing, and deleting people (and uploading photos) all happens directly
in the Supabase dashboard, not on the website. This keeps the public site free
of any login/write attack surface.

## 1. One-time project setup

1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** in the Supabase dashboard, paste in the contents of
   [`supabase/schema.sql`](supabase/schema.sql), and run it. This creates the
   `people` and `spouses` tables, read-only access policies, and the `photos`
   storage bucket.
3. (Optional) Also run [`supabase/seed.sql`](supabase/seed.sql) to load a few
   placeholder people so you can see the site working before entering real
   data. Delete these sample rows later in the Table Editor.
4. Go to **Project Settings -> API** and copy:
   - **Project URL**
   - **anon / public key**
5. Copy `.env.local.example` to `.env.local` and paste those two values in.
6. Install dependencies and run locally:
   ```
   npm install
   npm run dev
   ```
   Open http://localhost:3000 — you should see the tree.

## 2. Adding a person (ongoing, whenever the chart grows)

In the Supabase dashboard: **Table Editor -> people -> Insert row**.

| Column | What to put |
|---|---|
| `full_name` | Name as written on the chart |
| `gender` | `male` or `female` (affects left/right placement next to a spouse) |
| `birth_year` / `death_year` | Leave blank if unknown |
| `father_id` / `mother_id` | The `id` (UUID) of that person's row, if already entered — leave blank if unknown/not yet entered |
| `photo_url` | Leave blank for now — see photo upload below |
| `needs_review` | Check this if you're unsure about the name/spelling/relation, so it's easy to find later |
| `notes` | Anything you want to remember about this entry |

To link a married couple, add one row to the **spouses** table: `person_id`,
`spouse_id` (the two people's UUIDs), and `status` (`married` or `divorced`).
You only need one row per couple — the site shows it for both people.

Tip: sort/filter the `people` table by `needs_review = true` to find entries
that still need double-checking.

## 3. Uploading a photo

1. **Storage -> photos -> Upload file**. Upload the person's photo.
2. Click the uploaded file -> **Get URL** (make sure it's the *public* URL).
3. Paste that URL into the person's `photo_url` field in the `people` table.

If `photo_url` is left blank, the site automatically shows a "no photo"
placeholder — nothing else to do.

## 4. Deploying (Vercel)

1. Push this project to a GitHub repository (see note below about git).
2. Go to [vercel.com](https://vercel.com) -> **New Project** -> import that repo.
3. When prompted for environment variables, add the same two from step 1.4:
   `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Deploy. Every future `git push` to the main branch redeploys automatically —
   you will **not** need to redeploy when adding people/photos, since that data
   comes live from Supabase on every page load.

## Note on the handwritten chart photo

The handwriting in the photo you shared is small, photographed at an angle,
and partly blurred, so I couldn't reliably OCR the real names into the
database — guessing wrong names into a family record felt worse than not
guessing at all. `seed.sql` only contains clearly-labeled fictional
placeholder people to prove the app works.

Two ways to get the real chart data in faster than typing ~100+ people by hand:
- Send clearer/straightened close-up photos of each section (one branch at a
  time), and I can transcribe those into `INSERT` statements for you to review.
- Or just enter people directly in the Table Editor as you go — the `id`
  column auto-generates, so you mainly need to fill in `full_name`, `gender`,
  and `father_id`/`mother_id` (copy-pasting the relevant UUID from a row
  already entered).
