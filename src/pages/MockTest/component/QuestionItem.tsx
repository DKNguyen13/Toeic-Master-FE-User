import React, { useState } from "react";
import { Choice } from "../interface/interfaces";

interface QuestionItemProps {
  isView: boolean;
  question: {
    _id: string;
    question: string;
    globalQuestionNumber: number;
    partNumber?: number;
    group: { audio?: string; image?: string; text?: string; groupId?: string };
    choices: Choice[];
    explanation: string;
  };
  questionIndex: number;
  answers?: (string | null)[];
  handleAnswer?: (questionIndex: number, optionIndex: number) => void;
  hideImage?: boolean; 
}

const QuestionItem: React.FC<QuestionItemProps> = ({
  isView,
  question,
  questionIndex,
  answers,
  handleAnswer,
  hideImage = false, // mặc định false
}) => {
  const indexToLetter = ["A", "B", "C", "D"];
  const partNumber = question.partNumber ?? 0;

  const [isExplanationOpen, setIsExplanationOpen] = useState(false);

  const selected =
    answers && answers.length >= question.globalQuestionNumber
      ? answers[question.globalQuestionNumber - 1]
      : null;

  const correctChoice = question.choices.find((c) => c.isCorrect);
  const correctLetter = correctChoice ? correctChoice.label : null;

  const userChoice = question.choices.find((c) => c.isUserChoice);
  const isUserWrong =
    isView && userChoice && userChoice.label !== correctLetter;
  const isUserSkipped = isView && !userChoice;
  const showCorrectAns = isUserWrong || isUserSkipped;

  const shouldHideContent = !isView && (partNumber === 1 || partNumber === 2);

  const getButtonStyle = (option: Choice, optionIndex: number): string => {
    const optionLetter = indexToLetter[optionIndex];

    if (!isView) {
      return selected === optionLetter
        ? "bg-blue-500 text-white border-blue-600"
        : "hover:bg-gray-200 border-gray-300";
    }

    if (option.isUserChoice && option.isCorrect) {
      return "bg-green-500 text-white border-green-600";
    }
    if (option.isUserChoice && !option.isCorrect) {
      return "bg-red-500 text-white border-red-600";
    }

    return "bg-gray-100 border-gray-300";
  };

  return (
    <div
      id={`question-${question.globalQuestionNumber}`}
      className="mb-4 border-b border-gray-200 pb-4"
    >
      {/* Chỉ hiển thị ảnh nếu không bị hide */}
      {!hideImage && question.group.image && (
        <img
          src={question.group.image}
          alt={`question-${question.globalQuestionNumber}`}
          className="mb-2 max-w-md w-full h-auto mx-auto rounded-lg"
        />
      )}

      <div className="flex items-start space-x-3 mb-4">
        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold text-sm mt-1">
          {question.globalQuestionNumber}
        </div>
        {!shouldHideContent && question.question && (
          <div className="flex-1 pt-1">
            <p className="text-gray-800">{question.question}</p>
          </div>
        )}
      </div>

      {question.choices?.map((option, optionIndex) => (
        <button
          key={option._id}
          onClick={() => {
            if (!isView && handleAnswer) {
              handleAnswer(questionIndex, optionIndex);
            }
          }}
          className={`border p-2 rounded-md w-full text-left mb-2 transition-colors duration-150 ${getButtonStyle(
            option,
            optionIndex
          )}`}
        >
          {shouldHideContent
            ? `${option.label}`
            : `${option.label}. ${option.text}`}
        </button>
      ))}

      {showCorrectAns && correctLetter && (
        <p className="text-sm text-green-600 font-semibold mt-2">
          Đáp án đúng: {correctLetter}
        </p>
      )}

      {/* --- Phần hiển thị giải thích (Dropdown) --- */}
      {isView && question.explanation && (
        <div className="mt-3">
          <button
            onClick={() => setIsExplanationOpen(!isExplanationOpen)}
            className="flex items-center justify-start text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span>
              {isExplanationOpen ? "Ẩn giải thích" : "Xem giải thích"}
            </span>
            {/* Icon Chevron */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ml-1 transition-transform duration-200 ${
                isExplanationOpen ? "rotate-180" : "rotate-0"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Nội dung giải thích */}
          {isExplanationOpen && (
            <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-md shadow-sm">
              <p className="text-gray-700 text-sm whitespace-pre-wrap">
                {question.explanation}
              </p>
            </div>
          )}
        </div>
      )}
      {/* ------------------------------------------------- */}
    </div>
  );
};

export default QuestionItem;
