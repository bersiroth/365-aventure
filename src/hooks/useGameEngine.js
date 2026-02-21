import { useState, useEffect, useCallback, useRef } from 'react';
import { generateYear2026, calculateScore, serializeSave, deserializeSave } from '../data/gameData';
import { putSave } from '../api';

const STORAGE_KEY = 'donjon_2026_save';
const SYNC_DEBOUNCE_MS = 500;

/**
 * Hook principal pour gérer l'état du jeu
 * - Persistance localStorage (joueurs non connectés uniquement)
 * - Sync serveur (debounce 500ms) quand connecté
 */
export function useGameEngine(player) {
  const [yearData, setYearData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const syncTimerRef = useRef(null);
  const prevPlayerIdRef = useRef(undefined);

  // Initialisation — vide le localStorage à chaque changement d'utilisateur
  useEffect(() => {
    // Si l'utilisateur change (connexion, déconnexion, changement de compte)
    // on vide le localStorage pour éviter les contaminations entre comptes
    if (prevPlayerIdRef.current !== undefined && prevPlayerIdRef.current !== player?.id) {
      localStorage.removeItem(STORAGE_KEY);
    }
    prevPlayerIdRef.current = player?.id ?? null;

    initializeGame();
  }, [player?.id]);

  const initializeGame = () => {
    if (player?.save_data) {
      // Connecté avec une save serveur : on la charge
      loadFromServerSave(player.save_data);
    } else if (player) {
      // Connecté mais pas encore de save : partie vierge
      createNewGame();
    } else {
      // Non connecté : localStorage
      loadFromLocalStorage();
    }
  };

  const loadFromServerSave = (saveData) => {
    const restored = deserializeSave(saveData);
    if (restored) {
      setYearData(restored);
    } else {
      createNewGame();
    }
  };

  const loadFromLocalStorage = () => {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setYearData(parsed);
      } catch (error) {
        console.error('Erreur lors du chargement de la sauvegarde', error);
        createNewGame();
      }
    } else {
      createNewGame();
    }
  };

  const createNewGame = () => {
    const newYear = generateYear2026();
    setYearData(newYear);
    // Persistance localStorage uniquement si non connecté
    if (!player) saveToLocalStorage(newYear);
  };

  const saveToLocalStorage = (data) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde', error);
    }
  };

  const syncToServer = (encoded) => {
    if (!player) return;
    // Debounce
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      putSave(encoded).catch(err => console.error('Sync error:', err));
    }, SYNC_DEBOUNCE_MS);
  };

  /**
   * Marque un jour comme complété (ou annule)
   */
  const toggleDayCompletion = useCallback((monthIndex, weekIndex, dayIndex) => {
    if (!yearData) return;

    const newYearData = [...yearData];
    const day = newYearData[monthIndex].weeks[weekIndex].days[dayIndex];
    day.completed = !day.completed;

    // Si on dé-valide une case avec potion de mana → reset son slot
    if (!day.completed && day.hasMana && day.manaSlot !== null) {
      const month = newYearData[monthIndex];
      month.manaUsed = [...month.manaUsed];
      month.manaUsed[day.manaSlot] = false;
    }

    // Vérifier si la semaine est complète
    const week = newYearData[monthIndex].weeks[weekIndex];
    week.completed = week.days.filter(d => d.completed).length === 7;

    setYearData(newYearData);

    // Persistance : localStorage si non connecté, serveur si connecté
    const encoded = serializeSave(newYearData);
    if (player) {
      syncToServer(encoded);
    } else {
      saveToLocalStorage(newYearData);
    }
  }, [yearData, player]);

  /**
   * Marque une potion de mana comme utilisée (ou annule)
   */
  const toggleManaUsed = useCallback((monthIndex, slotIndex) => {
    if (!yearData) return;

    const newYearData = [...yearData];
    const month = newYearData[monthIndex];
    month.manaUsed = [...month.manaUsed];
    month.manaUsed[slotIndex] = !month.manaUsed[slotIndex];

    setYearData(newYearData);

    const encoded = serializeSave(newYearData);
    if (player) {
      syncToServer(encoded);
    } else {
      saveToLocalStorage(newYearData);
    }
  }, [yearData, player]);

  /**
   * Marque le bâton du sage comme utilisé ce mois (ou annule)
   */
  const toggleStaffUsed = useCallback((monthIndex) => {
    if (!yearData) return;

    const newYearData = [...yearData];
    const month = { ...newYearData[monthIndex] };
    month.staffUsed = !month.staffUsed;
    newYearData[monthIndex] = month;

    setYearData(newYearData);

    const encoded = serializeSave(newYearData);
    if (player) {
      syncToServer(encoded);
    } else {
      saveToLocalStorage(newYearData);
    }
  }, [yearData, player]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    };
  }, []);

  // Calculer le score en temps réel
  const score = yearData ? calculateScore(yearData) : null;

  return {
    yearData,
    selectedMonth,
    setSelectedMonth,
    toggleDayCompletion,
    toggleManaUsed,
    toggleStaffUsed,
    score,
  };
}
