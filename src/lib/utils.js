export function fixUrl(url) {
  if (!url) return url;
  return url.replace(
    import.meta.env.GHOST_INTERNAL_URL,
    import.meta.env.GHOST_API_URL
  );
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('hu-HU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
