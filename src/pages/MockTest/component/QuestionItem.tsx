import React, { useState } from "react";
import {
  AnswerState,
  Choice,
  Question,
  UserAnswerResult,
} from "../interface/interfaces";
import HighlightSelectableText from "./HighlightSelectableText";

interface QuestionItemProps {
  isView: boolean;
  question: Question;
  questionIndex: number;
  answers?: AnswerState[];
  handleAnswer?: (questionIndex: number, optionIndex: number) => void;
  hideImage?: boolean;
  hideBorder?: boolean;
}

const QuestionItem: React.FC<QuestionItemProps> = ({
  isView,
  question,
  questionIndex,
  answers,
  handleAnswer,
  hideImage = false, // mặc định false
  hideBorder
}) => {
  const indexToLetter = ["A", "B", "C", "D"];
  const partNumber = question.partNumber ?? 0;

  const [isExplanationOpen, setIsExplanationOpen] = useState(false);

  // Biến cho chế độ làm bài
  const selectedAnswer =
    !isView && answers?.[question.globalQuestionNumber - 1]?.selectedAnswer
      ? answers[question.globalQuestionNumber - 1].selectedAnswer
      : null;

  // Biến dùng khi review kết quả
  const answerResult: UserAnswerResult | undefined | null =
    question.answerResult;
  const reviewSelected = isView ? answerResult?.selectedAnswer ?? null : null;
  const reviewSkipped = isView ? answerResult?.isSkipped ?? true : false;
  const reviewCorrect = isView ? answerResult?.isCorrect ?? false : false;
  const correctLetter =
    question.choices.find((c) => c.isCorrect)?.label ?? null;

  const isReviewWrong =
    isView && reviewSelected && reviewSelected !== correctLetter;
  const showReviewCorrectAnswer = isView && (isReviewWrong || reviewSkipped);

  const shouldHideContent = !isView && (partNumber === 1 || partNumber === 2);

  const firstImage =
    Array.isArray(question.group.image) &&
    question.group.image.find(
      (img) =>
        typeof img === "string" &&
        img.trim() !== "" &&
        img !== "null" &&
        img !== "undefined"
    );

  // Hàm getButtonStyle – kết hợp cả làm bài và review
  const getButtonStyle = (option: Choice, optionIndex: number): string => {
    const optionLetter = indexToLetter[optionIndex];

    if (!isView) {
      // chế độ làm bài → dùng selected cũ
      return selectedAnswer === optionLetter
        ? "bg-blue-500 text-white border-blue-600"
        : "hover:bg-gray-200 border-gray-300";
    }

    // chế độ review → dùng reviewSelected
    if (reviewSelected === optionLetter) {
      // user chọn nút này
      return reviewCorrect
        ? "border-2 border-green-500 bg-green-50 text-green-700" // chọn đúng
        : "border-2 border-red-500 bg-red-50 text-red-700"; // chọn sai
    }

    // if (reviewSelected === null && reviewSkipped) {
    //   return "bg-yellow-100 border-yellow-400 text-yellow-700"; // câu bị skip
    // }

    return "bg-gray-100 border-gray-300";
  };

  return (
    <div
      id={`question-${question.globalQuestionNumber}`}
      className={`mb-4 pb-4 scroll-mt-[80px] ${!hideBorder ? "border-b border-gray-200" : ""}`}
    >
      {/* IMAGE */}
      {!hideImage && firstImage && (
        <img
          src={firstImage}
          alt={`question-${question.globalQuestionNumber}`}
          className="mb-2 max-w-md w-full h-auto mx-auto rounded-lg"
        />
      )}

      {/* QUESTION TEXT */}
      <div className="flex items-start space-x-3 mb-4">
        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold text-sm mt-1">
          {question.globalQuestionNumber}
        </div>
        {!shouldHideContent && question.question && (
          <div className="flex-1 pt-1">
            <HighlightSelectableText text={question.question} />
          </div>
        )}
      </div>

      {/* CHOICES */}
      {question.choices?.map((option, optionIndex) => (
        <button
          key={option._id}
          onClick={() => {
            if (!isView && handleAnswer)
              handleAnswer(questionIndex, optionIndex);
          }}
          className={`border p-2 rounded-md w-full text-left mb-2 transition-colors duration-150 ${getButtonStyle(
            option,
            optionIndex
          )}`}>
          {shouldHideContent ? (
            <span>{option.label}</span>
          ) : (
            <HighlightSelectableText text={`${option.label}. ${option.text}`} />
          )}
        </button>
      ))}

      {/* SHOW CORRECT ANSWER khi review */}
      {showReviewCorrectAnswer && correctLetter && (
        <p className="text-sm text-green-600 font-semibold mt-2">
          Đáp án đúng: {correctLetter}
        </p>
      )}

      {/* EXPLANATION từ answerResult */}
      {isView && answerResult?.explanation && (
        <div className="mt-3">
          <button
            onClick={() => setIsExplanationOpen(!isExplanationOpen)}
            className="flex items-center justify-start text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span>
              {isExplanationOpen ? "Ẩn giải thích" : "Xem giải thích"}
            </span>
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

          {isExplanationOpen && (
            <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-md shadow-sm">
              <p className="text-gray-700 text-sm whitespace-pre-wrap">
                {answerResult.explanation}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionItem;