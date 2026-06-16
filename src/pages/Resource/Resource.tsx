import type { LucideIcon } from "lucide-react";
import { showToast } from "../../utils/toast";
import React, { useState, useEffect } from "react";
import api, { isLoggedIn } from "../../config/axios";
import lessonImg from "../../assets/images/lesson.png";
import LoginModal from "../../layouts/common/LoginModal";
import ResourceCard from "../../components/ResourceCard";
import UpgradeModal from "../../components/common/UpgradeModal";
import Pagination from "../../components/common/Pagination/Pagination";
import LoadingSkeleton from "../../components/common/LoadingSpinner/LoadingSkeleton";
import { Book, BookOpen, Clipboard, Layers, Search, Star, Video } from "lucide-react";

const itemsPerPage = 9;

const types: { key: string; label: string; icon: LucideIcon }[] = [
  { key: "all", label: "Tất cả", icon: Layers },
  { key: "vocabulary", label: "Từ vựng", icon: Book },
  { key: "reading", label: "Đọc hiểu", icon: BookOpen },
];

const ResourcePage: React.FC = () => {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showLogin, setShowLoginModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const endpoint = isLoggedIn() ? "/lessons" : "/lessons/public";
        const res = await api.get(endpoint);
        setResources(res.data.data);
      } catch (err) {
        console.error("Lỗi load resources:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const handleListenFillClick = async () => {
    if (!isLoggedIn()) {
      setShowLoginModal(true);
      return;
    }

    try {
      const res = await api.get("/auth/check-vip");
      if (res.data.data?.access) {
        window.location.href = "/practice/listen-fill";
      } else {
        setShowUpgradeModal(true);
      }
    } catch (err: any) {
      if (err.response?.status === 403) {
        setShowUpgradeModal(true);
      } else {
        showToast(err.response?.data?.message || "Hệ thống đang bảo trì!", "error");
      }
    }
  };

  // Filter theo type và search
  const filteredResources = resources
    .filter((res) => 
      selectedType === "all" || res.type === selectedType
    )
    .filter((res) =>
      res.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredResources.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => setCurrentPage(page);

  if (loading) return <LoadingSkeleton/>;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="w-full shadow-lg py-10 px-8"
        style={{
          background:
            "linear-gradient(to right, #f1eadfff 0%, #D6EAF8 60%, #D6EAF8 100%)",
        }}>
        <div className="flex flex-col items-start mb-4">
          <i className="far fa-clone text-4xl mr-4 text-white"></i>
          <span className="text-3xl font-bold text-black">
            📖 Danh sách bài học
          </span>
        </div>

        {/* Mô tả */}
        <p className="text-gray-600 text-lg max-w-full">
          Danh sách bài học và tài liệu giúp bạn ôn luyện và cải thiện kỹ năng TOEIC của mình.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 items-start justify-center px-4 lg:px-8">
        <div className="container mx-auto py-8">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar */}
            <aside className="lg:w-80 flex-shrink-0">
              <div className="sticky top-6 space-y-6">
                {/* Search Box */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                  <label className="block text-md font-bold text-gray-700 mb-3">
                    Tìm kiếm
                  </label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="text"
                      placeholder="Nhập từ khóa..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Filter Navigation */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                  <label className="block text-md font-bold text-gray-700 mb-4">
                    Loại bài học
                  </label>
                  <nav className="space-y-2">
                    {types.map((t) => {
                      const Icon = t.icon;
                      return (
                        <button
                          key={t.key}
                          onClick={() => {
                            setSelectedType(t.key);
                            setCurrentPage(1);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                            selectedType === t.key
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-400/50"
                              : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                          }`}
                        >
                          <div className={selectedType === t.key ? "text-white" : "text-gray-400"}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="flex-1 text-left">{t.label}</span>
                          {selectedType === t.key && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Premium Quick Access */}
                <div className="bg-yellow-500 rounded-2xl shadow-lg p-6 text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                      <Star className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg">Luyện nghe và điền từ</span>
                  </div>
                  <p className="text-yellow-50 text-sm mb-4">
                    Truy cập các bài luyện nghe đặc biệt
                  </p>
                  <button onClick={handleListenFillClick}
                    className="w-full bg-white text-yellow-600 font-semibold py-3 px-4 rounded-xl hover:bg-yellow-50 transition text-sm flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                    Luyện nghe ngay
                  </button>
                </div>

                {/* Stats Card */}
                <div className="bg-gray-500 rounded-2xl shadow-lg p-6 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                      <Layers className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-lg">Thống kê</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-100 text-sm">Tổng bài học</span>
                      <span className="font-bold text-xl">{resources.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-100 text-sm">Đang hiển thị</span>
                      <span className="font-bold text-xl">{filteredResources.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Resource Grid */}
            <main className="flex-1">
              {/* Premium Feature Banner */}
              <div className="mb-8">
                <div onClick={handleListenFillClick}
                  className="cursor-pointer bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-400 shadow-lg rounded-2xl p-6 hover:shadow-xl transition-all group relative overflow-hidden">
                  {/* Animated Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'radial-gradient(circle, #f59e0b 1px, transparent 1px)',
                      backgroundSize: '20px 20px'}}>
                    </div>
                  </div>

                  {/* Badge Premium */}
                  <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Premium
                  </div>

                  <div className="flex items-center gap-6 relative z-10">
                    {/* Icon */}
                    <div className="bg-gradient-to-br from-yellow-400 to-amber-500 p-6 rounded-2xl group-hover:scale-110 transition-transform shadow-lg">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                        🎧 Luyện nghe và điền từ còn thiếu
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Luyện nghe chuyên sâu với bài tập điền từ - Nâng cao khả năng nghe hiểu
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 text-yellow-700 bg-yellow-100 px-3 py-1.5 rounded-lg">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                          <span className="font-medium">Yêu cầu gói Premium</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <span>Bài tập tương tác</span>
                        </div>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="text-yellow-600 group-hover:translate-x-2 transition-transform">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {filteredResources.length === 0 ? (
                <div className="text-center py-20">
                  <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <p className="text-xl font-medium text-gray-600 mb-2">Chưa có bài học phù hợp</p>
                  <p className="text-gray-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {currentData.map((res) => (
                      <ResourceCard
                        key={res._id}
                        id={res._id}
                        imageSrc={res.imageSrc || lessonImg}
                        title={res.title}
                        views={res.views || 0}
                        likes={res.favoriteCount || 0}
                        type={res.type}
                      />
                    ))}
                  </div>

                  <Pagination
                    totalItems={filteredResources.length}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                  />
                </>
              )}
            </main>
          </div>
        </div>
      </div>
      
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />

      {showLogin && (
        <LoginModal
          isOpen={showLogin}
          onClose={() => setShowLoginModal(false)}
          onSuccess={() => setShowLoginModal(false)}
        />
      )}
    </div>
  );
};

export default ResourcePage;