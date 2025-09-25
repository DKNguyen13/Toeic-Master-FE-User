import React, { useState } from "react";
import { toeicTest } from "../../data/toeicMockData";
import Navigation from "./component/Navigation";
import { useNavigate } from "react-router-dom";
import IcBreadcrumbGbk from "../../assets/icons/IcBreadcrumbGbk";
interface TestProps {
  isView: boolean;
}
export const Test: React.FC<TestProps> = ({ isView = false }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  if (isView) console.log("viewing");

  const [answers, setAnswers] = useState(
    new Array(toeicTest.questions).fill(null)
  );
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };
  const handleAnswer = (questionIndex: number, answerIndex: number) => {
    const updatedAnswers = [...answers];
    updatedAnswers[questionIndex] = answerIndex;
    setAnswers(updatedAnswers);
    setCurrentQuestion(questionIndex); // Update current question when answering
  };
  const handleNavigate = (questionIndex: number) => {
    setCurrentQuestion(questionIndex);
    const element = document.getElementById(`question-${questionIndex + 1}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  let questionCounter = 1;

  const getQuestionProps = () => {
    const id = `question-${questionCounter}`;
    const number = questionCounter;
    questionCounter++;
    return { id, number };
  };

  const renderListeningPart1 = (part: any) => {
    return part && part.length > 0 ? (
      <div>
        <h3 className="text-lg font-semibold mb-2">Part 1: Listening</h3>
        {part.map((item: any, index: number) => {
          const { id, number } = getQuestionProps();
          return (
            <div key={index} className="mb-4" id={id}>
              <p className="font-semibold">Question {number}</p>
              {item.image && (
                <img src={item.image} alt="question" className="w-full mb-2" />
              )}
              {item.options.map((option: string, optionIndex: number) => (
                <button
                  key={optionIndex}
                  onClick={() => handleAnswer(number - 1, optionIndex)}
                  className={`border p-2 rounded-md w-full text-left mb-2 ${
                    answers[number - 1] === optionIndex
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-200"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          );
        })}
      </div>
    ) : null;
  };

  const renderListeningPart2 = (part: any) => {
    return part && part.length > 0 ? (
      <div>
        <h3 className="text-lg font-semibold mb-2">Part 2: Listening</h3>
        {part.map((item: any, index: number) => {
          const { id, number } = getQuestionProps();
          return (
            <div key={index} className="mb-4" id={id}>
              <p className="font-semibold">Question {number}</p>
              <p>{item.question}</p>
              {item.options.map((option: string, optionIndex: number) => (
                <button
                  key={optionIndex}
                  onClick={() => handleAnswer(number - 1, optionIndex)}
                  className={`border p-2 rounded-md w-full text-left mb-2 ${
                    answers[number - 1] === optionIndex
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-200"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          );
        })}
      </div>
    ) : null;
  };

  const renderListeningPart3 = (part: any) => {
    return part && part.length > 0 ? (
      <div>
        <h3 className="text-lg font-semibold mb-2">Part 3: Listening</h3>
        {part.map((item: any, index: number) => (
          <div key={index} className="mb-4">
            {item.questions.map((question: any, questionIndex: number) => {
              const { id, number } = getQuestionProps();
              return (
                <div key={questionIndex} id={id}>
                  <p className="font-semibold">Question {number}</p>
                  <p>{question.question}</p>
                  {question.options.map(
                    (option: string, optionIndex: number) => (
                      <button
                        key={optionIndex}
                        onClick={() => handleAnswer(number - 1, optionIndex)}
                        className={`border p-2 rounded-md w-full text-left mb-2 ${
                          answers[number - 1] === optionIndex
                            ? "bg-blue-500 text-white"
                            : "hover:bg-gray-200"
                        }`}
                      >
                        {option}
                      </button>
                    )
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    ) : null;
  };

  const renderListeningPart4 = (part: any) => {
    return part && part.length > 0 ? (
      <div>
        <h3 className="text-lg font-semibold mb-2">Part 4: Listening</h3>
        {part.map((item: any, index: number) => (
          <div key={index} className="mb-4">
            {item.questions.map((question: any, questionIndex: number) => {
              const { id, number } = getQuestionProps();
              return (
                <div key={questionIndex} id={id}>
                  <p className="font-semibold">Question {number}</p>
                  <p>{question.question}</p>
                  {question.options.map(
                    (option: string, optionIndex: number) => (
                      <button
                        key={optionIndex}
                        onClick={() => handleAnswer(number - 1, optionIndex)}
                        className={`border p-2 rounded-md w-full text-left mb-2 ${
                          answers[number - 1] === optionIndex
                            ? "bg-blue-500 text-white"
                            : "hover:bg-gray-200"
                        }`}
                      >
                        {option}
                      </button>
                    )
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    ) : null;
  };

  const renderReadingPart5 = (part: any) => {
    return part && part.length > 0 ? (
      <div>
        <h3 className="text-lg font-semibold mb-2">Part 5: Reading</h3>
        {part.map((item: any, index: number) => {
          const { id, number } = getQuestionProps();
          return (
            <div key={index} className="mb-4" id={id}>
              <p className="font-semibold">Question {number}</p>
              <p>{item.sentence}</p>
              {item.options.map((option: string, optionIndex: number) => (
                <button
                  key={optionIndex}
                  onClick={() => handleAnswer(number - 1, optionIndex)}
                  className={`border p-2 rounded-md w-full text-left mb-2 ${
                    answers[number - 1] === optionIndex
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-200"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          );
        })}
      </div>
    ) : null;
  };

  const renderReadingPart6 = (part: any) => {
    return part && part.length > 0 ? (
      <div>
        <h3 className="text-lg font-semibold mb-2">Part 6: Reading</h3>
        {part.map((item: any, index: number) => (
          <div key={index} className="mb-4">
            <p>{item.passage}</p>
            {item.blanks.map((blank: any, blankIndex: number) => {
              const { id, number } = getQuestionProps();
              return (
                <div key={blankIndex} id={id}>
                  <p className="font-semibold">Question {number}</p>
                  <p>Fill in the blank:</p>
                  {blank.options.map((option: string, optionIndex: number) => (
                    <button
                      key={optionIndex}
                      onClick={() => handleAnswer(number - 1, optionIndex)}
                      className={`border p-2 rounded-md w-full text-left mb-2 ${
                        answers[number - 1] === optionIndex
                          ? "bg-blue-500 text-white"
                          : "hover:bg-gray-200"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    ) : null;
  };

  const renderReadingPart7 = (part: any) => {
    return part && part.length > 0 ? (
      <div>
        <h3 className="text-lg font-semibold mb-2">Part 7: Reading</h3>
        {part.map((item: any, index: number) => (
          <div key={index} className="mb-4">
            <p>
              {item.passage.title}: {item.passage.content}
            </p>
            {item.questions.map((question: any, questionIndex: number) => {
              const { id, number } = getQuestionProps();
              return (
                <div key={questionIndex} id={id}>
                  <p className="font-semibold">Question {number}</p>
                  <p>{question.question}</p>
                  {question.options.map(
                    (option: string, optionIndex: number) => (
                      <button
                        key={optionIndex}
                        onClick={() => handleAnswer(number - 1, optionIndex)}
                        className={`border p-2 rounded-md w-full text-left mb-2 ${
                          answers[number - 1] === optionIndex
                            ? "bg-blue-500 text-white"
                            : "hover:bg-gray-200"
                        }`}
                      >
                        {option}
                      </button>
                    )
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    ) : null;
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-row justify-between flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col justify-start items-center p-4 overflow-auto">
          <div
            className="text-lg w-full text-main font-normal flex gap-3 text-start mb-5 cursor-pointer items-center"
            onClick={handleGoBack}
          >
            <IcBreadcrumbGbk />
            <span>{"Return"}</span>
          </div>

          <div className="w-full max-w-2xl bg-gray-100 top-0 z-10 rounded-full my-10">
            <audio
              controls
              className="w-full max-w-4xl mx-auto block"
              src={toeicTest.audio}
            >
              Your browser does not support the audio element.
            </audio>
          </div>

          <div className="w-full max-w-4xl">
            {renderListeningPart1(toeicTest.listening.part1)}
            {renderListeningPart2(toeicTest.listening.part2)}
            {renderListeningPart3(toeicTest.listening.part3)}
            {renderListeningPart4(toeicTest.listening.part4)}
            {renderReadingPart5(toeicTest.reading.part5)}
            {renderReadingPart6(toeicTest.reading.part6)}
            {renderReadingPart7(toeicTest.reading.part7)}
          </div>
        </div>

        <div className=" p-4 bg-white h-full w-fit overflow-y-scroll">
          <Navigation
            isView={isView}
            toeicTest={toeicTest}
            currentQuestion={currentQuestion}
            answers={answers}
            onNavigate={handleNavigate}
          />
        </div>
      </div>
    </div>
  );
};
