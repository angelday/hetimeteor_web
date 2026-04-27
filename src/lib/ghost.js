import GhostContentAPI from '@tryghost/content-api';

const api = new GhostContentAPI({
  url: import.meta.env.GHOST_API_URL,
  key: import.meta.env.GHOST_CONTENT_API_KEY,
  version: 'v5.0',
});

export default api;
