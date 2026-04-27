export function fixUrl(url) {
  if (!url) return url;
  return url.replace(
    import.meta.env.GHOST_INTERNAL_URL,
    import.meta.env.GHOST_API_URL
  );
}

export function externalLinksNewTab(html) {
  if (!html) return html;
  return html.replace(
    /<a ([^>]*href="https?:\/\/[^"]*"[^>]*)>/g,
    '<a $1 target="_blank" rel="noopener noreferrer">'
  );
}

export function stripRefParams(html) {
  if (!html) return html;
  return html
    .replace(/\?ref=[^"&]*/g, '')
    .replace(/&ref=[^"&]*/g, '');
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('hu-HU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
