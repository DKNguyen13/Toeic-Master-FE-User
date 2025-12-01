import React from "react";
import QuestionItem from "./QuestionItem";
import { AnswerState, Question } from "../interface/interfaces";

interface groupQuestionProps {
    group: Question[];
    questionsInPart: Question[];
    answers: AnswerState[];
    handleAnswer ?: (questionIndex: number, optionIndex: number) => void;
    isView: boolean;
}

const GroupQuestion: React.FC<groupQuestionProps> = ({
    group,
    questionsInPart,
    answers,
    handleAnswer,
    isView
}) => {
    const firstQuestion = group[0];
    const images: string[] = Array.isArray(firstQuestion.group.image) ? firstQuestion.group.image : [];
    const hasImage = images.length > 0;

    return <>
    <div className="mb-4 flex flex-col md:flex-row gap-4 border-b border-gray-200 pb-4">
      {/* Cột trái: image */}
      {hasImage && (
        <div className="md:w-1/2 w-full overflow-auto max-h-[600px] flex flex-col gap-3">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`group-${idx}`}
              className="rounded-lg max-w-full object-contain"
            />
          ))}
        </div>
      )}

      {/* Cột phải: danh sách câu hỏi trong group */}
      <div
        className={`flex flex-col gap-4 pr-2 ${
          hasImage ? "md:w-1/2 w-full overflow-auto max-h-[600px]" : "w-full"
        }`}
      >
        {group.map((question) => (
          <QuestionItem
            key={question.id}
            isView={isView}
            question={question}
            questionIndex={questionsInPart.findIndex((q) => q.id === question.id)}
            answers={answers}
            handleAnswer={handleAnswer}
            hideImage={hasImage} // nếu có ảnh nhóm thì ẩn ảnh trong item
            hideBorder = {true}
          />
        ))}
      </div>
    </div>
    </>
};

export default GroupQuestion;