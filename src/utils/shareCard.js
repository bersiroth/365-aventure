const W = 820;
const H = 460;

const GOLD   = '#d4af37';
const DARK   = '#1a0f0a';
const STONE  = '#2d2318';
const GRAY   = '#9ca3af';
const GRAY2  = '#4b5563';

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawStat(ctx, x, y, value, label, color) {
  ctx.font = 'bold 38px Cinzel, serif';
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.fillText(String(value), x, y);

  ctx.font = '11px Cinzel, serif';
  ctx.fillStyle = GRAY2;
  ctx.fillText(label.toUpperCase(), x, y + 18);
}

export async function downloadProgressImage({ score, pseudo, showUndead, showMana }) {
  // Wait for fonts to be ready (Cinzel loaded from Google Fonts)
  await document.fonts.ready;

  const canvas = document.createElement('canvas');
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // --- Background ---
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#1c1409');
  bg.addColorStop(1, '#0d0803');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Outer gold border
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 2.5;
  roundRect(ctx, 12, 12, W - 24, H - 24, 10);
  ctx.stroke();

  // Inner faint border
  ctx.strokeStyle = '#d4af3730';
  ctx.lineWidth = 1;
  roundRect(ctx, 20, 20, W - 40, H - 40, 7);
  ctx.stroke();

  // Corner ornaments
  const corners = [[30, 30], [W - 30, 30], [30, H - 30], [W - 30, H - 30]];
  ctx.fillStyle = GOLD;
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fill();
  });

  // --- Title ---
  ctx.fillStyle = GOLD;
  ctx.font = 'bold 28px Cinzel, serif';
  ctx.textAlign = 'center';
  ctx.shadowColor = '#d4af3760';
  ctx.shadowBlur = 12;
  ctx.fillText('365 Aventures : Le Donjon', W / 2, 68);
  ctx.shadowBlur = 0;

  // Subtitle
  ctx.font = '15px Cinzel, serif';
  ctx.fillStyle = '#e5e7eb';
  ctx.fillText(`Progression de ${pseudo}`, W / 2, 96);

  // --- Score total ---
  ctx.font = 'bold 72px Cinzel, serif';
  ctx.fillStyle = GOLD;
  ctx.shadowColor = '#d4af3750';
  ctx.shadowBlur = 20;
  ctx.fillText(String(score.totalScore), W / 2, 190);
  ctx.shadowBlur = 0;

  ctx.font = '13px Cinzel, serif';
  ctx.fillStyle = GRAY;
  ctx.fillText('SCORE TOTAL', W / 2, 215);

  // --- Divider ---
  const divGrad = ctx.createLinearGradient(40, 0, W - 40, 0);
  divGrad.addColorStop(0, 'transparent');
  divGrad.addColorStop(0.3, '#d4af3760');
  divGrad.addColorStop(0.7, '#d4af3760');
  divGrad.addColorStop(1, 'transparent');
  ctx.strokeStyle = divGrad;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(40, 234);
  ctx.lineTo(W - 40, 234);
  ctx.stroke();

  // --- Stats ---
  const stats = [
    { label: 'Monstres',      value: score.monstersDefeated,  color: GRAY },
    ...(showUndead ? [{ label: 'Morts-Vivants', value: score.undeadDefeated, color: '#facc15' }] : []),
    { label: 'Pièges',        value: score.trapsDefeated,     color: '#f87171' },
    { label: 'Boss',          value: score.bossesDefeated,    color: '#fb923c' },
    { label: 'Ailes',         value: score.completeWings,     color: '#4ade80' },
    ...(showMana ? [{ label: 'Potions',  value: score.manaPotionsEarned, color: '#60a5fa' }] : []),
  ];

  const total = stats.length;
  const cols  = total <= 5 ? total : Math.ceil(total / 2);
  const rows  = Math.ceil(total / cols);
  const cellW = (W - 80) / cols;
  const startY = rows === 1 ? 310 : 285;
  const rowH   = 90;

  stats.forEach(({ label, value, color }, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    // Center last row if it's shorter
    const rowLen  = row === rows - 1 ? total - row * cols : cols;
    const offsetX = row === rows - 1 ? (cols - rowLen) * cellW / 2 : 0;
    const x = 40 + offsetX + col * cellW + cellW / 2;
    const y = startY + row * rowH;
    drawStat(ctx, x, y, value, label, color);
  });

  // --- Date ---
  const date = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  ctx.font = '12px Cinzel, serif';
  ctx.fillStyle = GRAY;
  ctx.textAlign = 'center';
  ctx.fillText(date, W / 2, H - 22);

  // --- Download ---
  const link = document.createElement('a');
  const safePseudo = pseudo.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  link.download = `365-aventures-${safePseudo}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
