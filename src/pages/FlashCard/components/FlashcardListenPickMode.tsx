import { Flashcard } from "./FlashcardList";
import { RefreshCcw, Volume2 } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";

interface Props {
  flashcards: Flashcard[];
}

const MIN_CARD_COUNT = 9;
const BOARD_SIZE = 9;

const speak = (text: string, lang = "en-US", rate = 0.9) => {
  if (!window.speechSynthesis || !text) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = rate;
  window.speechSynthesis.speak(utterance);
};

const shuffle = <T,>(items: T[]) => {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const getRandomCardNotInBoard = (all: Flashcard[], currentBoard: Flashcard[]) => {
  const usedIds = new Set(currentBoard.map(c => c._id || c.word));
  const candidates = all.filter(c => !usedIds.has(c._id || c.word));
  if (candidates.length === 0) return currentBoard[0];
  return candidates[Math.floor(Math.random() * candidates.length)];
};

const FlashcardListenPickMode: React.FC<Props> = ({ flashcards }) => {
  const [board, setBoard] = useState<Flashcard[]>([]);
  const [targetIndex, setTargetIndex] = useState(0);
  const [wrongIndices, setWrongIndices] = useState<number[]>([]);
  const [hasFoundCorrect, setHasFoundCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);

  const canPlay = flashcards.length >= MIN_CARD_COUNT;
  const targetCard = useMemo(() => board[targetIndex] ?? null, [board, targetIndex]);

  const generateRound = useCallback(() => {
    if (!canPlay) return;
    const nextBoard = shuffle(flashcards).slice(0, BOARD_SIZE);
    const nextTargetIndex = Math.floor(Math.random() * nextBoard.length);

    setBoard(nextBoard);
    setTargetIndex(nextTargetIndex);
    setWrongIndices([]);
    setHasFoundCorrect(false);
    setRound((prev) => prev + 1);
  }, [canPlay, flashcards]);

  useEffect(() => {
    setScore(0);
    setRound(1);
    generateRound();
  }, [generateRound]);

  useEffect(() => {
    if (targetCard && !hasFoundCorrect) {
      speak(targetCard.word, "en-US", 0.95);
    }
  }, [targetCard, hasFoundCorrect]);

  const handleSelect = (index: number) => {
    if (wrongIndices.includes(index) || hasFoundCorrect) return;

    const selectedCard = board[index];

    if (index === targetIndex) {
      setHasFoundCorrect(true);
      setScore((prev) => prev + 1);
      speak(selectedCard.word, "en-US", 1.05);

      setTimeout(() => {
        generateRound();
      }, 2200);
    } else {
      speak(selectedCard.word, "en-US", 0.8);

      setWrongIndices((prev) => [...prev, index]);

      setTimeout(() => {
        setBoard((prevBoard) => {
          const newBoard = [...prevBoard];
          const replacement = getRandomCardNotInBoard(flashcards, prevBoard);
          newBoard[index] = replacement;
          return newBoard;
        });

        setWrongIndices((prev) => prev.filter((i) => i !== index));
      }, 600);
    }
  };

  const handleRefresh = () => {
    generateRound();
  };

  if (!canPlay) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
          <span className="text-3xl">😕</span>
        </div>
        <p className="text-xl font-semibold text-gray-700 mb-2">Chưa đủ số lượng thẻ flashcard!</p>
        <p className="text-gray-500">Cần ít nhất 9 flashcards cho chế độ này.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-600">Round {round}</p>
          <h3 className="text-xl font-bold text-gray-900">Nghe và chọn đúng từ</h3>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => targetCard && speak(targetCard.word, "en-US", 1.0)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-sm">
            <Volume2 className="w-5 h-5" />
            Nghe lại
          </button>
          <button onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition shadow-sm">
            <RefreshCcw className="w-5 h-5" />
            Làm mới
          </button>
        </div>
      </div>

      {/* Board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 lg:gap-6">
        {board.map((card, index) => {
          const isAnimatingWrong = wrongIndices.includes(index);
          const isCorrect = hasFoundCorrect && index === targetIndex;

          return (
            <button
              type="button"
              key={`${card._id ?? card.word}-${index}-${round}`}
              onClick={() => handleSelect(index)}
              disabled={isAnimatingWrong || hasFoundCorrect}
              className={`relative text-left p-6 rounded-2xl border-2 bg-white transition-all duration-500 transform
                ${!hasFoundCorrect && wrongIndices.length === 0
                  ? "border-gray-200 hover:border-blue-400 hover:shadow-lg hover:-translate-y-1 active:scale-98"
                  : ""}
                ${isAnimatingWrong
                  ? "border-red-500 bg-red-50/70 scale-95 opacity-90 animate-pulse-short"
                  : ""}
                ${isCorrect
                  ? "border-emerald-500 bg-emerald-50 shadow-lg scale-105"
                  : ""}
              `}
            >
              <p className="text-xs text-gray-400 mb-2">Thẻ {index + 1}</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{card.word}</p>
              <p className="text-sm text-gray-600 line-clamp-3">{card.meaning}</p>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex items-center bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800 rounded-full px-5 py-2.5 font-bold shadow-sm">
          Điểm: {score}
        </div>

        {hasFoundCorrect ? (
          <p className="font-semibold text-emerald-600">Chính xác! +1 điểm • Đang chuyển round...</p>
        ) : wrongIndices.length > 0 ? (
          <p className="text-sm text-gray-600">Sai rồi! Ô sẽ thay từ mới...</p>
        ) : (
          <p className="text-gray-600">Nghe kỹ và chọn thẻ đúng.</p>
        )}
      </div>
    </div>
  );
};

export default FlashcardListenPickMode;