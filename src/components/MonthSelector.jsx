import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Sélecteur de mois avec navigation
 */
export function MonthSelector({ months, selectedMonth, onMonthChange, maxMonth = 11 }) {
  const canGoPrevious = selectedMonth > 0;
  const canGoNext = selectedMonth < Math.min(months.length - 1, maxMonth);

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-3">
      <div className="flex items-center justify-between gap-1.5 sm:gap-4">
        {/* Bouton Précédent */}
        <button
          onClick={() => canGoPrevious && onMonthChange(selectedMonth - 1)}
          disabled={!canGoPrevious}
          className={`
            p-1.5 sm:p-3 rounded-lg border-2 transition-all shrink-0
            ${canGoPrevious
              ? 'bg-dungeon-stone border-dungeon-gold/50 hover:border-dungeon-gold hover:bg-dungeon-gold/10 text-dungeon-gold'
              : 'bg-gray-800 border-gray-700 text-gray-600 cursor-not-allowed'
            }
          `}
        >
          <ChevronLeft size={18} />
        </button>

        {/* Grille des mois */}
        <div className="flex-1 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-1 sm:gap-2 min-w-0">
          {months.map((month, index) => {
            const locked = index > maxMonth;
            return (
              <button
                key={month.name}
                onClick={() => !locked && onMonthChange(index)}
                disabled={locked}
                title={locked ? 'Mois pas encore commencé' : month.name}
                className={`
                  px-0 py-1.5 sm:px-2 sm:py-2 rounded-lg border-2 transition-all font-medieval font-semibold text-xs sm:text-sm truncate
                  ${locked
                    ? 'bg-gray-800/50 border-gray-800 text-gray-600 cursor-not-allowed opacity-50'
                    : index === selectedMonth
                      ? 'bg-dungeon-gold text-dungeon-dark border-dungeon-gold shadow-lg scale-105'
                      : 'bg-dungeon-stone border-gray-700 hover:border-dungeon-gold/50 text-gray-300 hover:text-dungeon-gold'
                  }
                `}
              >
                {month.name.substring(0, 3)}
              </button>
            );
          })}
        </div>

        {/* Bouton Suivant */}
        <button
          onClick={() => canGoNext && onMonthChange(selectedMonth + 1)}
          disabled={!canGoNext}
          className={`
            p-1.5 sm:p-3 rounded-lg border-2 transition-all shrink-0
            ${canGoNext
              ? 'bg-dungeon-stone border-dungeon-gold/50 hover:border-dungeon-gold hover:bg-dungeon-gold/10 text-dungeon-gold'
              : 'bg-gray-800 border-gray-700 text-gray-600 cursor-not-allowed'
            }
          `}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
