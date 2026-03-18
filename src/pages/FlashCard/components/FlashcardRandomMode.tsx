import React, { useEffect, useMemo, useState } from "react";
import FlashcardItem from "./FlashcardItem";
import { HelpCircle } from "lucide-react";

export interface Flashcard {
  _id?: string;
  word: string;
  meaning: string;
  example?: string;
  note?: string;
  level?: "easy" | "medium" | "hard";
  isKnown?: boolean;
}

interface Props {
  flashcards: Flashcard[];
  editable: boolean;
  onDelete?: (id: string) => void;
  onUpdateFlashcards: (cards: Flashcard[]) => void;
  setId?: string;
}

const FlashcardRandomMode: React.FC<Props> = ({
  flashcards,
  editable,
  onDelete,
  onUpdateFlashcards,
  setId,
}) => {
  const PROGRESS_KEY = setId ? `flashcard_progress_${setId}` : null;

  const [currentId, setCurrentId] = useState<string | null>(() => {
    if (!PROGRESS_KEY) return null;
    try {
      const saved = localStorage.getItem(PROGRESS_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        return typeof data.currentId === "string" ? data.currentId : null;
      }
    } catch {}
    return null;
  });

  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    if (!PROGRESS_KEY || !currentId) return;
    try {
      localStorage.setItem(
        PROGRESS_KEY,
        JSON.stringify({
          currentId,
          lastUpdated: Date.now(),
        })
      );
    } catch (e) {
      console.warn("Lưu localStorage lỗi:", e);
    }
  }, [currentId]);

  const activeCards = useMemo(
    () => flashcards.filter((c) => !c.isKnown),
    [flashcards]
  );

  const getWeight = (level: "easy" | "medium" | "hard" = "medium") => {
    switch (level) {
      case "easy":   return 1;
      case "medium": return 2;
      case "hard":   return 4;
      default:       return 2;
    }
  };

  const pickNextCard = () => {
    if (activeCards.length === 0) return null;

    const candidates: { card: Flashcard; weight: number }[] = [];

    activeCards.forEach((card) => {
      if (!card._id) return;
      const weight = getWeight(card.level);
      candidates.push({ card, weight });
    });

    if (candidates.length === 0) return null;

    const totalWeight = candidates.reduce((sum, c) => sum + c.weight, 0);
    let random = Math.random() * totalWeight;

    for (const { card, weight } of candidates) {
      if (random < weight) return card;
      random -= weight;
    }

    return candidates[candidates.length - 1]?.card || null;
  };

  useEffect(() => {
    if (activeCards.length === 0) {
      setCurrentId(null);
      return;
    }

    const stillValid = currentId && activeCards.some((c) => c._id === currentId);

    if (!stillValid) {
      const next = pickNextCard();
      if (next?._id) {
        setCurrentId(next._id);
      }
    }
  }, [activeCards]);

  const currentCard = useMemo(
    () => flashcards.find((c) => c._id === currentId) || null,
    [flashcards, currentId]
  );

  const handleNext = () => {
    const next = pickNextCard();
    if (next?._id) {
      setCurrentId(next._id);
    }
  };

  const updateLevel = (level: "easy" | "medium" | "hard") => {
    if (!currentCard?._id) return;
    const updated = flashcards.map((c) =>
      c._id === currentCard._id ? { ...c, level } : c
    );
    onUpdateFlashcards(updated);
    setTimeout(handleNext, 200);
  };

  const markAsKnown = () => {
    if (!currentCard?._id) return;
    const updated = flashcards.map((c) =>
      c._id === currentCard._id ? { ...c, isKnown: true } : c
    );
    onUpdateFlashcards(updated);
    handleNext();
  };

  const resetProgress = () => {
    if (PROGRESS_KEY) {
      localStorage.removeItem(PROGRESS_KEY);
    }

    const resetKnown = flashcards.map((card) => ({
      ...card,
      isKnown: false,
    }));

    onUpdateFlashcards(resetKnown);
    setCurrentId(null);

    setTimeout(() => {
      const next = pickNextCard();
      if (next?._id) {
        setCurrentId(next._id);
      }
    }, 100);
  };

  if (flashcards.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
          <span className="text-3xl">😕</span>
        </div>
        <p className="text-xl font-semibold text-gray-700 mb-2">
          Bạn chưa có flashcards!
        </p>
        <p className="text-gray-500">
          Hãy tạo flashcard để trải nghiệm chức năng này
        </p>
      </div>
    );
  }

  if (activeCards.length === 0) {
    return (
      <div className="text-center py-16 text-gray-600">
        <p className="text-2xl font-semibold mb-4">Hoàn thành rồi! 🎉</p>
        <p className="mb-6">Bạn đã học hết các thẻ trong bộ này.</p>
        <button onClick={resetProgress} className="px-8 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600">Học lại từ đầu</button>
      </div>
    );
  }

  if (!currentCard) {
    return <div className="text-center py-10 text-gray-500">Đang tải thẻ...</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-[60vh] pb-12">
      <div className="w-full max-w-lg mb-10">
        <FlashcardItem
          flashcard={currentCard}
          onDelete={
            editable && onDelete
              ? () => onDelete(currentCard._id!)
              : undefined
          }
        />
      </div>

      {/* Difficulty + Help */}
      <div className="flex items-center gap-2 mb-2 relative">
        <span className="text-sm text-gray-500">Độ khó</span>

        <div className="cursor-pointer text-gray-400 hover:text-gray-600"
          onMouseEnter={() => setShowTip(true)}
          onMouseLeave={() => setShowTip(false)}>
          <HelpCircle size={18} />
        </div>

        {showTip && (
          <div className="absolute top-8 left-0 bg-white border rounded-lg shadow-lg p-3 text-sm w-64 z-10">
            <p className="font-semibold mb-1">Cách hoạt động:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Dễ: Ít xuất hiện lại</li>
              <li>Trung bình: Mức bình thường</li>
              <li>Khó: Xuất hiện nhiều hơn</li>
              <li>Đã biết: Không xuất hiện nữa</li>
            </ul>
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-10">
        <button onClick={() => updateLevel("easy")}
          className="min-w-[100px] px-6 py-4 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-medium rounded-xl transition shadow-sm hover:shadow">
          Dễ
        </button>
        <button onClick={() => updateLevel("medium")}
          className="min-w-[100px] px-6 py-4 bg-amber-100 hover:bg-amber-200 text-amber-800 font-medium rounded-xl transition shadow-sm hover:shadow">
          Trung bình
        </button>
        <button onClick={() => updateLevel("hard")}
          className="min-w-[100px] px-6 py-4 bg-rose-100 hover:bg-rose-200 text-rose-800 font-medium rounded-xl transition shadow-sm hover:shadow">
          Khó
        </button>
        <button onClick={markAsKnown}
          className="min-w-[100px] px-6 py-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-xl transition shadow-sm hover:shadow">
          Đã biết
        </button>
      </div>

      <button onClick={resetProgress}
        className="text-sm text-gray-500 underline hover:text-gray-700">
        Reset tiến trình học
      </button>
    </div>
  );
};

export default FlashcardRandomMode;