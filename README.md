# hetimeteor_web

Heti Meteor podcast site. Ghost (local CMS) → Astro (static build) → GitHub Pages.

## How it works

Ghost runs as a headless CMS on a Mac Mini at port 2369, accessible via Tailscale Funnel. Astro fetches posts and settings from Ghost's Content API at build time and outputs a fully static site. The built files are pushed to a `gh-pages` branch which GitHub Pages serves at hetimeteor.hu.

## Prerequisites

- Node 20+
- Ghost running on the Mac Mini, reachable via Tailscale Funnel
- `.env` file in this directory with:
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

Opens at `http://localhost:4321/`. Ghost must be reachable via Tailscale Funnel for the site to build. Content changes in Ghost require restarting the dev server.

## Testing with a full build

```
npx astro build && npx astro preview --host 0.0.0.0
```

Opens at `http://localhost:4321/`. To test on your phone, open `http://<your-mac-ip>:4321/` (both devices on the same Wi-Fi). Find your Mac's IP with `ipconfig getifaddr en0`.

Force a clean rebuild if anything seems stale: `rm -rf node_modules/.astro dist`.

## Deploy

```
./deploy.sh
```

Builds the site, then force-pushes the output to the `gh-pages` branch. Tailscale Funnel must be running so Ghost is reachable during the build.

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
  favicon.png
  CNAME
```
