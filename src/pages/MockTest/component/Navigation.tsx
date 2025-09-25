import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Interface remains the same
interface ToeicTestProps {
  isView: boolean;
  toeicTest: {
    id: number;
    title: string;
    level: string;
    listening: {
      part1: { options: string[] }[];
      part2: { options: string[] }[];
      part3: { questions: { options: string[] }[] }[];
      part4: { questions: { options: string[] }[] }[];
    };
    reading: {
      part5: { options: string[] }[];
      part6: { blanks: { options: string[] }[] }[];
      part7: { questions: { options: string[] }[] }[];
    };
  };
  currentQuestion: number;
  answers: (number | null)[];
  onNavigate: (questionIndex: number) => void;
}

const Navigation: React.FC<ToeicTestProps> = ({
  isView,
  toeicTest,
  currentQuestion,
  answers,
  onNavigate,
}) => {
  // Set initial time to 2 hours (7200 seconds)
  const [time, setTime] = useState(7200);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    // Only start timer if time is greater than 0
    if (time > 0) {
      const timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);

      // Cleanup interval on component unmount or when time changes
      return () => clearInterval(timer);
    }
  }, [time]); // Add time as dependency to re-run effect when time reaches 0

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  let questionCounter = 1;

  const renderQuestionButtons = (numQuestions: number) => {
    return Array.from({ length: numQuestions }, (_, index) => {
      const questionNumber = questionCounter++;
      const questionIndex = questionNumber - 1;
      return (
        <button
          key={index}
          onClick={() => onNavigate(questionIndex)}
          className={`border rounded-md text-center text-sm transition-all duration-200 p-1 ${
            currentQuestion === questionIndex
              ? "bg-blue-500 text-white"
              : answers[questionIndex] != null
              ? "bg-green-500 text-white"
              : "hover:bg-blue-500 hover:text-white"
          }`}
        >
          {questionNumber}
        </button>
      );
    });
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div className="max-w-xs mx-auto p-4 bg-white h-full bottom-5 w-44">
      <div className="space-y-4">
        {!isView && (
          <div className="flex justify-between mb-4">
            <span className="text-sm">Thời gian còn lại:</span>
            <span className="font-semibold text-xl">
              {time > 0 ? formatTime(time) : "Hết giờ"}
            </span>
          </div>
        )}
        <div className="mb-4 flex justify-end">
          <button
            onClick={toggleFullScreen}
            className="text-sm text-blue-500 hover:underline"
          >
            {isFullScreen ? "Thoát toàn màn hình" : "Chế độ toàn màn hình"}
          </button>
        </div>

        {/* Rest of the sections remain the same */}
        {toeicTest.listening.part1.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Part 1: Listening</h3>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {renderQuestionButtons(toeicTest.listening.part1.length)}
            </div>
          </div>
        )}

        {toeicTest.listening.part2.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Part 2: Listening</h3>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {renderQuestionButtons(toeicTest.listening.part2.length)}
            </div>
          </div>
        )}

        {toeicTest.listening.part3.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Part 3: Listening</h3>
            {toeicTest.listening.part3.map((item, index) =>
              item.questions.length > 0 ? (
                <div key={index} className="space-y-2">
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {renderQuestionButtons(item.questions.length)}
                  </div>
                </div>
              ) : null
            )}
          </div>
        )}

        {toeicTest.listening.part4.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Part 4: Listening</h3>
            {toeicTest.listening.part4.map((item, index) =>
              item.questions.length > 0 ? (
                <div key={index} className="space-y-2">
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {renderQuestionButtons(item.questions.length)}
                  </div>
                </div>
              ) : null
            )}
          </div>
        )}

        {toeicTest.reading.part5.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Part 5: Reading</h3>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {renderQuestionButtons(toeicTest.reading.part5.length)}
            </div>
          </div>
        )}

        {toeicTest.reading.part6.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Part 6: Reading</h3>
            {toeicTest.reading.part6.map((item, index) =>
              item.blanks.length > 0 ? (
                <div key={index} className="space-y-2">
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {renderQuestionButtons(item.blanks.length)}
                  </div>
                </div>
              ) : null
            )}
          </div>
        )}

        {toeicTest.reading.part7.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Part 7: Reading</h3>
            {toeicTest.reading.part7.map((item, index) =>
              item.questions.length > 0 ? (
                <div key={index} className="space-y-2">
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {renderQuestionButtons(item.questions.length)}
                  </div>
                </div>
              ) : null
            )}
          </div>
        )}

        <div className="mt-4 text-center">
          <Link to={`/result/${toeicTest.id}`}>
            <button className="bg-blue-500 text-white p-2 rounded-md w-full hover:bg-blue-600">
              Submit Test
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
