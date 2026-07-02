import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  type TooltipItem,
} from "chart.js";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import api from "../../../config/axios";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale
);

type answers = {
  questionId: string;
  question: string;
  part: number;
  questionNumber: number;
  choices : {
    label: string;
    text: string;
  }
  userAnswer: {
    isFlagged: boolean;
    isSkipped: boolean;
    selectedAnswer: string | null;
  };
  correctAnswer: string;
};

type ResultProps = {
  id: string;
  testTitle: string;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedQuestions: number;
  listeningScore: number;
  readingScore: number;
  totalScore: number;
  isFullTest: boolean;
  answers: answers[];
};

const Result: React.FC<ResultProps> = ({
  id,
  testTitle,
  totalQuestions,
  correctAnswers,
  wrongAnswers,
  skippedQuestions,
  listeningScore,
  readingScore,
  totalScore,
  isFullTest,
  answers
}) => {
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(`/history`);
  };
  
  const fetchFeedback = async () => {
    if (feedback) return;

    setLoadingFb(true);

    const formattedAnswers = answers.map(a => ({
      questionId: a.questionId,
      part: a.part,
      questionNumber: a.questionNumber,
      correctAnswer: a.correctAnswer,
      selectedAnswer: a.userAnswer.selectedAnswer,
      isSkipped: a.userAnswer.isSkipped,
      isFlagged: a.userAnswer.isFlagged,
    }));

    try {
      const res = await api.post("/analysis/result", {
        summary: {
          correctAnswers,
          wrongAnswers,
          skippedQuestions,
          totalQuestions,
          listeningScore,
          readingScore,
        },
        isFullTest,
        answers: formattedAnswers
      });
      setFeedback(res.data.feedback);
    } catch (err) {
      console.error(err);
      setFeedback("Không thể phân tích kết quả lúc này.");
    } finally {
      setLoadingFb(false);
    }
  };

  const correctPercentage = ((correctAnswers / totalQuestions) * 100).toFixed(1);
  const wrongPercentage = ((wrongAnswers / totalQuestions) * 100).toFixed(1);
  const skippedPercentage = ((skippedQuestions / totalQuestions) * 100).toFixed(1);
  const [feedback, setFeedback] = React.useState("");
  const [loadingFb, setLoadingFb] = React.useState(false);
  const [showFeedback, setShowFeedback] = React.useState(false);

  const stats = [
    { label: "Tổng số câu hỏi", value: totalQuestions, color: "text-gray-800" },
    { label: "Số câu bỏ qua", value: skippedQuestions, color: "text-gray-500" },
    { label: "Số câu đúng", value: correctAnswers, color: "text-green-600" },
    { label: "Số câu sai", value: wrongAnswers, color: "text-red-500" },
  ];

  // Data for pie chart
  const data = {
    labels: ["Correct", "Wrong", "Skipped"],
    datasets: [
      {
        data: [correctPercentage, wrongPercentage, skippedPercentage],
        backgroundColor: ["rgba(34, 197, 94, 0.85)", "rgba(239, 68, 68, 0.85)", "rgba(156, 163, 175, 0.85)"],
        hoverBackgroundColor: ["rgba(34, 197, 94, 1)", "rgba(239, 68, 68, 1)", "rgba(156, 163, 175, 1)"],
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<'pie'>) {
            const label = context.label || "";
            const value = context.parsed || 0;
            return `${label}: ${value}%`;
          },
        },
      },
      legend: {
        position: "bottom" as const,
      },
    },
  };

  return (
    <div className="max-w-4xl min-w-[700px] mx-auto p-6 bg-white rounded-lg shadow-2xl mt-8 mb-8 relative">
      <button
        onClick={handleGoBack}
        className="
          absolute top-4 left-4
          px-3 py-1.5
          bg-gray-100 hover:bg-gray-200
          text-gray-700 font-medium
          rounded-lg shadow-md
          transition
        ">
        ← Lịch sử làm bài
      </button>
      <h2 className="text-center text-3xl font-bold text-gray-700 mb-6">
        {testTitle}
      </h2>

      {isFullTest && (
        <div className="text-center mb-8">
          <div className="text-6xl text-yellow-500 mb-8">🏆</div>
          <h1 className="text-2xl font-bold text-gray-800">{`Your Score: ${
            totalScore ?? 0
          }/990`}</h1>
          <button onClick={async () => {
                setShowFeedback(true);
                await fetchFeedback();
              }}
                className="
                  mt-4 inline-flex items-center gap-1.5 px-3 py-1.5
                  bg-blue-50 text-blue-700 text-sm font-medium
                  rounded-full hover:bg-blue-100 hover:shadow-sm
                  transition-all duration-200 border border-blue-200
                "><MessageCircle size={18} />
                Xem đánh giá & gợi ý học tập
              </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-8">
        {stats.map((item) => (
          <div key={item.label}
            className="flex justify-between items-center p-4 rounded-lg bg-gray-200 shadow-sm hover:shadow-md transition">
            <span className="text-gray-600">{item.label}:</span>
            <span className={`font-semibold ${item.color}`}>{item.value}</span>
          </div>
        ))}
      </div>

      {isFullTest && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
          {/* Listening Card */}
          <div className="p-6 bg-gray-50 rounded-xl shadow-md text-center hover:shadow-lg transition">
            <p className="text-gray-600 font-medium">Listening</p>
            <p className="text-2xl font-bold text-gray-600 mt-3 mb-3">{listeningScore}/495</p>
            
            {/* Progress Bar */}
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-gray-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${(listeningScore / 495) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs font-medium text-gray-500">
              <span>0</span>
              <span className="text-gray-600">{((listeningScore / 495) * 100).toFixed(1)}%</span>
              <span>495</span>
            </div>
          </div>

          {/* Reading Card */}
          <div className="p-6 bg-gray-50 rounded-xl shadow-md text-center hover:shadow-lg transition">
            <p className="text-gray-600 font-medium">Reading</p>
            <p className="text-2xl font-bold text-gray-600 mt-3 mb-3">{readingScore}/495</p>
            
            {/* Progress Bar */}
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-gray-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${(readingScore / 495) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs font-medium text-gray-500">
              <span>0</span>
              <span className="text-gray-600">{((readingScore / 495) * 100).toFixed(1)}%</span>
              <span>495</span>
            </div>
          </div>
        </div>
      )}

      {/* Pie Chart */}
      <div className="flex justify-center mb-6">
        <div className="w-2/5 text-center">
          <h3 className="text-xl text-gray-700">Thống kê bài làm</h3>
          <div className="mt-4">
            <Pie data={data} options={options} />
          </div>
        </div>
      </div>

      <div className="text-center">
        <div className="px-8 pb-8 text-center">
            <button onClick={() => navigate(`/session/view/${id}`)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-medium rounded-xl shadow-lg hover:bg-blue-600 hover:shadow-xl transition-all duration-200">
              Xem lại bài làm
            </button>
          </div>
      </div>

      {showFeedback && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/20 backdrop-blur-sm animate-fadeIn"
          onClick={() => setShowFeedback(false)}>
          {/* CARD */}
          <div className="relative w-full max-w-2xl bg-white rounded-2xl
                      shadow-xl overflow-hidden animate-modalPop
                      border border-gray-100"
            onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-gradient-to-r from-sky-50 to-indigo-50 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-sky-100 rounded-xl">
                    <MessageCircle className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Phân tích kết quả
                    </h3>
                    <p className="text-sm text-gray-600">
                      Dựa trên điểm số và kết quả bài thi
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Body – scroll */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {loadingFb ? (
                /* Loading */
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-4 bg-gray-200 rounded-full animate-pulse
                                ${i % 2 === 0 ? "w-full" : "w-4/5"}`}
                    />
                  ))}
                  <div className="flex justify-center mt-5">
                    <div className="w-7 h-7 border-2 border-sky-400 border-t-transparent
                                    rounded-full animate-spin" />
                  </div>
                </div>
              ) : (
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {feedback || "Chưa có nhận xét nào."}
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end">
              <button onClick={() => setShowFeedback(false)}
                className="px-5 py-2 bg-sky-500 text-white font-medium
                          rounded-xl hover:bg-sky-600 shadow-sm
                          hover:shadow transition">Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Result;