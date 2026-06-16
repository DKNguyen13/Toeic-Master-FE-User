import { RefreshCcw, Volume2, Trophy, Headphones } from "lucide-react";
import { Flashcard } from "../../types/flashcardModes";
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

const getRandomCardNotInBoard = (
  all: Flashcard[],
  currentBoard: Flashcard[]
) => {
  const usedIds = new Set(currentBoard.map((c) => c._id || c.word));

  const candidates = all.filter(
    (c) => !usedIds.has(c._id || c.word)
  );

  if (candidates.length === 0) return currentBoard[0];

  return candidates[Math.floor(Math.random() * candidates.length)];
};

const FlashcardListenPickMode: React.FC<Props> = ({ flashcards }) => {
  const [board, setBoard] = useState<Flashcard[]>([]);
  const [targetIndex, setTargetIndex] = useState(0);
  const [wrongIndices, setWrongIndices] = useState<number[]>([]);
  const [hasFoundCorrect, setHasFoundCorrect] = useState(false);
  const [replacingIndices, setReplacingIndices] = useState<number[]>([]);
  const canPlay = flashcards.length >= MIN_CARD_COUNT;

  const targetCard = useMemo(
    () => board[targetIndex] ?? null,
    [board, targetIndex]
  );

  const generateRound = useCallback(() => {
    if (!canPlay) return;

    const nextBoard = shuffle(flashcards).slice(0, BOARD_SIZE);
    const nextTargetIndex = Math.floor(
      Math.random() * nextBoard.length
    );

    setBoard(nextBoard);
    setTargetIndex(nextTargetIndex);
    setWrongIndices([]);
    setHasFoundCorrect(false);
  }, [canPlay, flashcards]);

  useEffect(() => {
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
      speak(selectedCard.word, "en-US", 1.05);
      setTimeout(() => {
        generateRound();
      }, 2200);
    } 
    else {
      speak(selectedCard.word, "en-US", 0.8);

      setWrongIndices((prev) => [...prev, index]);
      setTimeout(() => {
        setReplacingIndices((prev) => [...prev, index]);

        setWrongIndices((prev) =>
          prev.filter((i) => i !== index)
        );

        setTimeout(() => {
          setBoard((prevBoard) => {
            const newBoard = [...prevBoard];

            const replacement = getRandomCardNotInBoard(
              flashcards,
              prevBoard
            );

            newBoard[index] = replacement;

            return newBoard;
          });

          setReplacingIndices((prev) =>
            prev.filter((i) => i !== index)
          );
        }, 1000);
      }, 1000);
    }
  }

  const handleRefresh = () => {
    generateRound();
  };

  if (!canPlay) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
          <Headphones className="w-10 h-10 text-blue-500" />
        </div>
        <p className="text-xl font-semibold text-gray-700 mb-2">Chưa đủ flashcards!</p>
        <p className="text-gray-500">Hãy thêm flashcard để chơi chế độ tìm cặp</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-blue-50 to-cyan-50" />
          <div className="relative p-6">
            <div className="flex flex-col gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                  Listen & Pick
                </p>

                <h2 className="mt-2 flex items-center gap-2 text-lg font-bold text-slate-900">
                  <Headphones className="h-4 w-4 text-blue-600" />
                  Nghe và chọn đúng từ
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Nghe phát âm và chọn đúng từ tương ứng.
                </p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() =>
                    targetCard &&
                    speak(targetCard.word, "en-US", 1)
                  }
                  className="group inline-flex h-11 items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 font-semibold text-white shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <Volume2 className="h-5 w-5 group-hover:animate-pulse" />
                  Nghe lại
                </button>

                <button onClick={handleRefresh}
                  className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  <RefreshCcw className="h-5 w-5" />
                  Làm mới
                </button>
              </div>

              {hasFoundCorrect ? (
                <div className="inline-flex h-12 items-center rounded-2xl bg-emerald-100 px-5 text-sm font-semibold text-emerald-700 shadow-sm">
                  Chính xác! Đang chuyển sang round mới...
                </div>
              ) : wrongIndices.length > 0 ? (
                <div className="inline-flex h-12 items-center rounded-2xl bg-red-100 px-5 text-sm font-semibold text-red-600 shadow-sm">
                  Sai rồi! Đang thay từ mới...
                </div>
              ) : (
                <div className="inline-flex h-12 items-center rounded-2xl bg-blue-100 px-5 text-sm font-semibold text-blue-700 shadow-sm">
                  Nghe kỹ và chọn từ đúng
                </div>
              )}
            </div>
        </div>
      </div>

      {/* Board */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
        {board.map((card, index) => {
          const isReplacing = replacingIndices.includes(index);
          const isAnimatingWrong = wrongIndices.includes(index);
          const isCorrect = hasFoundCorrect && index === targetIndex;

          return (
            <button type="button"
              key={`${card._id ?? card.word}-${index}`}
              onClick={() => handleSelect(index)}
              disabled={
                isAnimatingWrong || hasFoundCorrect
              }
              className={`
                group
                relative
                overflow-hidden
                rounded-3xl
                border
                bg-white
                p-5
                text-left
                shadow-sm
                transition-all
                duration-300

                ${!hasFoundCorrect ? "border-slate-200 hover:-translate-y-1 hover:border-blue-400 hover:shadow-xl" : ""}
                ${isAnimatingWrong ? "border-red-500 bg-red-50 ring-2 ring-red-200" : ""}
                ${isReplacing ? "opacity-0 scale-90 pointer-events-none": ""}
                ${isCorrect ? "scale-105 border-emerald-500 bg-emerald-50 shadow-xl ring-4 ring-emerald-200" : ""}
              `}
            >
              <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                {index + 1}
              </div>

              <div className="mb-3 h-1.5 w-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
              <h3 className="mb-2 text-xl font-medium tracking-tight text-slate-900 md:text-2xl">{card.word}</h3>
              <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">{card.meaning}</p>

              {!hasFoundCorrect && (
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 opacity-0 transition-opacity group-hover:opacity-100" />
              )}

              {isCorrect && (
                <div className="absolute left-4 top-4">
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FlashcardListenPickMode;