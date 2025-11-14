import React from "react";
import { Clock, Calendar, ArrowRight, BookOpen, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface HistoryTestCardProps {
  id: string;
  title: string;
  totalScore?: number;
  result: number;
  totalQuestions: number;
  accuracy?: number;
  time: string;
  createdAt: string;
  sessionType: "practice" | "full-test" | string;
}

const HistoryTestCard: React.FC<HistoryTestCardProps> = ({
  id,
  title,
  totalScore,
  result,
  totalQuestions,
  accuracy,
  time,
  createdAt,
  sessionType,
}) => {
  const formattedDate = new Date(createdAt).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const typeLabel =
    sessionType === "practice"
      ? "Luyện tập"
      : sessionType === "full-test"
      ? "Full Test"
      : "Khác";

  const isFullTest = sessionType === "full-test";

  return (
    <div
      className="
        relative overflow-hidden
        bg-white border border-gray-100
        rounded-2xl p-5
        shadow-md hover:shadow-2xl
        transition-all duration-300 ease-out
        hover:-translate-y-2
        group cursor-pointer
        flex flex-col gap-4
      "
    >
      {/* Gradient Top Bar */}
      <div
        className={`
          absolute top-0 left-0 w-full h-1.5 opacity-0 group-hover:opacity-100
          transition-opacity duration-300
        `}
      />

      {/* Header: Title + Badge */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-gray-800 transition-colors break-words">
          {title}
        </h3>

        <span
          className={`
            text-xs font-bold px-3 py-1.5 rounded-full shadow-sm
            ring-1 ring-inset transition-all duration-200
            flex items-center justify-center gap-1.5
            ${isFullTest
              ? "bg-gradient-to-r from-orange-50 to-pink-50 text-orange-700 ring-orange-200"
              : "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 ring-emerald-200"
            }
          `}
        >
          {isFullTest ? <BookOpen className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
          {typeLabel}
        </span>
      </div>

      {/* Kết quả & Độ chính xác */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-gray-600">Kết quả:</span>
          <span className="font-bold text-gray-600 truncate">
            {result}/{totalQuestions}
          </span>
          {isFullTest && totalScore !== undefined && (
            <span className="ml-2 font-bold text-red-600 truncate">
              ({totalScore} điểm)
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-gray-600">Độ chính xác:</span>
          <span className={`font-bold truncate text-gray-600`}>
            {accuracy ? `${accuracy}%` : "—"}
          </span>
        </div>
      </div>

      {/* Thời gian & Nút */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 text-sm text-gray-500">
        <div className="flex flex-wrap gap-4">
          <span className="flex items-center gap-1.5 min-w-0">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="font-medium truncate">{time}</span>
          </span>
          <span className="flex items-center gap-1.5 min-w-0">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="font-medium truncate">{formattedDate}</span>
          </span>
        </div>

        <Link to={`/session/${id}/results`} className="w-full sm:w-auto">
          <button
            className="
              flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white
              rounded-xl shadow-md
              transition-all duration-300
              w-full sm:w-auto
              bg-blue-600 hover:bg-blue-700
              hover:shadow-lg hover:scale-105 active:scale-95
            "
          >
            Xem chi tiết
            <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default HistoryTestCard;
