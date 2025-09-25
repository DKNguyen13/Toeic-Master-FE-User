// HistoryTestCard.tsx
import React from "react";
import { FaRegClock } from "react-icons/fa";
import { Link } from "react-router-dom";

interface HistoryTestCardProps {
  id: number;
  imageSrc: string; // Đường dẫn ảnh minh họa
  title: string; // Tên bài test
  score: string; // Điểm (vd "25/100")
  time: string; // Thời lượng (vd "2h20'")
}

const HistoryTestCard: React.FC<HistoryTestCardProps> = ({
  id,
  imageSrc,
  title,
  score,
  time,
}) => {
  return (
    <div
      className="
        bg-white border border-gray-200 
        shadow-sm rounded-lg p-4 
        flex items-center gap-4
        transition-transform duration-300 
        hover:shadow-lg hover:-translate-y-1
      "
    >
      {/* Ảnh minh họa */}
      <div className="w-32 h-20 flex-shrink-0 overflow-hidden rounded-md">
        <img src={imageSrc} alt="Test" className="w-full h-full object-cover" />
      </div>

      {/* Thông tin bài test */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>

        <p className="text-gray-600 text-sm mb-2">
          Điểm: <span className="text-blue-600 font-bold">{score}</span>
        </p>

        {/* Thời lượng + nút bên phải */}
        <div className="flex items-center justify-between text-sm mb-2">
          <div className="text-gray-500 flex items-center gap-1">
            <FaRegClock />
            <span>{time}</span>
          </div>
          <Link to={`/mock-test/view/${id}`}>
            <button
              className="
              bg-blue-600 text-white px-4 py-2 text-sm 
              rounded 
              hover:bg-blue-700 transition-colors duration-300
            "
            >
              Xem chi tiết
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HistoryTestCard;
