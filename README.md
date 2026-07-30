# Family Tree

A read-only family tree site: shows each person's photo (or a placeholder if
none is set) and name, laid out as an interactive, pan/zoomable tree — click
anyone to re-center the tree on them, scroll/pinch to zoom. UI is in Uzbek
(Latin).

Data lives in Supabase (Postgres + Storage). The site only ever reads it —
adding/editing people and uploading photos happens directly in the Supabase
dashboard, not on the site. See [SETUP.md](SETUP.md) for the full walkthrough
(one-time project setup, how to add a person, how to upload a photo, how to
deploy to Vercel).

## Local development

```bash
npm install
npm run dev
```

Requires a `.env.local` with your Supabase project's URL and anon key — copy
`.env.local.example` and fill it in (see [SETUP.md](SETUP.md)).

## Stack

- [Next.js](https://nextjs.org) (App Router) + Tailwind CSS
- [Supabase](https://supabase.com) — Postgres (`people`, `spouses` tables) + Storage (photos)
- [`relatives-tree`](https://github.com/SanichKotikov/relatives-tree) / [`react-family-tree`](https://github.com/SanichKotikov/react-family-tree) for the tree layout
- [`react-zoom-pan-pinch`](https://github.com/prc5/react-zoom-pan-pinch) for pan/zoom
- Deployed on [Vercel](https://vercel.com)
