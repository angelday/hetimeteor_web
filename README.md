# hetimeteor_web

Heti Meteor podcast site. Ghost (headless CMS) → Astro (static build) → GitHub Pages.

## How it works

Ghost runs on a Mac Mini at port 2369, reachable over the private Tailscale network (no Funnel, not publicly exposed). At build time, Astro fetches all posts, pages, and settings from Ghost's Content API, and a custom Astro integration downloads all Ghost-hosted images into `public/content/`. The result is a fully self-contained static site pushed to the `gh-pages` branch, served at hetimeteor.hu via GitHub Pages.

Nothing from the Mac Mini is accessed at runtime — the live site has no dependency on Ghost or Tailscale.

## Prerequisites

- Node 20+
- Ghost running on the Mac Mini
- Tailscale connected (private network access to the Mac Mini — Funnel not needed)
- `.env` file in this directory:
  ```
  GHOST_CONTENT_API_KEY=<your content api key>
  GHOST_INTERNAL_URL=http://jozsimini.tail24dc69.ts.net:2369
  PUBLIC_SITE_URL=https://hetimeteor.hu
  ```
- `.env.local` for dev overrides:
  ```
  PUBLIC_SITE_URL=http://localhost:4321
  ```

## Development

```
npm run dev
```

Opens at `http://localhost:4321/`. Ghost must be reachable via Tailscale. Content changes in Ghost require restarting the dev server. Images are not downloaded during dev — run a full build first if you need new images locally.

## Testing with a full build

```
npm run build && npx astro preview --host 0.0.0.0
```

Opens at `http://localhost:4321/`. To test on your phone, open `http://<your-mac-ip>:4321/` (both devices on the same Wi-Fi). Find your Mac's IP with `ipconfig getifaddr en0`.

Force a clean rebuild if anything seems stale: `rm -rf node_modules/.astro dist public/content`.

## Deploy

```
./deploy.sh
```

Builds the site (including image downloads), then force-pushes the output to the `gh-pages` branch. Tailscale must be connected so Ghost is reachable during the build.

## Audio URL field

The Wave theme stores episode audio URLs in Ghost's **Facebook card** fields. Most episodes use the **Facebook Description** (`og_description`) field; some older ones use **Facebook Title** (`og_title`). Both are checked — either one will show the player.

## Project structure

```
src/
  pages/        — index.astro (episode feed), [slug].astro (post + page routes)
  components/   — PostCard.astro (feed card), Player.astro (audio player)
  layouts/      — Layout.astro (site shell: header, footer, meta)
  lib/          — ghost.js (API client), settings.js (site settings), utils.js
public/
  assets/
    built/      — Wave theme CSS and JS (screen.css, main.min.js)
  content/      — Ghost images downloaded at build time (gitignored)
  favicon.png
  CNAME
```
