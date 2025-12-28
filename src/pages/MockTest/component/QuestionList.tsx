import React from "react";
import QuestionItem from "./QuestionItem";
import GroupQuestion from "./GroupQuestion";
import { AnswerState, Question } from "../interface/interfaces";

interface QuestionListProps {
  isView: boolean;
  questionsInPart: Question[];
  answers: Record<string, AnswerState>;
  handleAnswer?: (questionId: string, optionIndex: number) => void;
}

const groupQuestions = (questions: Question[]) => {
  const groups: Record<string, any[]> = {};
  const singles: any[] = [];

  questions.forEach((q) => {
    if ([1, 3, 4, 6, 7].includes(q.partNumber) && q.group.groupId) {
      const groupId = q.group.groupId;
      if (!groups[groupId]) groups[groupId] = [];
      groups[groupId].push(q);
    } else {
      singles.push(q); // câu đơn lẻ: part 1,2,5
    }
  });

  return { groups: Object.values(groups), singles };
};

const QuestionList: React.FC<QuestionListProps> = ({
  questionsInPart,
  answers,
  handleAnswer,
  isView,
}) => {
  const { groups, singles } = groupQuestions(questionsInPart);

  return (
    <div className="w-full max-w-7xl">
      {/* Nhóm câu (Part 1,3,4,6,7) */}
      {groups.map((group, index) => (
        <GroupQuestion
          key={`${group[0].groupId}-${index}`}
          group={group}
          questionsInPart={questionsInPart}
          answers={answers}
          handleAnswer={handleAnswer}
          isView={isView}
        />
      ))}

      {/* Các câu đơn lẻ (Part 1,2,5) */}
      <div className="w-full flex flex-col gap-6">
        {singles.map((question, idx) => (
          <div key={idx} className="w-full max-w-4xl mx-auto px-4">
            <QuestionItem
              isView={isView}
              question={question}
              questionIndex={questionsInPart.findIndex(
                (q) => q.id === question.id
              )}
              answers={answers}
              handleAnswer={handleAnswer}
              hideImage={false} // vẫn hiển thị ảnh nếu có
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionList;
