import React, { useState, useEffect, useRef } from "react";
import { AnswerState, Question } from "../interface/interfaces";

interface NavigationProps {
  isView: boolean;
  questions: Question[];
  currentPart: number;
  currentQuestion: number;
  answers?: Record<string, AnswerState>;
  onNavigate: (indexInPart: number) => void;
  onSubmit?: (isAutoSubmit?: boolean) => void;
  time?: number;
  sessionId?: string;
}

interface TimerDisplayProps {
  time: number;
  isCountDown: boolean;
  isView: boolean;
  onSubmit?: (isAutoSubmit?: boolean) => void;
  sessionId?: string;
}

const TimerDisplayComponent: React.FC<TimerDisplayProps> = ({
  time,
  isCountDown,
  isView,
  onSubmit,
  sessionId,
}) => {
  const hasAutoSubmitted = useRef(false);
  const [remainingTime, setRemainingTime] = useState(
    typeof time === "number" && time > 0 ? time : 0
  );

  useEffect(() => {
    setRemainingTime(time);
  }, [time]);

  // Đếm ngược thời gian
  useEffect(() => {
    if (isView) return;

    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        let newTime;
        if (isCountDown) {
          if (prev <= 1) {
            clearInterval(timer);
            if (onSubmit && !hasAutoSubmitted.current) {
              hasAutoSubmitted.current = true;
              onSubmit(true);
            }
            newTime = 0;
          } else {
            newTime = prev - 1;
          }
        } else {
          newTime = prev + 1;
        }

        if (sessionId) {
          localStorage.setItem(`remainingTime_${sessionId}`, newTime.toString());
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isView, isCountDown, onSubmit, sessionId]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col">
      <span className="text-sm">
        {isCountDown ? "Thời gian còn lại:" : "Thời gian làm bài:"}
      </span>
      <span className="font-semibold text-lg text-blue-600">
        {formatTime(remainingTime)}
      </span>
    </div>
  );
};

const TimerDisplay = React.memo(TimerDisplayComponent);

const NavigationComponent: React.FC<NavigationProps> = ({
  isView,
  questions,
  currentPart,
  currentQuestion,
  answers,
  onNavigate,
  onSubmit,
  time,
  sessionId,
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const isCountDown = typeof time === "number" && time > 0;

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
      const answerState = answers?.[q.id];

      let buttonClass =
        "border rounded-md text-center text-base w-7 h-7 flex items-center justify-center transition-all duration-200";

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
          className={buttonClass}
        >
          {q.globalQuestionNumber}
        </button>
      );
    });

  return (
    <div className="max-w-xs mx-auto p-4 bg-white h-full bottom-5 w-44">
      <div className="space-y-4">
        {!isView && (
          <div className="flex flex-col mb-4">
            <TimerDisplay
              time={time ?? 0}
              isCountDown={isCountDown}
              isView={isView}
              onSubmit={onSubmit}
              sessionId={sessionId}
            />
          </div>
        )}

        {/* Chế độ fullscreen */}
        {!isView && (
          <div className="mb-4 flex justify-center">
            <button
              onClick={toggleFullScreen}
              className="text-sm text-blue-500 hover:underline"
            >
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
                if (onSubmit) onSubmit(false);
              }}
              className="bg-blue-500 text-white p-2 rounded-md w-full hover:bg-blue-600"
            >
              Nộp bài
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Navigation = React.memo(NavigationComponent);

export default Navigation;
