import { useState } from 'react';
import { Shield, CheckCircle2, Lock, Swords, Wand2, ScrollText, X } from 'lucide-react';
import { MONTH_RULES } from '../data/monthConfigs';

/* Fiole de mana — corps rond, col étroit, bouchon rouge, liquide bleu lumineux */
function ManaPotion({ className }) {
  return (
    <svg viewBox="0 0 20 26" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Bouchon */}
      <rect x="7" y="0.5" width="6" height="3.5" rx="1.2" fill="#7f1d1d"/>
      <rect x="6.5" y="3.5" width="7" height="1.5" rx="0.5" fill="#991b1b"/>
      {/* Col */}
      <rect x="7.5" y="5" width="5" height="5" rx="0.8" fill="#bfdbfe"/>
      {/* Corps — glow externe */}
      <circle cx="10" cy="18" r="7.5" fill="#1e40af" opacity="0.5"/>
      {/* Corps — fond bleu */}
      <circle cx="10" cy="18" r="7" fill="#1d4ed8"/>
      {/* Liquide lumineux */}
      <circle cx="10" cy="18" r="5.5" fill="#3b82f6"/>
      {/* Reflet central brillant */}
      <ellipse cx="8.5" cy="15.5" rx="2.8" ry="2" fill="#bfdbfe" opacity="0.6"/>
      {/* Petit reflet secondaire */}
      <circle cx="12" cy="19" r="1.2" fill="#93c5fd" opacity="0.4"/>
      {/* Contour col */}
      <rect x="7.5" y="5" width="5" height="5" rx="0.8" fill="none" stroke="#93c5fd" strokeWidth="0.5" opacity="0.5"/>
    </svg>
  );
}

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
export function DungeonGrid({ monthData, onDayClick, isReadOnly, onManaToggle, onStaffToggle }) {
  const [rulesOpen, setRulesOpen] = useState(false);
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
    // Aile conquise = tous les jours réels de la ligne sont validés
    const realDays = cells.filter(c => !c.isEmpty).map(c => c.day);
    const isWingComplete = realDays.length === 7 && realDays.every(d => d.completed);
    return { cells, isWingComplete };
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
function ManaHeader({ allDays, manaUsed, monthIndex, isReadOnly, onManaToggle, hasStaff, staffUsed, onStaffToggle }) {
  const manaDays = allDays.filter(d => d.hasMana);

  return (
    <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 bg-blue-950/30 border-b border-blue-400/20 min-h-[34px] sm:min-h-[40px]">

      {/* Potions de mana */}
      <span className="text-blue-300 font-medieval text-[10px] sm:text-xs uppercase tracking-wide whitespace-nowrap shrink-0">
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
          <div className="w-px self-stretch bg-dungeon-gold/20 mx-1" />
          <span className="text-dungeon-gold/70 font-medieval text-[10px] sm:text-xs uppercase tracking-wide whitespace-nowrap shrink-0">
            Bâton du Sage
          </span>
          <button
            disabled={isReadOnly}
            onClick={() => !isReadOnly && onStaffToggle?.(monthIndex)}
            title={staffUsed ? 'Pouvoir utilisé ce mois — cliquer pour annuler' : 'Utiliser le Bâton du Sage ce mois'}
            className={`
              flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg border-2 transition-all
              ${isReadOnly ? 'cursor-default' : 'cursor-pointer'}
              ${staffUsed
                ? 'border-gray-700 bg-dungeon-dark/60 text-gray-600'
                : 'border-dungeon-gold/70 bg-dungeon-gold/10 text-dungeon-gold hover:bg-dungeon-gold/20 shadow-[0_0_6px_rgba(212,175,55,0.3)]'
              }
            `}
          >
            <Wand2 size={14} className={staffUsed ? 'opacity-30' : ''} />
          </button>
          {staffUsed && (
            <span className="text-gray-600 text-[10px] font-medieval italic">utilisé</span>
          )}
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
 */
function DayCard({ day, onClick, isReadOnly, isWingComplete }) {
  const isBoss = day.type === 'BOSS';
  const isTrap = day.type === 'TRAP';
  const isUndead = day.type === 'UNDEAD';
  const isCompleted = day.completed;

  const handleClick = () => {
    if (!isReadOnly) {
      onClick(day.monthIndex, day.weekIndex, day.dayIndex);
    }
  };

  // Couleur de fond selon le type — calquée sur le calendrier physique
  // Boss    : rouge profond → orangé → ambre doré  (rouge or)
  // Monstre : bleu ciel lumineux → bleu clair  (bleu blanc)
  // Piège   : violet doux → lavande clair  (blanc violet)
  const bgClass = isBoss
    ? 'bg-gradient-to-b from-red-800 via-orange-700 to-amber-600'
    : isTrap
    ? 'bg-gradient-to-b from-violet-100 from-violet-400 to-violet-600'
    : 'bg-gradient-to-b from-sky-600 via-sky-400 to-blue-300';

  return (
    <button
      onClick={handleClick}
      disabled={isReadOnly}
      title={`${day.dayOfWeek} ${day.day} — ${isBoss ? 'Boss' : isTrap ? 'Piège' : isUndead ? 'Mort-Vivant Enchaîné' : 'Monstre'} (${day.value > 0 ? '+' : ''}${day.value} pt${Math.abs(day.value) > 1 ? 's' : ''})`}
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
        <div className="absolute inset-0 ring-1 ring-inset ring-red-700/30 pointer-events-none" />
      )}
      {isUndead && (
        <div className="absolute inset-0 ring-4 md:ring-8 ring-inset ring-dungeon-gold pointer-events-none" />
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
        {isBoss ? (
          /* BOSS — bouclier jaune avec valeur au centre */
          <div className="relative flex items-center justify-center w-[82%] h-[82%]">
            <Shield
              className="absolute inset-0 w-full h-full text-black fill-gray-300"
              strokeWidth={1.8}
            />
            <span className="relative z-10 text-black font-bold text-[13px] sm:text-[20px] md:text-[29px] leading-none">
              {day.value}
            </span>
          </div>

        ) : isTrap ? (
          /* TRAP — triangle : trait rouge vif, fond blanc, valeur rouge */
          <div className="relative flex items-center justify-center w-[85%] h-[85%]">
            <TrapTriangle className="absolute inset-0 w-full h-full text-red-600" />
            <span className="relative z-10 text-red-700 font-bold text-[13px] sm:text-[20px] md:text-[29px] leading-none mt-[30%]">
              {day.value}
            </span>
          </div>

        ) : (
          /* MONSTER — bouclier : trait noir, fond blanc, valeur noire */
          <div className="relative flex items-center justify-center w-[82%] h-[82%]">
            <Shield
              className="absolute inset-0 w-full h-full text-black fill-gray-300"
              strokeWidth={1.8}
            />
            <span className="relative z-10 text-black font-bold text-[13px] sm:text-[20px] md:text-[29px] leading-none">
              {day.value}
            </span>
          </div>
        )}
      </div>

      {/* Indicateur potion de mana */}
      {day.hasMana && (
        <div className={`absolute bottom-0.5 right-0.5 z-30 w-4 h-4 sm:w-5 sm:h-5 drop-shadow-[0_0_4px_rgba(96,165,250,0.9)] ${isCompleted ? 'opacity-75' : ''}`}>
          <ManaPotion className="w-full h-full" />
        </div>
      )}

      {/* Overlay vert transparent + coche quand validé */}
      {isCompleted && (
        <>
          <div
            className="absolute inset-0 pointer-events-none"
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
