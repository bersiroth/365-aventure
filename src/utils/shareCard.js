const W = 900;
const H = 520;

const GOLD  = '#d4af37';
const DARK  = '#1a0f0a';
const GRAY  = '#9ca3af';
const GRAY2 = '#6b7280';
const LIGHT = '#e5e7eb';

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

function drawBar(ctx, x, y, w, h, ratio, colorFill) {
  ctx.fillStyle = '#ffffff18';
  roundRect(ctx, x, y, w, h, h / 2);
  ctx.fill();
  if (ratio > 0) {
    ctx.fillStyle = colorFill;
    roundRect(ctx, x, y, Math.max(w * ratio, h), h, h / 2);
    ctx.fill();
  }
}

function drawStat(ctx, x, y, value, label, color) {
  ctx.font = 'bold 28px Cinzel, serif';
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.fillText(String(value), x, y);

  ctx.font = '10px Cinzel, serif';
  ctx.fillStyle = GRAY2;
  ctx.fillText(label.toUpperCase(), x, y + 16);
}

function makeDivGrad(ctx) {
  const g = ctx.createLinearGradient(40, 0, W - 40, 0);
  g.addColorStop(0, 'transparent');
  g.addColorStop(0.2, '#d4af3760');
  g.addColorStop(0.8, '#d4af3760');
  g.addColorStop(1, 'transparent');
  return g;
}

