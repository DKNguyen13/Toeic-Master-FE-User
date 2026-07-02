import { CheckCircle2 } from "lucide-react";
import { Flashcard } from "../../types/flashcardModes";
import React, { useEffect, useState, useRef } from "react";

interface Props {
  flashcards: Flashcard[];
  onWrongAnswer?: (card: Flashcard) => void;
}

const FlashcardTrueFalseMode: React.FC<Props> = ({ flashcards, onWrongAnswer }) => {
  const [current, setCurrent] = useState<Flashcard | null>(null);
  const [displayMeaning, setDisplayMeaning] = useState("");
  const [isCorrectPair, setIsCorrectPair] = useState(true);
  const [answered, setAnswered] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [index, setIndex] = useState(0);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const speak = (text: string) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    utter.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  const generateQuestion = () => {
    if (!flashcards.length) return;

    const random = flashcards[Math.floor(Math.random() * flashcards.length)];
    const others = flashcards.filter((f) => f.word !== random.word);
    const correct = others.length === 0 ? true : Math.random() > 0.5;

    if (correct) {
      setCurrent(random);
      setDisplayMeaning(random.meaning);
      setIsCorrectPair(true);
    } else {
      const wrong = others[Math.floor(Math.random() * others.length)];

      setCurrent(random);
      setDisplayMeaning(wrong?.meaning || "");
      setIsCorrectPair(false);
    }

    setAnswered(false);
    setResult(null);
  };

  useEffect(() => {
    generateQuestion();
  }, [flashcards]);

  const next = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIndex((i) => i + 1);
    generateQuestion();
  };

  const handleAnswer = (choice: boolean) => {
    if (answered || !current) return;

    const isRight = choice === isCorrectPair;
    setResult(isRight);
    setAnswered(true);

    if (isRight) {
      setScore((s) => s + 1);
      speak(current.word);

      timeoutRef.current = setTimeout(() => {
        next();
      }, 900);
    } else {
      onWrongAnswer?.(current);
    }
  };

  if (flashcards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-10 h-10 text-indigo-400" />
        </div>
        <p className="text-lg font-semibold text-gray-700">Chưa có flashcard!</p>
        <p className="text-gray-400 mt-1 text-sm">Thêm ít nhất 1 thẻ để luyện Đúng / Sai.</p>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="text-center py-10 text-sm text-gray-500">
        Không có dữ liệu
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-5">

      {/* CARD */}
      <div className="relative bg-white mt-10 border border-gray-200 rounded-2xl p-7 text-center shadow-md hover:shadow-lg transition overflow-hidden">

        {/* glow background */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-100 rounded-full blur-2xl opacity-40" />

        {/* WORD */}
        <div className="mb-8 space-y-1 relative">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Từ vựng</p>
          <p className="text-3xl font-bold text-gray-900 tracking-tight">{current.word}</p>
        </div>

        {/* MEANING */}
        <div className="mb-8 space-y-1 relative">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Nghĩa</p>
          <p className={`text-lg font-medium transition ${answered && result === false
            ? "text-red-400 line-through"
            : answered && result === true
              ? "text-green-600"
              : "text-gray-700"
            }`}
          >
            {displayMeaning}
          </p>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-10 relative">
          <button onClick={() => handleAnswer(true)}
            className="flex-1 py-3 rounded-xl border border-green-200 bg-green-50 text-green-500 font-semibold hover:bg-green-500 hover:text-white hover:border-green-600 active:scale-95 transition text-sm">
            Đúng
          </button>

          <button onClick={() => handleAnswer(false)}
            className="flex-1 py-3 rounded-xl border border-red-200 bg-red-50 text-red-700 font-semibold hover:bg-red-500 hover:text-white hover:border-red-500 active:scale-95 transition text-sm">
            Sai
          </button>
        </div>

        {/* RESULT */}
        {answered && (
          <div className="mt-6 text-center text-sm">
            {result ? (
              <div className="text-green-600 font-semibold">
                🎉 Chính xác
              </div>
            ) : (
              <div className="text-gray-900">
                Sai rồi, đáp án đúng:{" "}
                <span className="text-red-500 font-semibold">
                  {current.meaning}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* NEXT BUTTON */}
      {answered && (
        <button onClick={next} className="w-full py-3 rounded-xl bg-gray-900 text-white
          hover:bg-black active:scale-95 transition text-sm font-semibold">
          Câu tiếp →
        </button>
      )}
    </div>
  );
};

export default FlashcardTrueFalseMode;