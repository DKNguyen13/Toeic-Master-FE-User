import api, { isLoggedIn } from "../../config/axios";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import LoginModal from "../../layouts/common/LoginModal";
import DOMPurify from "dompurify";
import { Eye, Heart } from "lucide-react";
import EmptyState from "../../components/EmptyState";
import LoadingSkeleton from "../../components/common/LoadingSpinner/LoadingSkeleton";

const LessonDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLoginModal] = useState(!isLoggedIn());

  // State favorite
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);

  // Fetch lesson detail
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const endpoint = isLoggedIn() ? `/lessons/${id}` : `/lessons/public/${id}`;
        const res = await api.get(endpoint);
        const data = res.data.data;
        setLesson(data);

        // Set favorite from API
        setIsFavorite(data.isFavorite || false);
        setFavoriteCount(data.favoriteCount || 0);
      } catch (err : any) {
        if (err.response?.status === 403) {
        setLesson({
          title: "Nâng cấp tài khoản để xem bài học này",
          content: `<p class='text-center text-red-500 font-semibold'>
            Bài học này chỉ dành cho tài khoản VIP.<br/>
            Vui lòng <a href="/payment" class="text-blue-600 underline hover:text-blue-800 transition">
            nhấn vào đây để nâng cấp </a>🎓
          </p>`
        });
      } else {
        setLesson(null);
      }
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [id]);

  // Toggle favorite
  const handleToggleFavorite = async () => {
    if (!lesson) return;
    if (!isLoggedIn()) {
      setShowLoginModal(true);
      return;
    }
    try {
      const res = await api.patch("/wishlist/toggle", { lessonId: lesson._id });
      setIsFavorite(res.data.data.isFavorite);
      setFavoriteCount(prev => prev + (res.data.data.isFavorite ? 1 : -1));
    } catch (err) {
      console.error("Lỗi khi cập nhật wishlist:", err);
    }
  };

  if (loading) return <LoadingSkeleton/>
  if (!lesson) return <EmptyState message="Dữ liệu bài học đang được cập nhật. Vui lòng thử lại sau!"/>

  return (
    <div className="max-w-4xl mx-auto mt-8 mb-8 bg-white p-6 rounded-xl shadow-xl">
      <h1 className="text-3xl font-bold mb-10 text-center">{lesson.title}</h1>

      <div className="flex items-center gap-6 text-gray-600 mb-6">
        {/* Views */}
        <div className="flex items-center gap-2">
          <Eye className="text-gray-400" />
          <span>{lesson.views || 0} lượt xem</span>
        </div>

        {/* Favorite */}
        <div className="flex items-center gap-2 cursor-pointer select-none"
          onClick = { handleToggleFavorite }>
          <Heart className = { isFavorite ? "text-red-500 fill-red-500" : "text-gray-400"} />
          <span>{favoriteCount} yêu thích</span>
        </div>

        {/* Type */}
        <span className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 font-medium text-sm border border-blue-100 shadow-sm">
          {lesson.type}
        </span>
      </div>

      {/* Render content */}
      <div className="article-content prose"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(lesson.content) }}
      />
      {showLogin && (
        <LoginModal
          isOpen={showLogin}
          onClose={() => {
            setShowLoginModal(false)
            setTimeout(() => setShowLoginModal(true), 100);
          }}
          onSuccess={() => {
            setShowLoginModal(false);        
          }}
        />
      )}
    </div>
  );
};

export default LessonDetailPage;
