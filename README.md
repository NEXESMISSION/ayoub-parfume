# ORIX — perfume builder (Next.js)

Custom perfume ordering: bottle, ingredient, quantity, phone confirmation. Admin dashboard for orders and catalog.

## Local development

```bash
npm install
npm run dev
```

Copy `.env.local.example` to `.env.local` and set Supabase (and optional WhatsApp) variables.

## Deploy on Vercel

1. Import the Git repository.
2. **Root Directory** must be the app root (where `package.json` lives). Leave it **empty** or **`.`** — do **not** set a subfolder unless the repo is a monorepo.
3. **Framework preset:** Next.js (auto-detected).
4. **Environment variables** (Production + Preview):  
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and optionally `NEXT_PUBLIC_WHATSAPP_NUMBER`.
5. Redeploy after changing env vars.

### Verify deployment

- Open `/api/health` — should return `{"ok":true}`.
- Open `/` — landing page.
- `/favicon.ico` — favicon (served from `public/`).

### If you see `404 NOT_FOUND` on Vercel

- Confirm the latest deployment **build** succeeded (check the Vercel build log).
- Fix **Root Directory** (wrong folder = no Next app = broken site).
- Confirm you are opening the URL shown for that deployment (production or preview), not an old deleted deployment.

## License

Private / project use.
