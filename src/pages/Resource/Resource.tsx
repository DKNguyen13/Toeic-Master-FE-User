import React, { useState, useEffect } from "react";
import api, { isLoggedIn } from "../../config/axios";
import ResourceCard from "../../components/ResourceCard";
import { Book, BookOpen, Clipboard, Layers, Search, Video } from "lucide-react";
import LoadingSkeleton from "../../components/common/LoadingSpinner/LoadingSkeleton";

const itemsPerPage = 9;

const types = [
  { key: "all", label: "Tất cả", icon: <Layers className="w-5 h-5 text-gray-400" /> },
  { key: "vocabulary", label: "Từ vựng", icon: <Book className="w-5 h-5 text-gray-400" /> },
  { key: "reading", label: "Đọc hiểu", icon: <BookOpen className="w-5 h-5 text-gray-400" /> },
  { key: "grammar", label: "Ngữ pháp", icon: <Clipboard className="w-5 h-5 text-gray-400" /> },
  { key: "video", label: "Video bài giảng", icon: <Video className="w-5 h-5 text-gray-400" /> },
];

const ResourcePage: React.FC = () => {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
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
        <div className="flex flex-col items-start mb-6">
        <i className="far fa-clone text-4xl mr-4 text-white"></i>
        <span className="text-3xl font-bold text-black">
          📖 Danh sách bài học
        </span>
      </div>

      {/* Mô tả */}
      <p className="text-gray-600 mt-2 text-lg max-w-full">
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
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <label className="block text-sm font-bold text-gray-700 mb-3">
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
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <label className="block text-sm font-bold text-gray-700 mb-4">
                    Loại bài học
                  </label>
                  <nav className="space-y-2">
                    {types.map((t) => (
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
                        <div className={`${selectedType === t.key ? "text-white" : "text-gray-400"}`}>
                          {t.icon}
                        </div>
                        <span className="flex-1 text-left">{t.label}</span>
                        {selectedType === t.key && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Stats Card */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
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
                        imageSrc={res.imageSrc || "/src/assets/images/lesson.png"}
                        title={res.title}
                        views={res.views || 0}
                        likes={res.favoriteCount || 0}
                        type={res.type}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center mt-12 space-x-2">
                      <button onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>

                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        const page = currentPage > 3 ? currentPage - 2 + i : i + 1;
                        if (page > totalPages) return null;
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-4 py-2 border rounded-lg transition-all shadow-sm ${
                              currentPage === page 
                                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-md" 
                                : "bg-white border-gray-300 hover:bg-gray-50 hover:shadow-md text-gray-700"
                            }`}
                          >
                            {page === currentPage - 2 || page === currentPage + 2 ? "..." : page}
                          </button>
                        );
                      })}

                      <button onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcePage;