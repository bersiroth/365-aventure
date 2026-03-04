/**
 * Paramètres utilisateur — persistés en localStorage.
 * Toutes les options sont activées par défaut.
 */

const KEYS = {
  sound:      'donjon_sound',
  vibration:  'donjon_vibration',
  animations: 'donjon_animations',
};

export function getSetting(key) {
  return localStorage.getItem(KEYS[key]) !== 'false';
}

export function setSetting(key, enabled) {
  localStorage.setItem(KEYS[key], enabled ? 'true' : 'false');
}
