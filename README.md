# Ascentra Homepage

Premium single-page homepage built with Next.js (App Router), TypeScript, Tailwind, and Framer Motion.

## Local development

- Install: `npm install`
- Dev server: `npm run dev`
- Production build (static export): `npm run build`

After build, static files are generated in `out/`.

## Cloudflare Pages (important)

Use these project settings:

- Framework preset: `None` (or Next.js with static output)
- Build command: `npm run build`
- Build output directory: `out`

If output directory is not `out`, Cloudflare can deploy but still return 404 on the root URL.
