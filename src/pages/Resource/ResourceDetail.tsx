import DOMPurify from "dompurify";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Eye, Flag, Heart } from "lucide-react";
import React, { useEffect, useState } from "react";
import api, { isLoggedIn } from "../../config/axios";
import EmptyState from "../../components/EmptyState";
import LoginModal from "../../layouts/common/LoginModal";
import LoadingSkeleton from "../../components/common/LoadingSpinner/LoadingSkeleton";

const LessonDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLoginModal] = useState(!isLoggedIn());
  const [showReportModal, setShowReportModal] = useState(false);

  // State favorite
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  
  const navigate = useNavigate();

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
        const accessLevel = err.response?.data?.errors?.accessLevel || "premium";
        setLesson({
          isLocked: true,
          title: "Nâng cấp tài khoản để xem bài học này",
          content: `
            <p class="text-center">
              <span class="block text-red-600 font-semibold mb-1">
                Bài học này chỉ dành cho tài khoản ${accessLevel}
              </span>
              <span class="text-gray-600">
                Vui lòng
                <a href="/payment" class="text-blue-600 underline hover:text-blue-800 transition">
                  nâng cấp tài khoản
                </a>
                để tiếp tục 🎓
              </span>
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

  const handleReport = () => {
    if (!isLoggedIn()) {
      setShowLoginModal(true);
    } else {
      setShowReportModal(true);
    }
  };

  const confirmReport = () => {
    const titleReport = "Báo cáo lỗi: " + lesson.title.toLocaleLowerCase();
    navigate("/support", { state: { title: titleReport } });
    setShowReportModal(false);
  };

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

      {!lesson.isLocked && (
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

          {/* Report */}
          <div className={`flex items-center gap-2 cursor-pointer select-none`} onClick={handleReport}>
            <Flag className="text-yellow-600" />
            <span>Báo cáo</span>
          </div>

          {/* Type */}
          <span className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 font-medium text-sm border border-blue-100 shadow-sm">
            {lesson.type}
          </span>
        </div>
      )}

      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg">
            <h2 className="text-xl text-center font-bold mb-4">Xác nhận báo cáo</h2>
            <p className="mb-6 text-gray-700">
              Bạn có chắc muốn báo cáo bài học này? Vui lòng cho chúng tôi biết sự cố của bạn. Đội ngũ hỗ trợ sẽ xem xét và phản hồi sớm nhất!
            </p>
            <div className="flex justify-end gap-3">
              <button className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300" onClick={() => setShowReportModal(false)}>
                Hủy
              </button>
              <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600" onClick={confirmReport}>
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

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