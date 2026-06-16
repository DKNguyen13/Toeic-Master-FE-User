import FlashcardItem from "../FlashcardItem";
import { HelpCircle, RotateCw, Trophy } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
  onEdit?: (flashcard: Flashcard) => void;
  onUpdateFlashcards: (cards: Flashcard[]) => void;
  setId?: string;
}

const WEIGHTS: Record<string, number> = { easy: 1, medium: 2, hard: 4 };

function pickWeighted(pool: Flashcard[], excludeId?: string | null): Flashcard | null {
  const candidates = pool.filter((c) => c._id && c._id !== excludeId);
  const source = candidates.length > 0 ? candidates : pool.filter((c) => c._id);
  if (source.length === 0) return null;

  const total = source.reduce((s, c) => s + (WEIGHTS[c.level ?? "medium"] ?? 2), 0);
  let r = Math.random() * total;
  for (const c of source) {
    const w = WEIGHTS[c.level ?? "medium"] ?? 2;
    if (r < w) return c;
    r -= w;
  }
  return source[source.length - 1];
}

const FlashcardRandomMode: React.FC<Props> = ({
  flashcards,
  editable,
  onDelete,
  onEdit,
  onUpdateFlashcards,
  setId,
}) => {
  const PROGRESS_KEY = setId ? `flashcard_progress_${setId}` : null;

  const [currentId, setCurrentId] = useState<string | null>(() => {
    if (!PROGRESS_KEY) return null;
    try {
      const saved = localStorage.getItem(PROGRESS_KEY);
      return saved ? (JSON.parse(saved).currentId ?? null) : null;
    } catch {
      return null;
    }
  });

  const [showTip, setShowTip] = useState(false);
  const [animating, setAnimating] = useState(false);
  const nextTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeCards = useMemo(() => flashcards.filter((c) => !c.isKnown), [flashcards]);
  const knownCount = flashcards.length - activeCards.length;
  const progress = flashcards.length ? Math.round((knownCount / flashcards.length) * 100) : 0;

  const currentCard = useMemo(
    () => flashcards.find((c) => c._id === currentId) ?? null,
    [flashcards, currentId]
  );

  // Sync currentId when active pool changes
  useEffect(() => {
    if (activeCards.length === 0) {
      setCurrentId(null);
      return;
    }
    if (!currentId || !activeCards.some((c) => c._id === currentId)) {
      setCurrentId(pickWeighted(activeCards)?._id ?? null);
    }
  }, [activeCards]); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist progress
  useEffect(() => {
    if (!PROGRESS_KEY || !currentId) return;
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify({ currentId, lastUpdated: Date.now() }));
    } catch (e) {
      console.warn("Lưu progress lỗi:", e);
    }
  }, [currentId, PROGRESS_KEY]);

  const goNext = useCallback(
    (excludeId?: string) => {
      if (nextTimer.current) clearTimeout(nextTimer.current);
      setAnimating(true);
      nextTimer.current = setTimeout(() => {
        setCurrentId(pickWeighted(activeCards, excludeId)?._id ?? null);
        setAnimating(false);
      }, 160);
    },
    [activeCards]
  );

  const updateLevel = useCallback(
    (level: "easy" | "medium" | "hard") => {
      if (!currentCard?._id) return;
      onUpdateFlashcards(
        flashcards.map((c) => (c._id === currentCard._id ? { ...c, level } : c))
      );
      goNext(currentCard._id);
    },
    [currentCard, flashcards, onUpdateFlashcards, goNext]
  );

  const markAsKnown = useCallback(() => {
    if (!currentCard?._id) return;
    onUpdateFlashcards(
      flashcards.map((c) => (c._id === currentCard._id ? { ...c, isKnown: true } : c))
    );
    goNext(currentCard._id);
  }, [currentCard, flashcards, onUpdateFlashcards, goNext]);

  const resetProgress = useCallback(() => {
    if (PROGRESS_KEY) localStorage.removeItem(PROGRESS_KEY);
    const reset = flashcards.map((c) => ({ ...c, isKnown: false }));
    onUpdateFlashcards(reset);
    const next = pickWeighted(reset.filter((c) => !c.isKnown));
    setCurrentId(next?._id ?? null);
  }, [PROGRESS_KEY, flashcards, onUpdateFlashcards]);

  if (flashcards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-6xl mb-6">📇</div>
        <p className="text-2xl font-semibold text-gray-800 mb-2">Chưa có thẻ nào</p>
        <p className="text-gray-500 max-w-sm">Hãy tạo flashcard để bắt đầu ôn tập ngẫu nhiên</p>
      </div>
    );
  }

  if (!currentCard) {
    return <div className="text-center py-20 text-gray-400">Đang tải...</div>;
  }

  if (flashcards.length < 4) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
          <span className="text-3xl">😕</span>
        </div>
        <p className="text-xl font-semibold text-gray-700 mb-2">Chưa đủ flashcards!</p>
        <p className="text-gray-500">Cần ít nhất 4 flashcards để bắt đầu chế độ ôn tập ngẫu nhiên</p>
      </div>
    );
  }

  if (activeCards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Trophy className="w-20 h-20 text-yellow-500 mb-6" />
        <p className="text-xl font-bold text-gray-800 mb-3">Chúc mừng!</p>
        <p className="text-md text-gray-600 mb-8">Bạn đã hoàn thành toàn bộ bộ thẻ</p>
        <button onClick={resetProgress}
          className="flex items-center gap-3 px-8 py-4 bg-blue-500 text-white rounded-2xl font-semibold text-lg hover:scale-105 transition-all shadow-lg">
          <RotateCw className="w-5 h-5" />
          Học lại từ đầu
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-[70vh] pb-12 px-4">
      {/* Progress bar */}
      <div className="w-full max-w-xl mb-8">
        <div className="flex justify-between text-sm mb-2.5 text-gray-600">
          <span>Tiến độ</span>
          <span className="font-medium text-gray-600">
            {knownCount} / {flashcards.length}
          </span>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-500 transition-all duration-500" style={{ width: `${progress}%` }}/>
        </div>
      </div>

      {/* Card */}
      <div className={`w-full max-w-xl transition-all duration-[160ms] ${animating ? "scale-[0.97] opacity-60" : "scale-100 opacity-100"}`}>
        <FlashcardItem
          flashcard={currentCard}
          onDelete={editable && onDelete ? () => onDelete(currentCard._id!) : undefined}
          onEdit={editable && onEdit ? () => onEdit(currentCard) : undefined}
        />
      </div>

      {/* Difficulty buttons */}
      <div className="mt-10 w-full max-w-xl">
        <div className="flex items-center justify-center gap-2 mb-6 relative">
          <span className="text-sm font-medium text-gray-500">
            Bạn cảm thấy thẻ này như thế nào?
          </span>
          <button className="text-gray-400 hover:text-gray-600 transition"
            onMouseEnter={() => setShowTip(true)}
            onMouseLeave={() => setShowTip(false)}
            aria-label="Hướng dẫn">
            <HelpCircle size={18} />
          </button>

          {showTip && (
            <div className="absolute top-7 z-20 bg-white border border-gray-200 rounded-2xl shadow-xl p-5 text-sm w-72">
              <p className="font-semibold mb-2">Hệ thống spacing:</p>
              <ul className="space-y-1.5 text-gray-600">
                <li>• <strong>Dễ</strong>: Giảm tần suất xuất hiện</li>
                <li>• <strong>Trung bình</strong>: Bình thường</li>
                <li>• <strong>Khó</strong>: Tăng tần suất</li>
                <li>• <strong>Đã biết</strong>: Loại khỏi vòng học</li>
              </ul>
            </div>
          )}
        </div>

        <div className="grid grid-cols-4 gap-5">
          <button onClick={() => updateLevel("easy")}
            className="py-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 hover:border-emerald-300 rounded-2xl font-medium text-emerald-700 transition-all active:scale-95 flex flex-col items-center gap-1">
            <span>Dễ</span>
          </button>

          <button onClick={() => updateLevel("medium")}
            className="py-4 bg-amber-50 hover:bg-amber-100 border border-amber-200 hover:border-amber-300 rounded-2xl font-medium text-amber-700 transition-all active:scale-95 flex flex-col items-center gap-1">
            <span>TB</span>
          </button>

          <button onClick={() => updateLevel("hard")}
            className="py-4 bg-rose-50 hover:bg-rose-100 border border-rose-200 hover:border-rose-300 rounded-2xl font-medium text-rose-700 transition-all active:scale-95 flex flex-col items-center gap-1">
            <span>Khó</span>
          </button>

          <button onClick={markAsKnown}
            className="py-4 bg-gray-500 text-white rounded-2xl font-semibold shadow-md hover:shadow-xl transition-all active:scale-95 flex flex-col items-center gap-1">
            <span>Đã biết</span>
          </button>
        </div>
      </div>

      {/* Reset */}
      <button onClick={resetProgress} className="mt-10 text-sm text-gray-400 hover:text-gray-600 underline transition">
        Reset toàn bộ tiến trình
      </button>
    </div>
  );
};

export default FlashcardRandomMode;