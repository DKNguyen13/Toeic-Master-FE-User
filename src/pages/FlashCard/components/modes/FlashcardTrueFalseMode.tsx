import { Flashcard } from "../../types/flashcardModes";
import React, { useEffect, useState, useRef } from "react";

interface Props {
  flashcards: Flashcard[];
}

const FlashcardTrueFalseMode: React.FC<Props> = ({ flashcards }) => {
  const [current, setCurrent] = useState<Flashcard | null>(null);
  const [displayMeaning, setDisplayMeaning] = useState("");
  const [isCorrectPair, setIsCorrectPair] = useState(true);
  const [answered, setAnswered] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [index, setIndex] = useState(0);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Text to Speech
  const speak = (text: string) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    utter.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  // Generate question
  const generateQuestion = () => {
    if (flashcards.length === 0) return;

    const randomCard =
      flashcards[Math.floor(Math.random() * flashcards.length)];

    const shouldBeCorrect = Math.random() > 0.5;

    if (shouldBeCorrect) {
      setCurrent(randomCard);
      setDisplayMeaning(randomCard.meaning);
      setIsCorrectPair(true);
    } else {
      const otherCards = flashcards.filter(f => f.word !== randomCard.word);
      const wrong =
        otherCards[Math.floor(Math.random() * otherCards.length)];

      setCurrent(randomCard);
      setDisplayMeaning(wrong.meaning);
      setIsCorrectPair(false);
    }

    setAnswered(false);
    setResult(null);
  };

  useEffect(() => {
    generateQuestion();
  }, [flashcards]);

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Handle answer
  const handleAnswer = (userChoice: boolean) => {
    if (answered) return;

    const isRight = userChoice === isCorrectPair;
    setResult(isRight);
    setAnswered(true);

    if (isRight) {
      setScore(prev => prev + 1);

      if (current?.word) speak(current.word);

      timeoutRef.current = setTimeout(() => {
        nextQuestion();
      }, 1000);
    }
  };

  // Next
  const nextQuestion = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIndex(prev => prev + 1);
    generateQuestion();
  };

  if (!current) {
    return <div className="text-center py-10">Không có dữ liệu</div>;
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
        <span>Câu: {index + 1}</span>
        <span>Điểm: {score}</span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-200 rounded-full mb-4">
        <div
          className="h-2 bg-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${(index % 20) * 5}%` }}
        />
      </div>

      {/* Card */}
      <div
        className={`rounded-3xl px-8 py-12 text-center shadow-xl border transition-all duration-300 min-h-[320px] flex flex-col justify-center
        ${
          answered
            ? result
              ? "border-green-400 bg-gradient-to-br from-green-50 to-white"
              : "border-red-400 bg-gradient-to-br from-red-50 to-white"
            : "border-gray-200 bg-white"
        }`}
      >
        {/* Word - Meaning */}
        <div className="mb-10 text-center space-y-6">
            {/* WORD */}
            <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                Từ vựng
                </p>
                <p className="text-4xl font-bold text-blue-600 tracking-wide">
                {current.word}
                </p>
            </div>

            {/* MEANING */}
            <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                Nghĩa
                </p>
                <p
                className={`text-xl font-medium transition ${
                    answered && result === false
                    ? "text-red-600"
                    : "text-gray-800"
                }`}
                >
                {displayMeaning}
                </p>
            </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button onClick={() => handleAnswer(true)}
            className="flex-1 py-2.5 rounded-3xl bg-gradient-to-r from-green-400 to-green-500 text-white font-semibold text-base shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
            Đúng
          </button>

          <button onClick={() => handleAnswer(false)}
            className="flex-1 py-2.5 rounded-3xl bg-gradient-to-r from-red-400 to-red-500 text-white font-semibold text-base shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
            Sai
          </button>
        </div>
        {/* Result */}
        {answered && (
          <div className="mt-8">
            {result ? (
              <p className="text-green-600 font-semibold text-xl animate-pulse">Chính xác!</p>
            ) : (
              <p className="text-red-600 font-semibold text-lg">
                ✘ Sai! Nghĩa đúng:{" "}
                <span className="font-bold">{current.meaning}</span>
              </p>
            )}
          </div>
        )}
      </div>

      {answered && result === false && (
        <button onClick={nextQuestion}
          className="mt-6 w-full py-4 rounded-2xl bg-blue-500 text-white font-semibold text-lg shadow-md hover:bg-blue-600 hover:shadow-lg active:scale-95 transition">
          Câu tiếp →
        </button>
      )}
    </div>
  );
};

export default FlashcardTrueFalseMode;