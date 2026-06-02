# app/ — Numrica

## Calculators

Each calculator is a self-contained route: `app/<slug>/page.tsx` + `components/Calculator.tsx` (the shared base).

- Route slug = kebab-case, English: `loan-simulator`, `mortgage-calculator`, `compound-interest`
- Each `page.tsx` exports `metadata` with English title/description optimized for search
- Add every new route to `app/sitemap.ts`

## No auth, no DB

All content is static/client-side. Never add Supabase, cookies, or server-side sessions.
Server Components only for metadata — everything interactive goes in Client Components.

## AdSense

- Unit placement: after the calculator result block, never before the H1 or above the fold
- Never block rendering — load ads async
- Keep Core Web Vitals green: no layout shift from ad units

## Components

- `app/components/Calculator.tsx` — shared layout wrapper, use for all new calculators
- `app/components/ToolNav.tsx` — top nav with links to all tools
- `app/components/EmbedButton.tsx` — embed/share button, include on all calculators
- Keep components stateless where possible; lift state to the page if needed

## Conventions

- All user-facing text in English (global AdSense audience)
- Format: US number formatting (comma thousands, dot decimal)
- No emojis in UI
- Tailwind only for styling — no inline styles
