import React, { useState, useEffect } from "react";
import LeftSidebarUser from "../../components/LeftSidebarUser";
import HistoryTestCard from "../../components/HistoryTestCard";
import { Bar, Doughnut } from "react-chartjs-2";
import { useSessionsUser } from "../MockTest/hooks/useTestSession";
import { getUserStatistics } from "../../service/sessionService";
import Pagination from "../../components/common/Pagination/Pagination";
import { BarChart3, BookOpen, PieChart, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import LoadingSkeleton from "../../components/common/LoadingSpinner/LoadingSkeleton";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface HistoryProps {
  limit?: number;
  showPagination?: boolean;
  compact?: boolean;
}

const chartTypes = [
  { id: "bar", name: "Cột", icon: BarChart3 },
  { id: "doughnut", name: "Tròn", icon: PieChart },
] as const;

type ChartTypeId = typeof chartTypes[number]["id"];

const HistoryPage: React.FC<HistoryProps> = ({ limit = 6, showPagination = true }) => {
  const [statistics, setStatistics] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [selectedChart, setSelectedChart] = useState<ChartTypeId>("bar");

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setStatsLoading(true);
        const data = await getUserStatistics();
        setStatistics(data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStatistics();
  }, []);

  const chartData = {
    labels: ["Listening", "Reading"],
    datasets: [
      {
        label: "Điểm trung bình",
        data: [
          statistics?.averageListeningScore || 0,
          statistics?.averageReadingScore || 0,
        ],
        backgroundColor: ["rgba(249, 115, 22, 0.8)", "rgba(37, 99, 235, 0.8)"],
        borderColor: ["rgb(249, 115, 22)", "rgb(37, 99, 235)"],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Điểm trung bình theo kỹ năng",
        font: { size: 16, weight: "bold" as const },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.parsed.y} điểm`,
        },
      },
    },
    scales: {
      y: { beginAtZero: true, max: 495, title: { display: true, text: "Điểm số" } },
    },
  };

  const maxScore = 495;
  const doughnutData = {
    labels: ["Listening", "Reading", "Còn lại"],
    datasets: [
      {
        data: [
          statistics?.averageListeningScore || 0,
          statistics?.averageReadingScore || 0,
          maxScore * 2 - ((statistics?.averageListeningScore || 0) + (statistics?.averageReadingScore || 0)), // phần còn lại
        ],
        backgroundColor: ["rgba(249, 115, 22, 0.8)", "rgba(37, 99, 235, 0.8)", "rgba(200,200,200,0.3)"],
        borderColor: ["rgb(249, 115, 22)", "rgb(37, 99, 235)", "rgba(200,200,200,0.5)"],
        borderWidth: 2,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "60%",
    plugins: {
      legend: { display: true, position: "bottom" as const },
      title: { display: true, text: "Điểm trung bình theo kỹ năng", font: { size: 16, weight: "bold" as const } },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.label}: ${context.parsed} điểm`,
        },
      },
    },
  };

  const { sessions, error, loading, pagination, setPage } = useSessionsUser(1, limit);
  if (loading) return <LoadingSkeleton />;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  const hasNoSessions = !sessions || sessions.length === 0;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Layout */}
      <div className="flex flex-1">
        <div className="w-64 flex-shrink-0">
          <LeftSidebarUser customHeight="h-screen sticky top-0" />
        </div>
        <div className="flex-1 overflow-x-hidden p-6 lg:p-8">
          {/* Statistics Card */}
          <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 flex flex-col md:flex-row gap-6">
            {/* Chart section */}
            <div className="flex-1 border-r border-gray-300 pr-6 flex flex-col">
              {/* Title + Selector */}
              <div className="flex items-center justify-between mb-4 flex-nowrap w-full">
                <h2 className="text-xl font-semibold">Thống kê điểm số</h2>
                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg overflow-x-auto flex-shrink-0">
                  {chartTypes.map((chart) => (
                    <button
                      key={chart.id}
                      onClick={() => setSelectedChart(chart.id)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                        selectedChart === chart.id
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      <chart.icon className="w-4 h-4" />
                      <span>{chart.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart */}
              {statsLoading ? (
                <div className="w-full h-64 flex items-center justify-center text-gray-400">Đang tải...</div>
              ) : statistics?.totalSessions === 0 ? (
                <div className="w-full h-64 flex items-center justify-center text-gray-400">Chưa có dữ liệu thống kê</div>
              ) : (
                <div className="w-full h-64">
                  {selectedChart === "bar" ? <Bar data={chartData} options={chartOptions} /> : <Doughnut data={doughnutData} options={doughnutOptions} />}
                </div>
              )}

              {/* Legend */}
              <div className="flex space-x-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                  <span>Listening: {statistics?.averageListeningScore || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-600 rounded"></div>
                  <span>Reading: {statistics?.averageReadingScore || 0}</span>
                </div>
              </div>
            </div>

            {/* Total Point */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="text-center space-y-4 w-full">
                <div className="bg-gradient-to-r from-blue-50 to-orange-50 p-6 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Tổng điểm trung bình</p>
                  <p className="text-4xl font-bold text-gray-800">{statistics?.averageTotalScore || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">/ 990 điểm</p>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600">Số bài đã làm</p>
                    <p className="text-2xl font-semibold text-gray-800 mt-1">{statistics?.totalSessions || 0}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600">Loại bài thi</p>
                    <p className="text-sm font-medium text-gray-800 mt-1">Full Test</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="relative py-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-200 mx-6 lg:mx-8"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-6 py-2 text-sm font-semibold text-gray-600 rounded-full shadow-sm">
                Lịch sử làm bài
              </span>
            </div>
          </div>

          {/* History */}
          <div className="px-6 lg:px-8 pb-8">
            {hasNoSessions ? (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-full p-6 mb-6">
                  <BookOpen className="w-16 h-16 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Chưa có lịch sử làm bài</h2>
                <p className="text-gray-600 text-center max-w-md mb-8">
                  Bạn chưa thực hiện bài thi nào. Hãy bắt đầu làm bài để xem kết quả và theo dõi tiến độ học tập của bạn nhé!
                </p>
                <Link to="/tests">
                  <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                    <TrendingUp className="w-5 h-5" /> Làm bài ngay
                  </button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sessions.map((item) => (
                  <HistoryTestCard
                    key={item._id}
                    id={item._id}
                    title={item.testId.title}
                    totalScore={item?.results?.totalScore}
                    result={item.progress.answeredCount}
                    totalQuestions={item.progress.totalQuestions}
                    accuracy={item?.results?.accuracy}
                    time={item.time}
                    createdAt={item.createdAt}
                    sessionType={item.sessionType}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {showPagination && pagination.total > limit && !hasNoSessions && (
            <div className="px-6 lg:px-8 pb-6">
              <Pagination
                totalItems={pagination.total}
                currentPage={pagination.current}
                onPageChange={setPage}
                itemsPerPage={limit}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
