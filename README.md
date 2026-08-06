# «Поэзия звука» — muzpoetry.ru

Marketing site for the vocal-and-acoustic music workshop «Поэзия звука» in Kazan. Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui, statically exported. Available in Russian (`/ru`) and Tatar (`/tt`) via `next-intl`.

## Stack

- **Next.js 16** (App Router), fully static via `output: "export"` — no server/backend required.
- **Tailwind CSS v4** + **shadcn/ui** (Base UI primitives) for components.
- **next-intl** for i18n — Russian and Tatar, routed as `/ru/...` and `/tt/...`. No middleware (not supported with static export); locale is resolved from the URL segment via `generateStaticParams`. The root `/` redirects to `/ru/`.
- Trial-booking form POSTs to a placeholder endpoint (Formspree-style) — swap before launch, see below.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 — it redirects to http://localhost:3000/ru/. Switch to Tatar via the language switcher in the header, or visit `/tt/` directly.

## Build

```bash
npm run build
```

Produces a fully static site in `./out/` (both `out/ru/...` and `out/tt/...`), deployable to any static host.

## Content — where to edit

Everything editable lives outside component code:

| What | File |
|---|---|
| UI chrome (nav, buttons, labels, form copy, validation messages) | `messages/ru.json`, `messages/tt.json` |
| Mission text, values, history | `src/content/values.ts` |
| Teachers | `src/content/teachers.ts` |
| Instrument/vocal directions | `src/content/directions.ts` |
| Cultural club offerings | `src/content/club.ts` |
| Pricing (single visits, subscriptions) | `src/content/pricing.ts` |
| Events / afisha | `src/content/events.ts` |
| Contacts, socials, map, trial-form endpoint | `src/content/site.ts` |

Content files export `Record<"ru" | "tt", T>` dictionaries — add/edit both locales together.

> **Tatar translations** were produced by AI and should be proofread by a native speaker before the site goes live, especially the marketing copy (mission, history, teacher quotes).

## Before launch — things to swap

1. **Trial-form endpoint** — `src/content/site.ts` → `trialFormEndpoint` is a Formspree-style placeholder (`YOUR_FORM_ID`). Point it at a real form handler.
2. **Photos** — replace the placeholder SVGs in `public/images/` (see filenames below) with real photography, keeping the same filenames or updating references in `src/content/*.ts`.
3. **Yandex Map** — `siteConfig.yandexMapEmbedSrc` in `src/content/site.ts` is a generic embed for the address; verify the exact pin in [Яндекс.Карты](https://yandex.ru/map-constructor/) and swap the iframe `src`.
4. **Telegram / Instagram links** — placeholders in `src/content/site.ts`.
5. **Prices** — every `— ₽` placeholder in `src/content/pricing.ts`.

### Placeholder images to replace

All in `public/images/`, generated as labeled SVG placeholders so the layout can be reviewed before real photos arrive:

`hero-studio`, `about-atelier`, `history-quartirnik`, `teacher-diana`, `teacher-placeholder-1`, `teacher-placeholder-2`, `direction-piano`, `direction-guitar`, `direction-ukulele`, `direction-vocal-pop`, `direction-vocal-academic`, `club-lecture`, `club-cinema`, `event-concert`, `event-kvartirnik`, `event-lecture`, `event-cinema`, `og-cover`.

## Deploying to Cloudflare Pages

The site is configured for **`https://muzpoetry.ru`** (no `basePath`). Cloudflare Pages project: `muz-poetry`.

Production deploys automatically when you push to `main` (GitHub connected in Cloudflare). Build command: `npm ci && npm run build`, output directory: `out`.

Custom domains: `muzpoetry.ru` and `www.muzpoetry.ru` (managed in Workers & Pages → `muz-poetry` → Custom domains).

Optional manual deploy from CI: workflow_dispatch on `.github/workflows/deploy.yml` (needs `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` secrets).

Local preview: `npm run build && npm run serve`.

## Deploying elsewhere (Netlify, Vercel, any static host)

`npm run build` outputs a plain static site in `./out/` — point any static host at that directory. No environment variables or server runtime needed.

To publish under a subpath (e.g. GitHub project Pages at `/muz_poetry`), build with `NEXT_PUBLIC_BASE_PATH=/muz_poetry`.
