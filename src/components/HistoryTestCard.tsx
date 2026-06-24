import React from "react";
import {
  Clock,
  Calendar,
  ArrowRight,
  BookOpen,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

interface HistoryTestCardProps {
  id: string;
  title: string;
  totalScore?: number;
  result: number;
  totalQuestions: number;
  accuracy?: number;
  time: number;
  createdAt: string;
  sessionType: "practice" | "full-test" | string;
  status: string;
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
  status,
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

  const formatTime = (sec: number) => {
    if (!sec || sec < 0) return "—";

    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const seconds = sec % 60;

    if (hours > 0) {
      return `${hours}h ${minutes.toString().padStart(2, "0")}m ${seconds
        .toString()
        .padStart(2, "0")}s`;
    }

    return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
  };

  return (
    <div
      className="
        relative overflow-hidden
        bg-white border border-gray-150
        rounded-2xl p-5
        shadow-sm hover:shadow-xl hover:-translate-y-1.5
        transition-all duration-300 ease-out
        group
        flex flex-col justify-between gap-4
        min-h-[210px]
      "
    >
      {/* Gradient Top Bar */}
      <div
        className={`
          absolute top-0 left-0 w-full h-1
          bg-gradient-to-r ${isFullTest ? "from-orange-500 to-pink-500" : "from-emerald-500 to-teal-500"}
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300
        `}
      />

      {/* Header: Title + Badge */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors break-words flex-1 leading-snug">
          {title}
        </h3>

        <span
          className={`
            text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm shrink-0
            ring-1 ring-inset transition-all duration-200
            flex items-center justify-center gap-1
            ${
              isFullTest
                ? "bg-orange-50 text-orange-700 ring-orange-200/50"
                : "bg-emerald-50 text-emerald-700 ring-emerald-200/50"
            }
          `}
        >
          {isFullTest ? (
            <BookOpen className="w-3.5 h-3.5" />
          ) : (
            <CheckCircle className="w-3.5 h-3.5" />
          )}
          {typeLabel}
        </span>
      </div>

      {/* Stats Grid: Kết quả & Độ chính xác */}
      <div className="grid grid-cols-2 gap-3 text-sm bg-gray-50/60 rounded-xl p-3 border border-gray-100">
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Kết quả</span>
          <div className="flex items-baseline gap-1">
            <span className="font-bold text-gray-800 text-sm">
              {result}
            </span>
            <span className="text-xs text-gray-500">/ {totalQuestions}</span>
            {isFullTest && totalScore !== undefined && (
              <span className="ml-1 text-xs font-bold text-blue-600">
                ({totalScore}đ)
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-0.5 border-l border-gray-200/60 pl-3">
          <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Độ chính xác</span>
          <span className="font-bold text-gray-850 text-sm">
            {accuracy ? `${accuracy}%` : "—"}
          </span>
        </div>
      </div>

      {/* Footer: Date, Time & Buttons */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100/60 text-xs text-gray-500">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="font-medium truncate">{formatTime(time)}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="font-medium truncate">{formattedDate}</span>
          </span>
        </div>

        {/* Nút tùy theo status */}
        {status === "completed" ? (
          <Link to={`/session/${id}/results`} className="shrink-0">
            <button
              className="
                flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white
                rounded-xl shadow-sm
                transition-all duration-300
                bg-blue-600 hover:bg-blue-700
                hover:shadow-md hover:translate-x-0.5 active:translate-x-0
              "
            >
              Chi tiết
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        ) : status === "paused" || status === "in-progress" ? (
          <Link to={`/session/${id}`} className="shrink-0">
            <button
              className="
                flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white
                rounded-xl shadow-sm
                transition-all duration-300
                bg-emerald-600 hover:bg-emerald-700
                hover:shadow-md hover:translate-x-0.5 active:translate-x-0
              "
            >
              Tiếp tục
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        ) : null}
      </div>
    </div>
  );
};

export default HistoryTestCard;
