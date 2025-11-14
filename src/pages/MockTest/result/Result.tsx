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
import { Eye } from "lucide-react";

// Đăng ký các phần tử của Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale
);

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
}) => {
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(`/history`);
  };
  
  const correctPercentage = ((correctAnswers / totalQuestions) * 100).toFixed(1);
  const wrongPercentage = ((wrongAnswers / totalQuestions) * 100).toFixed(1);
  const skippedPercentage = ((skippedQuestions / totalQuestions) * 100).toFixed(1);

  const stats = [
    { label: "Tổng số câu hỏi", value: totalQuestions, color: "text-gray-800" },
    { label: "Số câu bỏ qua", value: skippedQuestions, color: "text-gray-500" },
    { label: "Số câu đúng", value: correctAnswers, color: "text-green-600" },
    { label: "Số câu sai", value: wrongAnswers, color: "text-red-500" },
  ];

  // Dữ liệu cho biểu đồ hình tròn
  const data = {
    labels: ["Correct", "Wrong", "Skipped"],
    datasets: [
      {
        data: [correctPercentage, wrongPercentage, skippedPercentage],
        backgroundColor: ["#4CAF50", "#F44336", "#BDBDBD"],
        hoverBackgroundColor: ["#45a049", "#e53935", "#9E9E9E"],
        borderColor: "#fff",
        borderWidth: 1,
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
        "
      >
        ← Quay lại
      </button>
      <h2 className="text-center text-3xl font-bold text-gray-700 mb-4">
        {testTitle}
      </h2>

      {isFullTest && (
        <div className="text-center mb-8">
          <div className="text-7xl text-yellow-500 mb-8">🏆</div>
          <h1 className="text-2xl font-bold text-gray-800">{`Your Score: ${
            totalScore ?? 0
          }/990`}</h1>
          <p className="mt-2 text-lg text-gray-500">
            Đây là trình độ ước tính của bạn. Hãy tham khảo tài nguyên học tập để nâng cao điểm số.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-8">
        {stats.map((item) => (
          <div
            key={item.label}
            className="flex justify-between items-center p-4 rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition">
            <span className="text-gray-600">{item.label}:</span>
            <span className={`font-semibold ${item.color}`}>{item.value}</span>
          </div>
        ))}
      </div>

      {isFullTest && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center mb-16">
          <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition">
            <p className="text-gray-500 font-medium">Listening</p>
            <p className="text-3xl font-bold text-gray-600 mt-2">
              {listeningScore}/495
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition">
            <p className="text-gray-500 font-medium">Reading</p>
            <p className="text-3xl font-bold text-gray-600 mt-2">
              {readingScore}/495
            </p>
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
        {/* <p className="text-lg text-blue-500">
          Bạn cần cải thiện Phần 3 - Hội thoại ngắn
        </p> */}
        <div className="px-8 pb-8 text-center">
            <button
              onClick={() => navigate(`/session/view/${id}`)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-medium rounded-xl shadow-lg hover:bg-blue-600 hover:shadow-xl transition-all duration-200">
              <Eye/>Xem lại bài làm
            </button>
          </div>
      </div>
    </div>
  );
};

export default Result;