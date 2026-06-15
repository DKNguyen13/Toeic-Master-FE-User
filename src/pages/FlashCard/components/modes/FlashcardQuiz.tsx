import React from "react";

interface Flashcard {
  word: string;
  meaning: string;
}

interface QuizModeProps {
  canQuiz: boolean;
  quizDirection: "en2vi" | "vi2en";
  correctCard: Flashcard | null;
  quizOptions: string[];
  selectedOption: string | null;
  score: number;
  onSelectOption: (opt: string) => void;
  onNext: () => void;
}

const FlashcardQuiz: React.FC<QuizModeProps> = ({
  canQuiz,
  quizDirection,
  correctCard,
  quizOptions,
  selectedOption,
  score,
  onSelectOption,
  onNext,
}) => {
  if (!canQuiz) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
          <span className="text-3xl">😕</span>
        </div>
        <p className="text-xl font-semibold text-gray-700 mb-2">
          Chưa đủ flashcards!
        </p>
        <p className="text-gray-500">
          Cần ít nhất 4 flashcards để chơi trắc nghiệm
        </p>
      </div>
    );
  }

  const correctAnswer = quizDirection === "en2vi" ? correctCard?.meaning : correctCard?.word;

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Quiz Mode</h2>
              <p className="text-gray-600 text-sm">
                {quizDirection === "en2vi"
                  ? "English → Vietnamese"
                  : "Vietnamese → English"}
              </p>
            </div>

            <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 px-4 py-2 rounded-full shadow-sm">
              <span className="text-xl">🏆</span>
              <span className="font-bold text-gray-800">
                {score}
              </span>
            </div>
          </div>

          {/* QUESTION */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {quizDirection === "en2vi"
                ? correctCard?.word
                : correctCard?.meaning}
            </h2>
            <p className="text-gray-600">Chọn đáp án đúng</p>
          </div>

          {/* OPTIONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {quizOptions.map((opt, index) => (
              <button
                key={opt}
                onClick={() => onSelectOption(opt)}
                disabled={!!selectedOption}
                className={`p-4 rounded-2xl border-2 text-left font-medium transition-all duration-300 transform ${
                  selectedOption
                    ? opt === correctAnswer
                      ? "bg-green-100 border-green-400 text-green-800 scale-105"
                      : opt === selectedOption
                      ? "bg-red-100 border-red-400 text-red-800"
                      : "bg-gray-50 border-gray-200 text-gray-500"
                    : "bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:scale-105 cursor-pointer"
                }`}
              >
                <div className="flex items-center">
                  <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold mr-3">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {opt}
                </div>
              </button>
            ))}
          </div>

          {/* NEXT */}
          {selectedOption && (
            <div className="text-center">
              <button
                onClick={onNext}
                className="px-8 py-3 bg-blue-500 text-white rounded-2xl font-semibold hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Tiếp theo →
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default FlashcardQuiz;