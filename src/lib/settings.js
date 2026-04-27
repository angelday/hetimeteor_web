import api from './ghost.js';
import { fixUrl } from './utils.js';

let cached;

export async function getSettings() {
  if (cached) return cached;

  const s = await api.settings.browse();

  cached = {
    title:       s.title,
    description: s.description,
    logo:        fixUrl(s.logo),
    accentColor: s.accent_color,
    locale:      s.locale ?? 'hu',
    navigation:  s.navigation ?? [],
  };

  return cached;
}
