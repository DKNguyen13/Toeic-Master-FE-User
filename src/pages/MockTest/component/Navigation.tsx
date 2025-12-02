import React, { useState, useEffect } from "react";
import { AnswerState, Question } from "../interface/interfaces";

interface NavigationProps {
  isView: boolean;
  questions: Question[];
  currentPart: number;
  currentQuestion: number;
  answers?: AnswerState[];
  onNavigate: (indexInPart: number) => void;
  onSubmit?: () => void;
  time?: number;
}

const Navigation: React.FC<NavigationProps> = ({
  isView,
  questions,
  currentPart,
  currentQuestion,
  answers,
  onNavigate,
  onSubmit,
  time,
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [remainingTime, setRemainingTime] = useState(
    typeof time === "number" && time > 0 ? time * 60 : 0
  );

  const isCountDown = typeof time === "number" && time > 0;

  useEffect(() => {
    if (isCountDown) {
      setRemainingTime(time! * 60);
    }
  }, [time]);

  // Đếm ngược thời gian
  useEffect(() => {
    if (isView) return;

    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (isCountDown) {
          if (prev <= 1) {
            clearInterval(timer);
            if (onSubmit) onSubmit();
            return 0;
          }
          return prev - 1;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isView, isCountDown, onSubmit]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const questionsInPart = questions.filter((q) => q.partNumber === currentPart);

  // Hiển thị nút câu hỏi
  const renderQuestionButtons = () =>
    questionsInPart.map((q, idx) => {
      const answerState = answers?.[q.globalQuestionNumber - 1];

      let buttonClass = "border rounded-md text-center text-base w-7 h-7 flex items-center justify-center transition-all duration-200";


      if (isView) {
        // Chế độ xem kết quả
        const result = q.answerResult;
        if (result?.isSkipped) {
          buttonClass +=
            " border-2 border-yellow-500 bg-yellow-50 text-yellow-700";
        } else if (result?.isCorrect) {
          buttonClass +=
            " border-2 border-green-500 bg-green-50 text-green-700";
        } else {
          buttonClass += " border-2 border-red-500 bg-red-50 text-red-700";
        }
      } else {
        // Chế độ làm bài
        const answered = answerState?.selectedAnswer != null;
        buttonClass += answered
            ? " bg-blue-500 text-white"
            : " bg-transparent hover:bg-blue-100 text-gray-800";
      }

      return (
        <button
          key={idx}
          onClick={() => onNavigate(idx)}
          className={buttonClass}>
          {q.globalQuestionNumber}
        </button>
      );
    });

  return (
    <div className="max-w-xs mx-auto p-4 bg-white h-full bottom-5 w-44">
      <div className="space-y-4">
        {!isView && (
          <div className="flex flex-col mb-4">
            <span className="text-sm">
              {isCountDown ? "Thời gian còn lại:" : "Thời gian làm bài:"}
            </span>
            <span className="font-semibold text-lg text-blue-600">
              {formatTime(remainingTime)}
            </span>
          </div>
        )}

        {/* Chế độ fullscreen */}
        {!isView && (
          <div className="mb-4 flex justify-center">
            <button onClick={toggleFullScreen}
              className="text-sm text-blue-500 hover:underline">
              {isFullScreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
            </button>
          </div>
        )}

        {/* Danh sách câu hỏi */}
        <div className="flex flex-wrap gap-2 justify-start mb-6">
          {renderQuestionButtons()}
        </div>

        {/* Nút nộp bài */}
        {!isView && (
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                if (onSubmit) onSubmit();
              }}
              className="bg-blue-500 text-white p-2 rounded-md w-full hover:bg-blue-600">
              Nộp bài
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navigation;
