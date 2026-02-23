import { useState } from 'react';
import { Shield, CheckCircle2, Lock, Swords, Wand2, ScrollText, X, Zap, Sparkles, Gem, Circle, Skull, FlaskConical, Flame, Ghost } from 'lucide-react';
import { MONTH_RULES } from '../data/monthConfigs';


/* Triangle sans point d'exclamation — fond blanc, trait rouge vif */
function TrapTriangle({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="#d1d5db" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <path d="M12 3 L22 21 L2 21 Z" />
    </svg>
  );
}

const DAY_HEADERS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

/**
 * Grille calendrier calquée sur le calendrier physique :
 * - 7 colonnes avec en-têtes des jours (Lundi → Dimanche)
 * - Cellules carrées avec numéro du jour en haut-gauche
 * - MONSTER : bouclier bleu avec valeur au centre
 * - TRAP    : triangle rouge avec valeur négative au centre
 * - BOSS    : couronne dorée avec valeur
 */
export function DungeonGrid({ monthData, onDayClick, isReadOnly, onManaToggle, onStaffToggle, onCapeToggle, onRingToggle }) {
  const [rulesOpen, setRulesOpen] = useState(false);
  const [valueTooHighOpen, setValueTooHighOpen] = useState(false);
  if (!monthData) return null;

  const monthRule = MONTH_RULES[monthData.index];

  // ── Liste plate de tous les jours avec leurs indices data ──
  const allDays = monthData.weeks.flatMap((week, weekIndex) =>
    week.days.map((day, dayIndex) => ({ ...day, weekIndex, dayIndex }))
  );

  // ── Décalage lundi-premier ──
  // dayOfWeekIndex : 0=Dimanche, 1=Lundi, …, 6=Samedi (Sun-first)
  // Formule Mon-first : (index - 1 + 7) % 7
  const firstDayIndex = allDays[0]?.dayOfWeekIndex ?? 1;
  const offset = (firstDayIndex - 1 + 7) % 7;

  // ── Boss Final (Décembre) — calcul dynamique de la valeur ──
  // La valeur 2048 est divisée par 2 pour chaque UNDEAD vaincu (si le NECRO du mois est aussi vaincu).
  // Le boss est verrouillé jusqu'à ce que tous les autres jours du mois soient validés.
  const finalBossData = (() => {
    const finalBossDay = allDays.find(d => d.isFinalBoss);
    if (!finalBossDay) return null;
    const necroDefeated = allDays.some(d => d.type === 'NECROMANCER' && d.completed);
    const effectiveUndeadCount = necroDefeated
      ? allDays.filter(d => d.type === 'UNDEAD' && d.completed).length
      : 0;
    const currentValue = Math.round(2048 / Math.pow(2, effectiveUndeadCount));
    const previousValue = effectiveUndeadCount > 0 ? currentValue * 2 : null;
    return { currentValue, previousValue };
  })();

  // ── Nécromancien du mois (pour le blocage des ailes) ──
  const monthHasNecromancer = allDays.some(d => d.type === 'NECROMANCER');
  const monthNecromancerDefeated = allDays.some(d => d.type === 'NECROMANCER' && d.completed);

  // ── Construction des lignes d'affichage (Mon→Sun, 7 colonnes) ──
  // Chaque ligne est calculée depuis la liste plate + offset,
  // indépendamment des semaines data (qui commencent le dimanche).
  const numRows = Math.ceil((offset + allDays.length) / 7);
  const displayRows = Array.from({ length: numRows }, (_, row) => {
    const cells = Array.from({ length: 7 }, (_, col) => {
      const dayIdx = row * 7 + col - offset;
      if (dayIdx >= 0 && dayIdx < allDays.length) {
        return { isEmpty: false, day: allDays[dayIdx] };
      }
      return { isEmpty: true };
    });
    // Aile conquise = tous les jours réels validés ET pas d'UNDEAD bloqué par le nécromancien
    const realDays = cells.filter(c => !c.isEmpty).map(c => c.day);
    const wingHasUndead = realDays.some(d => d.type === 'UNDEAD');
    const wingUndeadBlocked = wingHasUndead && monthHasNecromancer && !monthNecromancerDefeated;
    const isWingComplete = realDays.length === 7 && realDays.every(d => d.completed) && !wingUndeadBlocked;
    const undeadDefeatedInWing = realDays.some(d => d.type === 'UNDEAD' && d.completed);
    return { cells, isWingComplete, undeadDefeatedInWing };
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-1 sm:px-4 py-4 sm:py-6">
      {/* Titre du mois */}
      <div className="mb-3 sm:mb-6 text-center relative">
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-medieval font-bold text-dungeon-gold drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]">
          {monthData.name} 2026
        </h2>
        <div className="h-px w-32 sm:w-48 mx-auto mt-2 sm:mt-3 bg-gradient-to-r from-transparent via-dungeon-gold to-transparent" />
        {monthRule && (
          <button
            onClick={() => setRulesOpen(true)}
            className="absolute right-0 top-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-dungeon-gold/40 bg-dungeon-gold/10 text-dungeon-gold/80 hover:text-dungeon-gold hover:bg-dungeon-gold/20 hover:border-dungeon-gold/70 transition-colors font-medieval text-xs"
            title="Nouvelle règle ce mois"
          >
            <ScrollText size={13} />
            <span className="hidden sm:inline">Nouvelle règle</span>
          </button>
        )}
      </div>

      {/* Modal règles */}
      {rulesOpen && monthRule && (
        <RulesModal rule={monthRule} onClose={() => setRulesOpen(false)} />
      )}

      {/* Modal valeur trop haute */}
      {valueTooHighOpen && (
        <ValueTooHighModal onClose={() => setValueTooHighOpen(false)} />
      )}

      {/* Grille calendrier */}
      <div className="border border-dungeon-gold/40 sm:border-2 rounded-lg sm:rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.6)]">

        {/* Header potions de mana + bâton du sage */}
        <ManaHeader
          allDays={allDays}
          manaUsed={monthData.manaUsed}
          monthIndex={monthData.index}
          isReadOnly={isReadOnly}
          onManaToggle={onManaToggle}
          hasStaff={monthData.hasStaff}
          staffUsed={monthData.staffUsed}
          onStaffToggle={onStaffToggle}
          hasCape={monthData.hasCape}
          capeUsed={monthData.capeUsed}
          onCapeToggle={onCapeToggle}
          hasRing={monthData.hasRing}
          ringUsed={monthData.ringUsed}
          onRingToggle={onRingToggle}
        />

        {/* En-têtes jours de la semaine */}
        <div className="bg-dungeon-dark px-[2px] sm:px-[4px] pt-[2px] sm:pt-[4px]">
          <div className="grid grid-cols-7 gap-[2px] sm:gap-[4px]">
            {DAY_HEADERS.map((day, i) => (
              <div
                key={day}
                className={`
                  py-1 sm:py-2 md:py-3 text-center rounded-sm
                  ${i === 6 ? 'bg-yellow-950/80' : 'bg-dungeon-stone'}
                `}
              >
                <span className="text-dungeon-gold font-medieval font-bold text-[9px] sm:text-[10px] md:text-sm uppercase tracking-wide">
                  <span className="md:hidden">{day.substring(0, 2)}</span>
                  <span className="hidden md:inline">{day}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Lignes d'affichage Mon→Sun */}
        <div className="bg-dungeon-dark px-[2px] sm:px-[4px] pb-[2px] sm:pb-[4px] pt-[2px] sm:pt-[4px]">
          <div className="flex flex-col gap-[2px] sm:gap-[4px]">
            {displayRows.map((row, rowIndex) => (
              <div key={rowIndex} className="relative">
                <div className="grid grid-cols-7 gap-[2px] sm:gap-[4px]">
                  {row.cells.map((cell, colIndex) =>
                    cell.isEmpty ? (
                      <div
                        key={`empty-${rowIndex}-${colIndex}`}
                        className="aspect-square bg-dungeon-dark/60 rounded-sm"
                      />
                    ) : (
                      <DayCard
                        key={cell.day.id}
                        day={cell.day}
                        onClick={onDayClick}
                        isReadOnly={isReadOnly}
                        isWingComplete={row.isWingComplete}
                        undeadDefeatedInWing={row.undeadDefeatedInWing}
                        undeadNeedsNecro={monthHasNecromancer && !monthNecromancerDefeated}
                        finalBossData={cell.day.isFinalBoss ? finalBossData : null}
                        onValueTooHigh={() => setValueTooHighOpen(true)}
                      />
                    )
                  )}
                </div>

                {/* Bannière Aile Conquise */}
                {row.isWingComplete && <WingCompleteBanner />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Header potions de mana — affiché uniquement si le mois en possède
 */
function ManaHeader({ allDays, manaUsed, monthIndex, isReadOnly, onManaToggle, hasStaff, staffUsed, onStaffToggle, hasCape, capeUsed, onCapeToggle, hasRing, ringUsed, onRingToggle }) {
  const manaDays = allDays.filter(d => d.hasMana);
  const doubleUse = monthIndex >= 9; // À partir d'octobre : 2 utilisations par mois
  const numSlots = doubleUse ? 2 : 1;

  if (monthIndex < 1) {
    return <div className="bg-blue-950/30 border-b border-blue-400/20 min-h-[34px] sm:min-h-[40px]" />;
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 px-3 sm:px-4 py-2 bg-blue-950/30 border-b border-blue-400/20 min-h-[34px] sm:min-h-[40px]">

      {/* Potions de mana */}
      <span className="hidden sm:inline text-blue-300 font-medieval text-[10px] sm:text-xs uppercase tracking-wide whitespace-nowrap shrink-0">
        Potions de mana
      </span>
      <div className="flex flex-wrap gap-1 sm:gap-1.5">
        {manaDays.length === 0 ? (
          <span className="text-blue-900 text-xs">—</span>
        ) : manaDays.map((day) => {
          const earned = day.completed;
          const used = manaUsed?.[day.manaSlot] ?? false;
          const canClick = !isReadOnly && earned;
          return (
            <button
              key={day.manaSlot}
              disabled={!canClick}
              onClick={() => canClick && onManaToggle?.(monthIndex, day.manaSlot)}
              title={
                !earned
                  ? `Vaincre le monstre du jour ${day.day} pour obtenir cette potion`
                  : used
                  ? 'Potion utilisée — cliquer pour annuler'
                  : 'Potion disponible — cliquer pour marquer comme utilisée'
              }
              className={`
                w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center
                text-[10px] sm:text-xs font-bold transition-all
                ${!earned
                  ? 'border-gray-700 bg-transparent cursor-default'
                  : used
                  ? 'border-blue-600 bg-blue-900/50 text-blue-400 cursor-pointer hover:bg-blue-800/60'
                  : 'border-blue-400 bg-blue-500/70 text-white cursor-pointer hover:bg-blue-500/90 shadow-[0_0_6px_rgba(96,165,250,0.4)]'
                }
              `}
            >
              {used ? '×' : ''}
            </button>
          );
        })}
      </div>

      {/* Bâton du Sage */}
      {hasStaff && (
        <>
          <div className="hidden sm:block w-px self-stretch bg-dungeon-gold/20 mx-1" />
          <span className="hidden sm:inline text-dungeon-gold/70 font-medieval text-[10px] sm:text-xs uppercase tracking-wide whitespace-nowrap shrink-0">
            Bâton du Sage
          </span>
          <div className="flex gap-1">
            {Array.from({ length: numSlots }, (_, i) => {
              const used = staffUsed?.[i] ?? false;
              return (
                <button
                  key={i}
                  disabled={isReadOnly}
                  onClick={() => !isReadOnly && onStaffToggle?.(monthIndex, i)}
                  title={used ? 'Utilisé — cliquer pour annuler' : `Utiliser le Bâton du Sage${numSlots > 1 ? ` (${i + 1}e fois)` : ''}`}
                  className={`
                    flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg border-2 transition-all
                    ${isReadOnly ? 'cursor-default' : 'cursor-pointer'}
                    ${used
                      ? 'border-gray-700 bg-dungeon-dark/60 text-gray-600'
                      : 'border-dungeon-gold/70 bg-dungeon-gold/10 text-dungeon-gold hover:bg-dungeon-gold/20 shadow-[0_0_6px_rgba(212,175,55,0.3)]'
                    }
                  `}
                >
                  {used ? <X size={10} /> : <Wand2 size={14} />}
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Anneau Ancien */}
      {hasRing && (
        <>
          <div className="hidden sm:block w-px self-stretch bg-dungeon-gold/20 mx-1" />
          <span className="hidden sm:inline text-amber-400/70 font-medieval text-[10px] sm:text-xs uppercase tracking-wide whitespace-nowrap shrink-0">
            Anneau Ancien
          </span>
          <div className="flex gap-1">
            {Array.from({ length: numSlots }, (_, i) => {
              const used = ringUsed?.[i] ?? false;
              return (
                <button
                  key={i}
                  disabled={isReadOnly}
                  onClick={() => !isReadOnly && onRingToggle?.(monthIndex, i)}
                  title={used ? 'Utilisé — cliquer pour annuler' : `Utiliser l'Anneau Ancien${numSlots > 1 ? ` (${i + 1}e fois)` : ''}`}
                  className={`
                    flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg border-2 transition-all
                    ${isReadOnly ? 'cursor-default' : 'cursor-pointer'}
                    ${used
                      ? 'border-gray-700 bg-dungeon-dark/60 text-gray-600'
                      : 'border-amber-400/70 bg-amber-400/10 text-amber-400 hover:bg-amber-400/20 shadow-[0_0_6px_rgba(251,191,36,0.3)]'
                    }
                  `}
                >
                  {used ? <X size={10} /> : <Gem size={14} />}
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Cape des Illusions */}
      {hasCape && (
        <>
          <div className="hidden sm:block w-px self-stretch bg-dungeon-gold/20 mx-1" />
          <span className="hidden sm:inline text-teal-400/70 font-medieval text-[10px] sm:text-xs uppercase tracking-wide whitespace-nowrap shrink-0">
            Cape des Illusions
          </span>
          <div className="flex gap-1">
            {Array.from({ length: numSlots }, (_, i) => {
              const used = capeUsed?.[i] ?? false;
              return (
                <button
                  key={i}
                  disabled={isReadOnly}
                  onClick={() => !isReadOnly && onCapeToggle?.(monthIndex, i)}
                  title={used ? 'Utilisée — cliquer pour annuler' : `Utiliser la Cape des Illusions${numSlots > 1 ? ` (${i + 1}e fois)` : ''}`}
                  className={`
                    flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg border-2 transition-all
                    ${isReadOnly ? 'cursor-default' : 'cursor-pointer'}
                    ${used
                      ? 'border-gray-700 bg-dungeon-dark/60 text-gray-600'
                      : 'border-teal-400/70 bg-teal-400/10 text-teal-400 hover:bg-teal-400/20 shadow-[0_0_6px_rgba(45,212,191,0.3)]'
                    }
                  `}
                >
                  {used ? <X size={10} /> : <Sparkles size={14} />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Bannière affichée sur la ligne quand les 7 jours sont validés
 */
function WingCompleteBanner() {
  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
      <div className="bg-dungeon-gold text-dungeon-dark px-4 py-1.5 rounded-full font-medieval font-bold text-xs md:text-sm shadow-[0_0_20px_rgba(212,175,55,0.6)] flex items-center gap-2 border-2 border-yellow-200/60">
        <Swords size={14} />
        <span>Aile Conquise ! +3 pts</span>
        <Swords size={14} />
      </div>
    </div>
  );
}

/**
 * Carte d'un jour
 * MONSTER → bouclier bleu + valeur centrée
 * TRAP    → triangle rouge + valeur négative centrée
 * BOSS    → couronne dorée + valeur
 * DOUBLE  → deux boucliers bleus côte à côte
 */
function DayCard({ day, onClick, isReadOnly, isWingComplete, undeadDefeatedInWing, undeadNeedsNecro, finalBossData, onValueTooHigh }) {
  const isBoss = day.type === 'BOSS';
  const isTrap = day.type === 'TRAP';
  const isUndead = day.type === 'UNDEAD';
  const isDouble = day.type === 'DOUBLE';
  const isNecromancer = day.type === 'NECROMANCER';
  const isShaman = day.type === 'SHAMAN';
  const isFinalBoss = day.isFinalBoss ?? false;
  const isElite = day.isElite ?? false;
  const isInvisible = day.isInvisible ?? false;
  const isInfluenced = day.isInfluenced ?? false;
  const isCompleted = day.completed;
  // UNDEAD validé mais nécromancien du mois pas encore vaincu → overlay d'attente
  const isUndeadBlocked = isUndead && isCompleted && (undeadNeedsNecro ?? false);

  // Valeur affichée sur le boss final (dynamique) et badge barré (valeur précédente)
  const finalBossCurrentValue = isFinalBoss ? (finalBossData?.currentValue ?? 2048) : day.value;
  const finalBossPreviousValue = isFinalBoss ? (finalBossData?.previousValue ?? null) : null;

  // Valeur effective à valider (boss final : dynamique, sinon valeur du jour)
  const effectiveValue = isFinalBoss ? finalBossCurrentValue : day.value;

  const handleClick = () => {
    if (isReadOnly) return;
    if (!isCompleted && effectiveValue > 30) {
      onValueTooHigh();
      return;
    }
    onClick(day.monthIndex, day.weekIndex, day.dayIndex);
  };

  // Couleur de fond selon le type — calquée sur le calendrier physique
  // Boss    : rouge profond → orangé → ambre doré  (rouge or)
  // Monstre : bleu ciel lumineux → bleu clair  (bleu blanc)
  // Piège   : violet doux → lavande clair  (blanc violet)
  const bgClass = isElite
    ? 'bg-gradient-to-b from-red-600 via-red-500 to-rose-300'  // tout type élite → fond rouge
    : isBoss && (isInfluenced || isFinalBoss)
    ? 'bg-gradient-to-b from-yellow-600 via-yellow-500 to-amber-400'  // boss influencé / boss final → fond jaune
    : isBoss
    ? 'bg-gradient-to-b from-red-800 via-orange-700 to-amber-600'
    : isTrap
    ? 'bg-gradient-to-b from-violet-100 from-violet-400 to-violet-600'
    : isNecromancer
    ? 'bg-gradient-to-b from-green-950 via-green-950 to-green-900'
    : isShaman
    ? 'bg-gradient-to-b from-slate-900 via-purple-950 to-purple-900'
    : 'bg-gradient-to-b from-sky-600 via-sky-400 to-blue-300';

  return (
    <button
      onClick={handleClick}
      disabled={isReadOnly}
      title={
        isFinalBoss
          ? `${day.dayOfWeek} ${day.day} — Boss Final (valeur : ${finalBossCurrentValue} pts, +30 pts bonus)${finalBossPreviousValue !== null ? ` — précédente : ${finalBossPreviousValue}` : ''}`
          : `${day.dayOfWeek} ${day.day} — ${isBoss ? 'Boss' : isTrap ? 'Piège' : isUndead ? 'Mort-Vivant Enchaîné' : isDouble ? `Monstres Doubles (${day.value} & ${day.value2}) +3 pts` : isNecromancer ? 'Nécromancien' : isShaman ? "Shaman de l'Ombre" : isInvisible ? 'Monstre Invisible' : isElite ? 'Monstre Élite' : 'Monstre'} (${day.value > 0 ? '+' : ''}${day.value} pt${Math.abs(day.value) > 1 ? 's' : ''})`
      }
      className={`
        relative aspect-square overflow-hidden transition-all duration-150
        rounded-sm
        ${bgClass}
        ${!isReadOnly && !isCompleted ? 'hover:brightness-110' : ''}
        ${isReadOnly ? 'cursor-default' : 'cursor-pointer'}
      `}
    >
      {/* Bordure colorée selon le type */}
      {isBoss && (
        <div className="absolute inset-0 ring-1 ring-inset ring-dungeon-gold/30 pointer-events-none" />
      )}
      {isTrap && !isCompleted && (
        <div className="absolute inset-0 ring-1 ring-inset ring-violet-700/30 pointer-events-none" />
      )}
      {isUndead && (
        <div className="absolute inset-0 ring-4 md:ring-8 ring-inset ring-dungeon-gold pointer-events-none" />
      )}
      {isInvisible && (
        <div className="absolute inset-0 border-4 md:border-[8px] border-dashed border-blue-200/90 pointer-events-none z-10 rounded-sm" />
      )}
      {isNecromancer && (
        <div className="absolute inset-0 ring-4 md:ring-8 ring-inset ring-green-400 pointer-events-none z-10" />
      )}
      {isShaman && (
        <div className="absolute inset-0 ring-4 md:ring-8 ring-inset ring-purple-400 pointer-events-none z-10" />
      )}

      {/* Numéro du jour — haut-gauche (toujours jaune) */}
      <div className="absolute top-0.5 left-0.5 min-w-[14px] h-[14px] sm:min-w-[20px] sm:h-[20px] md:min-w-[26px] md:h-[26px] px-0.5 sm:px-1 rounded text-[9px] sm:text-xs md:text-sm font-bold flex items-center justify-center leading-none z-10 bg-dungeon-gold text-dungeon-dark">
        {day.day}
      </div>

      {/* Icône verrou (lecture seule) */}
      {isReadOnly && (
        <div className="absolute top-1 right-1 z-10">
          <Lock size={8} className="text-white/25" />
        </div>
      )}

      {/* ── Icône centrale — toujours visible ── */}
      <div className="absolute inset-0 flex items-center justify-center">
        {isFinalBoss ? (
          /* BOSS FINAL — cercle rouge + valeur dynamique (peut être grand : 2048→256) */
          <div className="relative flex items-center justify-center w-[82%] h-[82%]">
            <Circle
              className="absolute inset-0 w-full h-full text-red-600 fill-gray-300/90"
              strokeWidth={3}
            />
            <span className="relative z-10 font-bold text-[9px] sm:text-[15px] md:text-[22px] leading-none text-black">
              {finalBossCurrentValue}
            </span>
          </div>
        ) : isBoss ? (
          isInfluenced && !undeadDefeatedInWing ? (
            /* BOSS INFLUENCÉ — cercle avec bordure rouge + valeur */
            <div className="relative flex items-center justify-center w-[82%] h-[82%]">
              <Circle
                className="absolute inset-0 w-full h-full text-red-600 fill-gray-300/90"
                strokeWidth={3}
              />
              <span className={`relative z-10 font-bold text-[13px] sm:text-[20px] md:text-[29px] leading-none ${isElite ? 'text-red-600' : 'text-black'}`}>
                {day.value}
              </span>
            </div>
          ) : (
            /* BOSS classique (ou boss influencé affaibli par UNDEAD) — bouclier avec valeur */
            <div className="relative flex items-center justify-center w-[82%] h-[82%]">
              <Shield
                className="absolute inset-0 w-full h-full text-black fill-gray-300"
                strokeWidth={1.8}
              />
              <span className={`relative z-10 font-bold text-[13px] sm:text-[20px] md:text-[29px] leading-none ${isElite ? 'text-red-600' : 'text-black'}`}>
                {isInfluenced && undeadDefeatedInWing ? Math.ceil(day.value / 2) : day.value}
              </span>
            </div>
          )

        ) : isTrap ? (
          /* TRAP — triangle : trait rouge vif, fond blanc, valeur rouge */
          <div className="relative flex items-center justify-center w-[85%] h-[85%]">
            <TrapTriangle className="absolute inset-0 w-full h-full text-red-600" />
            <span className="relative z-10 text-red-700 font-bold text-[13px] sm:text-[20px] md:text-[29px] leading-none mt-[30%]">
              {day.value}
            </span>
          </div>

        ) : isNecromancer ? (
          /* NECROMANCER — bouclier vert avec valeur (comme un monstre) */
          <div className="relative flex items-center justify-center w-[82%] h-[82%]">
            <Shield
              className="absolute inset-0 w-full h-full text-green-900 fill-green-200"
              strokeWidth={1.8}
            />
            <span className="relative z-10 font-bold text-[13px] sm:text-[20px] md:text-[29px] leading-none text-green-900">
              {day.value}
            </span>
          </div>

        ) : isShaman ? (
          /* SHAMAN — bouclier violet sombre avec valeur */
          <div className="relative flex items-center justify-center w-[82%] h-[82%]">
            <Shield
              className="absolute inset-0 w-full h-full text-purple-800 fill-purple-200/80"
              strokeWidth={1.8}
            />
            <span className="relative z-10 font-bold text-[13px] sm:text-[20px] md:text-[29px] leading-none text-purple-900">
              {day.value}
            </span>
          </div>

        ) : isInvisible ? (
          /* INVISIBLE — bouclier rond (cercle) + translucide */
          <div className="relative flex items-center justify-center w-[82%] h-[82%] opacity-75">
            <Circle
              className="absolute inset-0 w-full h-full text-blue-300/80 fill-gray-200/90"
              strokeWidth={1.5}
            />
            <span className="relative z-10 font-bold text-[13px] sm:text-[20px] md:text-[29px] leading-none text-black/70">
              {day.value}
            </span>
          </div>

        ) : isDouble ? (
          /* DOUBLE — deux boucliers côte à côte */
          <div className="relative flex items-center justify-center gap-[3%] w-full h-full px-[3%]">
            <div className="relative flex items-center justify-center w-[47%] h-[78%]">
              <Shield className="absolute inset-0 w-full h-full text-black fill-gray-300" strokeWidth={1.8} />
              <span className="relative z-10 font-bold text-[10px] sm:text-[15px] md:text-[22px] leading-none text-black">
                {day.value}
              </span>
            </div>
            <div className="relative flex items-center justify-center w-[47%] h-[78%]">
              <Shield className="absolute inset-0 w-full h-full text-black fill-gray-300" strokeWidth={1.8} />
              <span className="relative z-10 font-bold text-[10px] sm:text-[15px] md:text-[22px] leading-none text-black">
                {day.value2}
              </span>
            </div>
          </div>

        ) : (
          /* MONSTER/UNDEAD/ELITE — bouclier avec valeur (rouge si élite) */
          <div className="relative flex items-center justify-center w-[82%] h-[82%]">
            <Shield
              className="absolute inset-0 w-full h-full text-black fill-gray-300"
              strokeWidth={1.8}
            />
            <span className={`relative z-10 font-bold text-[13px] sm:text-[20px] md:text-[29px] leading-none ${isElite ? 'text-red-600' : 'text-black'}`}>
              {day.value}
            </span>
          </div>
        )}
      </div>

      {/* Badge valeur originale barrée (boss influencé affaibli par UNDEAD) — masqué mobile */}
      {isInfluenced && undeadDefeatedInWing && (
        <div className="absolute bottom-3 left-3 z-20 hidden sm:block">
          <div className="relative flex items-center justify-center" style={{ width: 18, height: 18 }}>
            <Circle size={40} className="absolute text-red-500/70 fill-gray-600/60" strokeWidth={2} />
            <span className="absolute z-10 text-[6px] sm:text-[18px] font-bold text-gray-300 line-through leading-none">{day.value}</span>
          </div>
        </div>
      )}

      {/* Badge valeur précédente barrée (boss final) — masqué mobile */}
      {isFinalBoss && finalBossPreviousValue !== null && (
        <div className="absolute bottom-3 left-3 z-20 hidden sm:block">
          <div className="relative flex items-center justify-center" style={{ width: 18, height: 18 }}>
            <Circle size={40} className="absolute text-red-500/70 fill-gray-600/60" strokeWidth={2} />
            <span className="absolute z-10 text-[5px] sm:text-[10px] font-bold text-gray-300 line-through leading-none">{finalBossPreviousValue}</span>
          </div>
        </div>
      )}

      {/* Badge +2 pour les monstres doubles */}
      {isDouble && (
        <div className="absolute bottom-0.5 right-0.5 z-30 bg-dungeon-gold text-dungeon-dark text-[7px] sm:text-[9px] font-bold leading-none px-0.5 sm:px-1 py-0.5 rounded">
          +2
        </div>
      )}

      {/* Badge +10 pour les boss influencés */}
      {isInfluenced && (
        <div className="absolute bottom-0.5 right-0.5 z-30 bg-orange-500 text-white text-[7px] sm:text-[9px] font-bold leading-none px-0.5 sm:px-1 py-0.5 rounded">
          +10
        </div>
      )}

      {/* Badge +30 pour le boss final */}
      {isFinalBoss && (
        <div className="absolute bottom-0.5 right-0.5 z-30 bg-orange-500 text-white text-[7px] sm:text-[9px] font-bold leading-none px-0.5 sm:px-1 py-0.5 rounded">
          +30
        </div>
      )}

      {/* Indicateur boss influencé / boss final */}
      {(isInfluenced || isFinalBoss) && (
        <div className="absolute top-0.5 right-0.5 z-30">
          <Flame size={14} className="text-orange-400 fill-orange-400 drop-shadow-[0_0_4px_rgba(251,146,60,0.9)]" />
        </div>
      )}

      {/* Indicateur élite — masqué mobile */}
      {isElite && (
        <div className="absolute bottom-2 left-1 z-30 hidden sm:block">
          <Zap size={18} className="text-yellow-300 fill-yellow-300 drop-shadow-[0_0_4px_rgba(253,224,71,0.9)]" />
        </div>
      )}

      {/* Indicateur nécromancien — masqué mobile */}
      {isNecromancer && (
        <div className="absolute bottom-3.5 left-3 z-30 hidden sm:block">
          <Skull size={22} className="text-green-600" />
        </div>
      )}

      {/* Indicateur Shaman de l'Ombre — masqué mobile */}
      {isShaman && (
        <div className="absolute bottom-3.5 left-3 z-30 hidden sm:block">
          <Ghost size={22} className="text-purple-400" />
        </div>
      )}

      {/* Indicateur potion de mana */}
      {day.hasMana && (
        <div className={`absolute bottom-0.5 right-0 sm:bottom-2 sm:right-0.5 z-30 drop-shadow-[0_0_4px_rgba(96,165,250,0.9)] ${isCompleted ? 'opacity-75' : ''}`}>
          <FlaskConical size={14} className="text-blue-700 sm:hidden" />
          <FlaskConical size={20} className="text-blue-700 hidden sm:block" />
        </div>
      )}

      {/* Overlay UNDEAD bloqué (validé mais nécromancien pas encore vaincu) */}
      {isUndeadBlocked && (
        <>
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              backgroundColor: 'rgba(217, 119, 6, 0.80)',
              backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 5px, rgba(180, 83, 9, 0.4) 5px, rgba(180, 83, 9, 0.4) 9px)',
            }}
          />
          <div className="absolute top-1 right-1 z-20">
            <Skull size={14} className="text-amber-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
          </div>
        </>
      )}

      {/* Overlay vert transparent + coche quand validé (et non bloqué) */}
      {isCompleted && !isUndeadBlocked && (
        <>
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              backgroundColor: 'rgba(34, 197, 94, 0.75)',
              backgroundImage: isWingComplete
                ? 'repeating-linear-gradient(-45deg, transparent, transparent 5px, rgba(21, 128, 61, 0.4) 5px, rgba(21, 128, 61, 0.4) 9px)'
                : undefined,
            }}
          />
          <div className="absolute top-1 right-1 z-20">
            <CheckCircle2
              size={14}
              className="text-green-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
            />
          </div>
        </>
      )}

    </button>
  );
}

/**
 * Modal affichée quand la valeur du jour dépasse 30 (max 5 dés × 6)
 */
function ValueTooHighModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm bg-gradient-to-br from-dungeon-stone to-dungeon-dark rounded-xl border-2 border-red-500/60 shadow-[0_0_40px_rgba(239,68,68,0.2)] p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30">
            <X className="text-red-400" size={20} />
          </div>
          <h3 className="text-lg font-medieval font-bold text-red-400 leading-tight">Validation impossible</h3>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent mb-4" />

        <p className="text-sm text-gray-300 leading-relaxed mb-1">
          Mira n'est pas assez forte pour battre ce boss !
        </p>
        <p className="text-sm text-gray-400 leading-relaxed">
          Impossible de valider plus de 30 pts (5 dés × 6).
        </p>

        <button
          onClick={onClose}
          className="mt-5 w-full py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 font-medieval text-sm hover:bg-red-500/20 transition-colors"
        >
          Ok
        </button>
      </div>
    </div>
  );
}

/**
 * Modal affichant les nouvelles règles du mois
 */
function RulesModal({ rule, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-gradient-to-br from-dungeon-stone to-dungeon-dark rounded-xl border-2 border-dungeon-gold/60 shadow-[0_0_40px_rgba(212,175,55,0.2)] p-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-dungeon-gold transition-colors"
        >
          <X size={18} />
        </button>

        {/* En-tête */}
        <div className="flex items-center gap-3 mb-4 pr-6">
          <div className="p-2 rounded-lg bg-dungeon-gold/10 border border-dungeon-gold/30">
            <ScrollText className="text-dungeon-gold" size={20} />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medieval">Nouvelle règle</p>
            <h3 className="text-lg font-medieval font-bold text-dungeon-gold leading-tight">{rule.title}</h3>
          </div>
        </div>

        {/* Séparateur */}
        <div className="h-px bg-gradient-to-r from-transparent via-dungeon-gold/40 to-transparent mb-4" />

        {/* Contenu */}
        <div className="space-y-3">
          {rule.sections.map((section, i) => (
            <div key={i}>
              {section.heading && (
                <p className="text-xs font-medieval font-semibold text-dungeon-gold/70 uppercase tracking-wide mb-1">
                  {section.heading}
                </p>
              )}
              <p className="text-sm text-gray-300 leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>

        {/* Pied */}
        <button
          onClick={onClose}
          className="mt-5 w-full py-2 rounded-lg bg-dungeon-gold/10 border border-dungeon-gold/30 text-dungeon-gold font-medieval text-sm hover:bg-dungeon-gold/20 transition-colors"
        >
          Compris !
        </button>
      </div>
    </div>
  );
}
