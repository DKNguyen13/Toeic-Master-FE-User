import React, { useEffect, useRef, useState } from "react";
import Navigation from "./component/Navigation";
import { useTestSession } from "./hooks/useTestSession";
import TestHeader from "./component/TestHeader";
import PartSelector from "./component/PartSelector";
import QuestionList from "./component/QuestionList";
import { useViewSession } from "./hooks/useViewTestSession";
import LoadingSkeleton from "../../components/common/LoadingSpinner/LoadingSkeleton";
import { useBlockNavigation } from "./hooks/useBlockNavigation";

interface TestProps {
  isView: boolean; // true: review detail result
  maintenanceState?: {
    active: boolean;
    message?: string;
    startAt?: string | null;
    endAt?: string | null;
  };
}

export const Test: React.FC<TestProps> = ({ isView, maintenanceState }) => {
  //Chọn hook theo mode
  const hookData = isView ? useViewSession() : useTestSession();
  const {
    sessionId,
    session,
    parts,
    currentPart,
    setCurrentPart,
    currentQuestion,
    setCurrentQuestion,
    questionsInPart,
    handleNavigateQuestion,
    handleGoBack,
    loading,
    error,
    handleAnswer,
    handleNextPart,
    handleSubmitSession,
    answers,
    handlePauseTestSession,
    handleResumeTestSession,
  } = hookData as ReturnType<typeof useTestSession> &
    ReturnType<typeof useViewSession>;

  useBlockNavigation({
    shouldBlock: !isView,
    onConfirmLeave: handlePauseTestSession,
    sessionId: sessionId,
  })

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [showDeviceWarning, setShowDeviceWarning] = useState(false);

  useEffect(() => {
    if (!isView && window.innerWidth < 1024) {
      setShowDeviceWarning(true);
    }
  }, [isView]);
  const hasSubmittedRef = useRef(false);
  const maintenanceInterruptedRef = useRef(false);

  const handleTestSubmit = (isAutoSubmit?: boolean) => {
    if (hasSubmittedRef.current) return;
    if (isAutoSubmit) {
      hasSubmittedRef.current = true;
      handleSubmitSession(true);
    } else {
      setIsConfirmModalOpen(true);
    }
  };

  const confirmSubmit = () => {
    if (hasSubmittedRef.current) return;
    hasSubmittedRef.current = true;
    setIsConfirmModalOpen(false);
    handleSubmitSession(false);
  };

  const cancelSubmit = () => {
    setIsConfirmModalOpen(false);
  };

  const shouldScrollRef = useRef(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleNextPartWithScroll = async () => {
    shouldScrollRef.current = true;
    await handleNextPart();
  };

  useEffect(() => {
    if (isView) return;

    if (maintenanceState?.active) {
      maintenanceInterruptedRef.current = true;
      handlePauseTestSession();
      return;
    }

    if (maintenanceInterruptedRef.current) {
      maintenanceInterruptedRef.current = false;
      handleResumeTestSession();
      return;
    }

    // Khi người dùng vào trang làm bài (hoặc tiếp tục), lập tức resume session
    handleResumeTestSession();

    const handlePageShow = () => {
      if (!maintenanceState?.active) {
        handleResumeTestSession();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && !maintenanceState?.active) {
        handleResumeTestSession();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isView, maintenanceState?.active, handlePauseTestSession, handleResumeTestSession]);

  useEffect(() => {
    if (!shouldScrollRef.current) return;

    if (questionsInPart.length > 0 && contentRef.current) {
      const firstQuestion = questionsInPart[0];
      const el = document.getElementById(
        `question-${firstQuestion.globalQuestionNumber}`
      );

      if (el) {
        const container = contentRef.current;

        const headerOffset = 300; // TestHeader + PartSelector
        const elementTop = el.offsetTop;

        container.scrollTo({
          top: elementTop - headerOffset,
          behavior: "smooth",
        });
      }
    }

    shouldScrollRef.current = false;
  }, [currentPart, questionsInPart]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center mt-12">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  const isLastPart = parts.indexOf(currentPart) === parts.length - 1;

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-col lg:flex-row justify-between flex-1 overflow-hidden">
        {/* Left: Main content */}
        <div 
          ref={contentRef}
          className="flex-1 flex flex-col justify-start items-center p-4 overflow-y-auto">
          <TestHeader
            session={session}
            onGoBack={handleGoBack}
            isView={isView}
            currentPart={currentPart}
          />

          <PartSelector
            parts={parts}
            currentPart={currentPart}
            setCurrentPart={setCurrentPart}
            setCurrentQuestion={setCurrentQuestion}
          />

          <QuestionList
            questionsInPart={questionsInPart}
            answers={answers}
            handleAnswer={!isView ? handleAnswer : undefined}
            isView={isView}
          />

          {!isLastPart && (
              <button
                onClick={ handleNextPartWithScroll }
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Tiếp theo
              </button>
          )}
        </div>

        {/* Right: Navigation */}
        <div className="w-full lg:w-fit p-4 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 max-h-[45vh] lg:max-h-none lg:h-full overflow-y-auto">
          <Navigation
            sessionId={sessionId}
            isView={isView}
            time={session?.timeRemaining ?? 0}
            questions={questionsInPart}
            currentPart={currentPart}
            currentQuestion={currentQuestion}
            answers={answers}
            onNavigate={handleNavigateQuestion}
            onSubmit={!isView ? handleTestSubmit : undefined}
          />
        </div>
      </div>

      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Xác nhận nộp bài</h2>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn nộp bài lúc này không?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelSubmit}
                className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                onClick={confirmSubmit}
                className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors font-medium"
              >
                Nộp bài
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeviceWarning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl relative">
            <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-center text-gray-800 mb-2">Trải nghiệm tốt nhất trên màn hình lớn</h3>
            <p className="text-gray-600 text-center mb-6 text-sm">
              Bạn nên sử dụng chức năng này trên thiết bị có màn hình lớn (PC/Laptop) để trải nghiệm chức năng luyện thi một cách tốt nhất.
            </p>
            <button
              onClick={() => setShowDeviceWarning(false)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Tôi đã hiểu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
