import { useState, useEffect } from "react";
import { Flashcard } from "../pages/Flashcard/types/flashcardModes";

export const useWrongWords = (setId?: string, mode?: string) => {
  const storageKey = setId && mode ? `wrong_words_${setId}_${mode}` : "wrong_words_global";

  const [wrongWords, setWrongWords] = useState<Flashcard[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const loadList = () => {
      try {
        setWrongWords(JSON.parse(localStorage.getItem(storageKey) || "[]"));
      } catch {
        setWrongWords([]);
      }
    };

    loadList();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === storageKey) {
        loadList();
      }
    };

    const handleCustomChange = () => {
      loadList();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("wrong-words-changed", handleCustomChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("wrong-words-changed", handleCustomChange);
    };
  }, [storageKey]);

  const addWrongWord = (card: Flashcard) => {
    try {
      const list: Flashcard[] = JSON.parse(localStorage.getItem(storageKey) || "[]");
      const exists = list.some(
        (item) => (item._id && card._id && item._id === card._id) || item.word.trim().toLowerCase() === card.word.trim().toLowerCase()
      );

      if (!exists) {
        const newList = [...list, card];
        localStorage.setItem(storageKey, JSON.stringify(newList));
        window.dispatchEvent(new Event("wrong-words-changed"));
      }
    } catch (e) {
      console.error("Error adding wrong word:", e);
    }
  };

  const removeWrongWord = (cardIdOrWord: string) => {
    try {
      const list: Flashcard[] = JSON.parse(localStorage.getItem(storageKey) || "[]");
      const newList = list.filter(
        (item) => item._id !== cardIdOrWord && item.word !== cardIdOrWord
      );
      localStorage.setItem(storageKey, JSON.stringify(newList));
      window.dispatchEvent(new Event("wrong-words-changed"));
    } catch (e) {
      console.error("Error removing wrong word:", e);
    }
  };

  const clearWrongWords = () => {
    localStorage.removeItem(storageKey);
    window.dispatchEvent(new Event("wrong-words-changed"));
  };

  return {
    wrongWords,
    addWrongWord,
    removeWrongWord,
    clearWrongWords,
  };
};