// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

const { GHOST_API_URL, GHOST_INTERNAL_URL, GHOST_CONTENT_API_KEY } = loadEnv(
  process.env.NODE_ENV ?? '',
  process.cwd(),
  ''
);

function ghostAssets() {
  return {
    name: 'ghost-assets',
    hooks: {
      'astro:build:start': async () => {
        console.log('Downloading Ghost-hosted images...');

        const base = `${GHOST_API_URL}/ghost/api/content`;
        const key = GHOST_CONTENT_API_KEY;

        const [postsRes, pagesRes, settingsRes] = await Promise.all([
          fetch(`${base}/posts/?key=${key}&limit=all&include=authors`),
          fetch(`${base}/pages/?key=${key}&limit=all&include=authors`),
          fetch(`${base}/settings/?key=${key}`),
        ]);

        const { posts } = await postsRes.json();
        const { pages } = await pagesRes.json();
        const { settings } = await settingsRes.json();

        function isGhostImage(url) {
          return url && (
            url.startsWith(GHOST_INTERNAL_URL) ||
            url.startsWith(GHOST_API_URL + '/content/')
          );
        }

        function destPath(url) {
          const normalized = url
            .replace(GHOST_INTERNAL_URL, 'http://x')
            .replace(GHOST_API_URL, 'http://x');
          return path.join(process.cwd(), 'public', new URL(normalized).pathname);
        }

        function toFetchUrl(url) {
          return url.startsWith(GHOST_INTERNAL_URL)
            ? url.replace(GHOST_INTERNAL_URL, GHOST_API_URL)
            : url;
        }

        function extractImgSrcs(html) {
          return [...(html?.matchAll(/src="([^"]+)"/g) ?? [])].map(m => m[1]);
        }

        const urls = new Set();

        for (const entry of [...posts, ...pages]) {
          if (isGhostImage(entry.feature_image)) urls.add(entry.feature_image);
          for (const src of extractImgSrcs(entry.html)) {
            if (isGhostImage(src)) urls.add(src);
          }
          for (const author of entry.authors ?? []) {
            if (isGhostImage(author.profile_image)) urls.add(author.profile_image);
          }
        }

        if (isGhostImage(settings.logo)) urls.add(settings.logo);
        if (isGhostImage(settings.cover_image)) urls.add(settings.cover_image);

        let downloaded = 0;
        for (const url of urls) {
          const dest = destPath(url);
          if (fs.existsSync(dest)) continue;
          fs.mkdirSync(path.dirname(dest), { recursive: true });
          const fetchUrl = toFetchUrl(url);
          const res = await fetch(fetchUrl);
          if (!res.ok) { console.warn(`  SKIP ${fetchUrl} (${res.status})`); continue; }
          fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
          console.log(`  ↓ ${path.relative(process.cwd(), dest)}`);
          downloaded++;
        }

        console.log(`Downloaded ${downloaded} new images (${urls.size} total).`);
      },
    },
  };
}

export default defineConfig({
  integrations: [ghostAssets()],
});
