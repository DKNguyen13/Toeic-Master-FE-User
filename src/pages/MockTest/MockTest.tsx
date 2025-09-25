import React from "react";
import ExamCard from "../Home/component/ExamCard";
import { toeicTest } from "../../data/toeicMockData";
import Navigation from "./component/Navigation";

export const MockTest = () => {
  const examData = [toeicTest];
  return (
    <div>
      <section className="flex justify-center mt-12 flex-col items-center">
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 gap-y-12 mb-12 max-w-[1000px] justify-center items-center">
            {examData.map((item, index) => (
              <ExamCard
                id={item.id}
                title={item.title}
                image={item.image}
                questions={item.questions}
                students={item.students}
                level={item.level}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
