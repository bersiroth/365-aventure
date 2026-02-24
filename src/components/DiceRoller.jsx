import { useState, useRef, useEffect, useCallback } from 'react';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Lock, X } from 'lucide-react';

const DICE_ICONS = [null, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

const COLOR_STYLES = {
  red: {
    base: 'bg-red-700 border-red-500 hover:border-red-300',
    locked: 'bg-red-700 border-dungeon-gold',
  },
  blue: {
    base: 'bg-blue-700 border-blue-500 hover:border-blue-300',
    locked: 'bg-blue-700 border-dungeon-gold',
  },
};

function Die({ value, locked, isRolling, canInteract, onToggle, color }) {
  const DiceIcon = DICE_ICONS[value];
  const styles = COLOR_STYLES[color];
  return (
    <button
      onClick={canInteract ? onToggle : undefined}
      disabled={!canInteract}
      className={`relative p-1.5 sm:p-2 rounded-xl border-2 transition-all ${
        locked ? styles.locked : styles.base
      } ${!canInteract ? 'cursor-default' : 'cursor-pointer'}`}
    >
      <DiceIcon
        className={`w-8 h-8 sm:w-12 sm:h-12 text-white ${isRolling && !locked ? 'animate-dice-shake' : ''}`}
      />
      {locked && (
        <div className="absolute -top-2 -right-2 bg-dungeon-gold rounded-full p-0.5">
          <Lock size={10} className="text-dungeon-dark" />
        </div>
      )}
    </button>
  );
}

const INITIAL_DICE = Array.from({ length: 5 }, () => ({ value: 1, locked: false }));

function checkResult(values) {
  const counts = {};
  for (const v of values) counts[v] = (counts[v] || 0) + 1;
  const maxCount = Math.max(...Object.values(counts));
  const tripleValue = Object.keys(counts).find(k => counts[k] >= 3);
  if (maxCount >= 3) {
    return { type: 'triple', message: `Bravo ! Vous avez réussi un Triple ${tripleValue} !` };
  }
  const sum = values.reduce((a, b) => a + b, 0);
  if (sum > 20) {
    return { type: 'high', message: 'Bravo ! La valeur de vos dés dépasse les 20 points !' };
  }
  return { type: 'none', message: `Score final : ${sum} pts` };
}

export function DiceRoller({ onClose }) {
  const [dice, setDice] = useState(INITIAL_DICE);
  const [rollsLeft, setRollsLeft] = useState(3);
  const [isRolling, setIsRolling] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [hasRolledOnce, setHasRolledOnce] = useState(false);
  const [result, setResult] = useState(null);

  const timeoutRef = useRef(null);
  const diceRef = useRef(dice);
  useEffect(() => { diceRef.current = dice; }, [dice]);

  const clearAnim = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => () => clearAnim(), [clearAnim]);

  const restart = () => {
    clearAnim();
    setDice(INITIAL_DICE);
    setRollsLeft(3);
    setIsRolling(false);
    setGameOver(false);
    setHasRolledOnce(false);
    setResult(null);
  };

  const rollDice = () => {
    if (isRolling || rollsLeft === 0) return;

    const nextRollsLeft = rollsLeft - 1;
    setRollsLeft(nextRollsLeft);
    setIsRolling(true);
    setHasRolledOnce(true);

    const currentDice = diceRef.current;
    const finalValues = currentDice.map(d =>
      d.locked ? d.value : Math.ceil(Math.random() * 6)
    );

    const STEPS = 12;
    let step = 0;

    const animate = () => {
      if (step < STEPS) {
        setDice(currentDice.map((d) =>
          d.locked ? d : { ...d, value: Math.ceil(Math.random() * 6) }
        ));
        const progress = step / STEPS;
        const delay = 50 + progress * progress * 350;
        step++;
        timeoutRef.current = setTimeout(animate, delay);
      } else {
        const finalDice = currentDice.map((d, i) =>
          d.locked ? d : { ...d, value: finalValues[i] }
        );
        setDice(finalDice);
        setIsRolling(false);

        if (nextRollsLeft === 0) {
          const res = checkResult(finalDice.map(d => d.value));
          setResult(res);
          setGameOver(true);
        }
      }
    };

    timeoutRef.current = setTimeout(animate, 50);
  };

  const toggleLock = (index) => {
    setDice(prev => prev.map((d, i) =>
      i === index ? { ...d, locked: !d.locked } : d
    ));
  };

  const canInteract = hasRolledOnce && !isRolling && !gameOver;
  const sum = dice.reduce((a, d) => a + d.value, 0);
  const won = result?.type === 'triple' || result?.type === 'high';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={(e) => { if (e.target === e.currentTarget) { clearAnim(); onClose(); } }}
    >
      <div className="w-full max-w-lg bg-gradient-to-b from-dungeon-stone to-dungeon-dark border-2 border-dungeon-gold/60 rounded-2xl shadow-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-dungeon-gold font-medieval font-bold text-xl">Lancer de Dés</h2>
          <button
            onClick={() => { clearAnim(); onClose(); }}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Dés */}
        <div className="flex justify-center gap-2 sm:gap-3 mb-6">
          {dice.map((d, i) => (
            <Die
              key={i}
              value={d.value}
              locked={d.locked}
              isRolling={isRolling}
              canInteract={canInteract}
              onToggle={() => toggleLock(i)}
              color={i < 3 ? 'red' : 'blue'}
            />
          ))}
        </div>

        {/* Zone message */}
        <div className="min-h-[48px] flex items-center justify-center mb-4 text-center">
          {isRolling ? (
            <p className="text-gray-300 font-medieval animate-pulse">Les dés roulent...</p>
          ) : gameOver ? (
            <p className={`font-medieval font-semibold text-base ${won ? 'text-dungeon-gold' : 'text-gray-300'}`}>
              {result.message}
            </p>
          ) : hasRolledOnce ? (
            <p className="text-gray-400 font-medieval text-sm">
              {rollsLeft} lancer{rollsLeft > 1 ? 's' : ''} restant{rollsLeft > 1 ? 's' : ''}
            </p>
          ) : null}
        </div>

        {/* Score actuel */}
        {hasRolledOnce && !gameOver && (
          <p className="text-center text-gray-500 text-xs font-medieval mb-4">
            Score actuel : {sum} pts
          </p>
        )}

        {/* Boutons */}
        <div className="flex justify-center gap-3">
          {gameOver ? (
            <>
              <button
                onClick={() => { clearAnim(); onClose(); }}
                className="px-6 py-2.5 rounded-xl font-medieval font-semibold text-sm bg-dungeon-stone border border-gray-600 text-gray-300 hover:border-dungeon-gold/50 hover:text-dungeon-gold transition-colors"
              >
                Quitter
              </button>
              <button
                onClick={restart}
                className="px-6 py-2.5 rounded-xl font-medieval font-semibold text-sm bg-dungeon-gold text-dungeon-dark hover:bg-dungeon-gold/80 transition-colors"
              >
                Recommencer
              </button>
            </>
          ) : (
            <button
              onClick={rollDice}
              disabled={isRolling}
              className="px-6 py-2.5 rounded-xl font-medieval font-semibold text-sm bg-dungeon-gold text-dungeon-dark hover:bg-dungeon-gold/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {hasRolledOnce ? 'Relancer' : 'Lancer'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
