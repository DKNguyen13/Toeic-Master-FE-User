import React from "react";
import Result from "./Result";
import { useResult } from "../hooks/useTestSession";
import LoadingSkeleton from "../../../components/common/LoadingSpinner/LoadingSkeleton";

const ResultPage: React.FC = () => {
  const {
    loading,
    error,
    resultData
  } = useResult();

  if (loading) return <LoadingSkeleton/>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!resultData) return <p className="text-center">No result found</p>;

  return (
    <Result
      id = {resultData.id}
      testTitle={resultData.test?.title || "Bài thi không xác định"}
      totalQuestions={resultData.results.totalQuestions}
      correctAnswers={resultData.results.correctCount}
      wrongAnswers={resultData.results.incorrectCount}
      skippedQuestions={resultData.results.skippedCount}
      totalScore={resultData.results.totalScore}
      listeningScore={resultData.results.listeningScore}
      readingScore={resultData.results.readingScore}
      isFullTest= {resultData.sessionType?.toLowerCase() === 'full-test'}
    />
  );
};

export default ResultPage;
