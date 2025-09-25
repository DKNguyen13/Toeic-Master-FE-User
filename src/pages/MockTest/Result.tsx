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
} from "chart.js";
import { useNavigate } from "react-router-dom";

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
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedQuestions: number;
  score: number;
};

const Result: React.FC<ResultProps> = ({
  totalQuestions,
  correctAnswers,
  wrongAnswers,
  skippedQuestions,
  score,
}) => {
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };
  const correctPercentage = (correctAnswers / totalQuestions) * 100;
  const wrongPercentage = (wrongAnswers / totalQuestions) * 100;
  const skippedPercentage = (skippedQuestions / totalQuestions) * 100;

  // Dữ liệu cho biểu đồ hình tròn
  const data = {
    labels: ["Correct", "Wrong", "Skipped"],
    datasets: [
      {
        data: [correctPercentage, wrongPercentage, skippedPercentage],
        backgroundColor: ["#4CAF50", "#F44336", "#FF9800"],
        hoverBackgroundColor: ["#45a049", "#e53935", "#fb8c00"],
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="max-w-4xl min-w-[700px] mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <div className="text-9xl text-yellow-500 mb-16">🏆</div>
        <h1 className="text-4xl font-bold text-gray-800">{`Your Score: ${score}/100`}</h1>
        <p className="mt-2 text-lg text-gray-500">
          Đây là trình độ ước tính của bạn. Để cải thiện điểm số, bạn có thể tìm
          hiểu các tài nguyên học tập của trang web.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-20">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Tổng số câu hỏi:</span>
          <span className="font-semibold text-gray-800">{totalQuestions}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Số câu đúng:</span>
          <span className="font-semibold text-green-600">{correctAnswers}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Số câu sai:</span>
          <span className="font-semibold text-red-600">{wrongAnswers}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Số câu bỏ qua:</span>
          <span className="font-semibold text-orange-600">
            {skippedQuestions}
          </span>
        </div>
      </div>

      <div className="flex justify-center mb-6">
        <div className="w-1/2 text-center">
          <h3 className="text-xl text-gray-700">Thống kê bài làm</h3>
          <div className="mt-4">
            <Pie data={data} />
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-lg text-blue-500">
          Bạn cần cải thiện Phần 3 - Hội thoại ngắn
        </p>
        <div className="space-x-9">
          <button onClick={handleGoBack} className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600">
            Xem lại bài làm
          </button>
          <button onClick={()=>navigate('/leaderboard')} className="mt-4 px-6 py-2 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600">
            Bảng xếp hạng
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;