export async function downloadProgressImage({
  score, pseudo, levelInfo, completionRate, unlockedCount, totalCount,
  showUndead, showMana, showElite, showDouble,
  showInvisible, showNecromancer, showInfluenced, showShaman, showFinalBoss,
}) {
  await document.fonts.ready;

  const canvas = document.createElement('canvas');
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // ─── Fond ────────────────────────────────────────────────────────────────
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#1c1409');
  bg.addColorStop(1, '#0d0803');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Bordure dorée extérieure
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 2.5;
  roundRect(ctx, 12, 12, W - 24, H - 24, 10);
  ctx.stroke();

  // Bordure intérieure fine
  ctx.strokeStyle = '#d4af3728';
  ctx.lineWidth = 1;
  roundRect(ctx, 20, 20, W - 40, H - 40, 7);
  ctx.stroke();

  // Ornements coins
  ctx.fillStyle = GOLD;
  [[30, 30], [W - 30, 30], [30, H - 30], [W - 30, H - 30]].forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fill();
  });

  // ─── En-tête ─────────────────────────────────────────────────────────────
  ctx.fillStyle = GOLD;
  ctx.font = 'bold 24px Cinzel, serif';
  ctx.textAlign = 'left';
  ctx.shadowColor = '#d4af3760';
  ctx.shadowBlur = 10;
  ctx.fillText('365 Aventures : Le Donjon', 40, 60);
  ctx.shadowBlur = 0;

  ctx.font = '13px Cinzel, serif';
  ctx.fillStyle = LIGHT;
  ctx.fillText(`Aventurier · ${pseudo}`, 40, 86);

  // Badge niveau (coin supérieur droit)
  if (levelInfo) {
    const bx = W - 190;
    const by = 30;
    const bw = 145;
    const bh = 68;

    const badgeGrad = ctx.createLinearGradient(bx, by, bx + bw, by + bh);
    badgeGrad.addColorStop(0, '#2a1a05');
    badgeGrad.addColorStop(1, '#130d02');
    ctx.fillStyle = badgeGrad;
    roundRect(ctx, bx, by, bw, bh, 8);
    ctx.fill();
    ctx.strokeStyle = '#d4af3770';
    ctx.lineWidth = 1.5;
    roundRect(ctx, bx, by, bw, bh, 8);
    ctx.stroke();

    ctx.font = 'bold 18px Cinzel, serif';
    ctx.fillStyle = GOLD;
    ctx.textAlign = 'center';
    ctx.fillText(`Niv. ${levelInfo.level}`, bx + bw / 2, by + 28);

    ctx.font = '12px Cinzel, serif';
    ctx.fillStyle = LIGHT;
    ctx.fillText(`● ${levelInfo.title}`, bx + bw / 2, by + 50);
  }

  // Séparateur 1
  ctx.strokeStyle = makeDivGrad(ctx);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(40, 108);
  ctx.lineTo(W - 40, 108);
  ctx.stroke();

  // ─── Zone centrale : score + barres ─────────────────────────────────────
  // Score total (colonne gauche)
  ctx.font = 'bold 52px Cinzel, serif';
  ctx.fillStyle = GOLD;
  ctx.textAlign = 'center';
  ctx.shadowColor = '#d4af3750';
  ctx.shadowBlur = 16;
  ctx.fillText(String(score.totalScore), 130, 178);
  ctx.shadowBlur = 0;

  ctx.font = '11px Cinzel, serif';
  ctx.fillStyle = GRAY;
  ctx.textAlign = 'center';
  ctx.fillText('SCORE TOTAL', 130, 200);

  // Séparateur vertical
  ctx.strokeStyle = '#d4af3730';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(228, 118);
  ctx.lineTo(228, 238);
  ctx.stroke();

  // Barres (colonne droite)
  const barX = 248;
  const barW = W - barX - 40;
  const barH = 13;

  // Barre complétion
  const compRate = Math.min(100, completionRate ?? 0);
  ctx.font = '11px Cinzel, serif';
  ctx.fillStyle = GRAY;
  ctx.textAlign = 'left';
  ctx.fillText('COMPLÉTION', barX, 136);
  ctx.font = 'bold 14px Cinzel, serif';
  ctx.fillStyle = '#4ade80';
  ctx.textAlign = 'right';
  ctx.fillText(`${compRate}%`, barX + barW, 136);
  drawBar(ctx, barX, 141, barW, barH, compRate / 100, '#4ade80');

  // Barre XP
  const xpRatio = levelInfo
    ? (levelInfo.isMaxLevel ? 1 : Math.min(1, levelInfo.xpIntoLevel / levelInfo.xpForLevel))
    : 0;
  const xpLabel = levelInfo
    ? (levelInfo.isMaxLevel ? 'Max' : `${levelInfo.xpIntoLevel} / ${levelInfo.xpForLevel} XP`)
    : '0 XP';
  ctx.font = '11px Cinzel, serif';
  ctx.fillStyle = GRAY;
  ctx.textAlign = 'left';
  ctx.fillText('XP', barX, 174);
  ctx.font = '11px Cinzel, serif';
  ctx.fillStyle = GOLD;
  ctx.textAlign = 'right';
  ctx.fillText(xpLabel, barX + barW, 174);
  drawBar(ctx, barX, 179, barW, barH, xpRatio, GOLD);

  // Barre trophées
  const trophRatio = totalCount > 0 ? (unlockedCount / totalCount) : 0;
  ctx.font = '11px Cinzel, serif';
  ctx.fillStyle = GRAY;
  ctx.textAlign = 'left';
  ctx.fillText(`${unlockedCount}/${totalCount} trophées`, barX, 213);
  ctx.fillStyle = '#c084fc';
  ctx.textAlign = 'right';
  ctx.fillText(`${Math.round(trophRatio * 100)}%`, barX + barW, 213);
  drawBar(ctx, barX, 218, barW, barH, trophRatio, '#c084fc');

  // Séparateur 2
  ctx.strokeStyle = makeDivGrad(ctx);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(40, 248);
  ctx.lineTo(W - 40, 248);
  ctx.stroke();

  // ─── Stats ───────────────────────────────────────────────────────────────
  const stats = [
    { label: 'Monstres',     value: score.monstersDefeated,          color: GRAY },
    { label: 'Boss',         value: score.bossesDefeated,            color: '#fb923c' },
    { label: 'Pièges',       value: score.trapsDefeated,             color: '#f87171' },
    { label: 'Ailes',        value: score.completeWings,             color: '#4ade80' },
    ...(showUndead      ? [{ label: 'Morts-Vivants', value: score.undeadDefeated,           color: '#facc15' }] : []),
    ...(showMana        ? [{ label: 'Potions',        value: score.manaPotionsEarned,        color: '#60a5fa' }] : []),
    ...(showElite       ? [{ label: 'Élites',         value: score.eliteDefeated,            color: '#a78bfa' }] : []),
    ...(showDouble      ? [{ label: 'Doubles',        value: score.doublesDefeated,          color: '#fb923c' }] : []),
    ...(showInvisible   ? [{ label: 'Invisibles',     value: score.invisiblesDefeated,       color: '#94a3b8' }] : []),
    ...(showNecromancer ? [{ label: 'Nécromanciens',  value: score.necromancersDefeated,     color: '#c084fc' }] : []),
    ...(showInfluenced  ? [{ label: 'Influencés',     value: score.influencedBossesDefeated, color: '#f472b6' }] : []),
    ...(showShaman      ? [{ label: 'Shamans',        value: score.shamansDefeated,          color: '#34d399' }] : []),
    ...(showFinalBoss   ? [{ label: 'Boss Final',     value: score.finalBossDefeated,        color: '#f59e0b' }] : []),
  ];

  const total = stats.length;
  const cols  = total <= 6 ? total : Math.ceil(total / 2);
  const rows  = Math.ceil(total / cols);
  const cellW = (W - 80) / cols;
  const startY = rows === 1 ? 378 : 305;
  const rowH   = 85;

  stats.forEach(({ label, value, color }, i) => {
    const col    = i % cols;
    const row    = Math.floor(i / cols);
    const rowLen = row === rows - 1 ? total - row * cols : cols;
    const offsetX = row === rows - 1 ? (cols - rowLen) * cellW / 2 : 0;
    const x = 40 + offsetX + col * cellW + cellW / 2;
    const y = startY + row * rowH;
    drawStat(ctx, x, y, value, label, color);
  });

  // ─── Date ────────────────────────────────────────────────────────────────
  const date = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  ctx.font = '12px Cinzel, serif';
  ctx.fillStyle = GRAY2;
  ctx.textAlign = 'right';
  ctx.fillText(date, W - 50, H - 40);

  // ─── Partage / Téléchargement ─────────────────────────────────────────────
  const safePseudo = pseudo.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  const filename = `365-aventures-${safePseudo}.png`;

  canvas.toBlob(async (blob) => {
    const file = new File([blob], filename, { type: 'image/png' });

    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          title: '365 Aventures : Le Donjon',
          text: `Ma progression dans le Donjon ! Score : ${score.totalScore} pts`,
          files: [file],
        });
        return;
      } catch {
        // Annulé ou non supporté → fallback
      }
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }, 'image/png');
}
