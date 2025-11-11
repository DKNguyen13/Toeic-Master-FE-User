import React from "react";
import api from "../config/axios";
import { useNavigate } from "react-router-dom";
import { Eye, Heart, Book, Edit, Settings, Video } from "lucide-react";

interface ResourceCardProps {
  id: string | number;
  imageSrc: string;
  title: string;
  views: number;
  likes: number;
  type?: "reading" | "vocabulary" | "grammar" | "video";
}

const typeConfig: Record<string, { label: string; icon: JSX.Element; classes: string; gradient: string }> = {
  reading: {
    label: "Đọc hiểu",
    icon: <Book className="w-3.5 h-3.5" />,
    classes: "bg-white/90 text-purple-700 border border-purple-200/50",
    gradient: "from-purple-500/10 to-purple-600/10"
  },
  vocabulary: {
    label: "Từ vựng",
    icon: <Edit className="w-3.5 h-3.5" />,
    classes: "bg-white/90 text-green-700 border border-green-200/50",
    gradient: "from-green-500/10 to-green-600/10"
  },
  grammar: {
    label: "Ngữ pháp",
    icon: <Settings className="w-3.5 h-3.5" />,
    classes: "bg-white/90 text-amber-700 border border-amber-200/50",
    gradient: "from-amber-500/10 to-amber-600/10"
  },
  video: {
    label: "Video",
    icon: <Video className="w-3.5 h-3.5" />,
    classes: "bg-white/90 text-blue-700 border border-blue-200/50",
    gradient: "from-blue-500/10 to-blue-600/10"
  },
};

const ResourceCard: React.FC<ResourceCardProps> = ({ id, imageSrc, title, views, likes, type }) => {
  const navigate = useNavigate();
  
  const handleViewDetail = async () => {
    try {
      await api.patch(`/lessons/${id}/views`);
    } catch (err) {
      console.error("Lỗi khi tăng views:", err);
    } finally {
      navigate(`/resource/${id}`);
    }
  };

  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2">
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-video bg-gray-100">
        <img 
          src={imageSrc} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Type Badge - Glass morphism style */}
        {type && (
          <div className={`absolute top-4 left-4 inline-flex items-center gap-2 text-xs font-bold px-3.5 py-2 rounded-full backdrop-blur-md ${typeConfig[type].classes} shadow-xl ring-1 ring-white/20`}>
            {typeConfig[type].icon}
            <span className="tracking-wide">{typeConfig[type].label}</span>
          </div>
        )}

        {/* Quick Stats Overlay on Hover */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
          <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg">
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs font-bold text-gray-800">{views.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg">
            <Heart className="w-3.5 h-3.5 text-red-500" />
            <span className="text-xs font-bold text-gray-800">{likes.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-gray-800 font-bold text-lg mb-4 line-clamp-2 min-h-[3.5rem] leading-snug group-hover:text-blue-600 transition-colors duration-300">{title}</h3>

        {/* Stats Row */}
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-300">
          <div className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors">
            <Eye className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-all" />
            <span className="text-sm font-medium">{views.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-3 text-gray-600 hover:text-red-500 transition-colors">
            <Heart className="w-5 h-5 group-hover:text-red-600 group-hover:text-red-500 transition-all" />
            <span className="text-sm font-medium">{likes.toLocaleString()}</span>
          </div>
        </div>

        {/* Button */}
        <button onClick={handleViewDetail}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-5 py-3 rounded-xl font-semibold text-sm shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]">
          Xem chi tiết
        </button>
      </div>
    </div>
  );
};

export default ResourceCard;