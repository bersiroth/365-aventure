/**
 * Utilitaire son — Web Audio API + fichier .wav.
 * La préférence est lue depuis settings.js.
 */

import { getSetting } from './settings';

const _slashAudio = new Audio('/slashkut.wav');
_slashAudio.preload = 'auto';

/** Validation d'une case — son d'épée */
export function playValidate() {
  if (!getSetting('sound')) return;
  try {
    _slashAudio.currentTime = 0;
    _slashAudio.play();
  } catch {}
}

/** Dé-validation d'une case — bruit sourd synthétique */
export function playDevalidate() {
  if (!getSetting('sound')) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, t);
    osc.frequency.exponentialRampToValueAtTime(160, t + 0.12);
    gain.gain.setValueAtTime(0.14, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
    osc.start(t);
    osc.stop(t + 0.14);
    osc.onended = () => ctx.close();
  } catch {}
}
