# Concert Cost Tracker

Track concert spending, fun ratings, and best-value shows.

## Setup

1. Copy `.env.example` to `.env.local` (or keep your existing `.env.local`).
2. In Supabase, open the **ConcertCosts** project → **Connect** or **Settings → API Keys**.
3. Paste the Project URL and publishable key (or legacy anon/public key) into:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-or-anon-key-here
```

Do **not** use a service role / secret key.

4. Install and run:

```bash
npm install
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000).

After editing `.env.local`, stop the server (Ctrl+C) and run `npm run dev` again.
