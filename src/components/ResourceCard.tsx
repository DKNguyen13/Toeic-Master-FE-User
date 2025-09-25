import React from "react";
import { FaEye, FaHeart, FaBookOpen, FaPen, FaCog, FaVideo } from "react-icons/fa";
import { Link } from "react-router-dom";

interface ResourceCardProps {
  id: string | number;
  imageSrc: string;
  title: string;
  views: number;
  likes: number;
  type?: "reading" | "vocabulary" | "grammar" | "video";
}

const typeConfig: Record<
  string,
  { label: string; icon: JSX.Element; classes: string }
> = {
  reading: {
    label: "Đọc hiểu",
    icon: <FaBookOpen className="mr-1.5" />,
    classes: "bg-purple-50 text-purple-600 border border-purple-200",
  },
  vocabulary: {
    label: "Từ vựng",
    icon: <FaPen className="mr-1.5" />,
    classes: "bg-green-50 text-green-600 border border-green-200",
  },
  grammar: {
    label: "Ngữ pháp",
    icon: <FaCog className="mr-1.5" />,
    classes: "bg-yellow-50 text-yellow-600 border border-yellow-200",
  },
  video: {
    label: "Video",
    icon: <FaVideo className="mr-1.5" />,
    classes: "bg-blue-50 text-blue-600 border border-blue-200",
  },
};

const ResourceCard: React.FC<ResourceCardProps> = ({
  id,
  imageSrc,
  title,
  views,
  likes,
  type,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-5 flex flex-col max-w-sm mx-auto transform hover:-translate-y-1">
      <div className="relative overflow-hidden rounded-lg mb-4">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <h3 className="text-gray-900 font-bold text-xl mb-3 line-clamp-2">{title}</h3>

      {type && (
        <div
          className={`inline-flex items-center text-sm font-medium px-3 py-1.5 rounded-full mb-4 ${typeConfig[type].classes}`}
        >
          {typeConfig[type].icon}
          {typeConfig[type].label}
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
        <div className="flex items-center space-x-2">
          <FaEye className="text-gray-400" />
          <span>{views.toLocaleString()}+</span>
        </div>
        <div className="flex items-center space-x-2">
          <FaHeart className="text-red-400" />
          <span>{likes.toLocaleString()}</span>
        </div>
      </div>

      <Link to={`${id}`} className="mt-auto">
        <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2.5 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium text-sm shadow-sm">
          Xem chi tiết
        </button>
      </Link>
    </div>
  );
};

export default ResourceCard;