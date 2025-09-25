import React, { useState, useEffect } from "react";
import ResourceCard from "../../components/ResourceCard";
import api from "../../config/axios";

const itemsPerPage = 9;

const types = [
  { key: "all", label: "Tất cả" },
  { key: "vocabulary", label: "Từ vựng" },
  { key: "reading", label: "Đọc hiểu" },
  { key: "grammar", label: "Ngữ pháp" },
  { key: "video", label: "Video bài giảng" },
];

const ResourcePage: React.FC = () => {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState("all");

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await api.get("/lessons");
        setResources(res.data.data);
      } catch (err) {
        console.error("Lỗi load resources:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  // Filter theo type
  const filteredResources =
    selectedType === "all"
      ? resources
      : resources.filter((res) => res.type === selectedType);

  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredResources.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => setCurrentPage(page);

  if (loading) {
    return <p className="p-4">Đang tải dữ liệu...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="container mx-auto flex-1 py-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Tài nguyên</h2>
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 bg-white rounded-lg shadow p-4 border border-gray-300">
            <div className="mb-5">
              <input
                type="text"
                placeholder="Tìm kiếm"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <nav>
              <ul className="space-y-3 text-gray-700">
                {types.map((t) => (
                  <li key={t.key}>
                    <button
                      onClick={() => {
                        setSelectedType(t.key);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left p-2 rounded hover:bg-blue-50 ${
                        selectedType === t.key ? "bg-blue-100 font-semibold" : ""
                      }`}
                    >
                      {t.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Resource Grid */}
          <main className="flex-1">
            {filteredResources.length === 0 ? (
              <p className="text-center text-gray-600 text-lg font-medium py-20">
                Chưa có bài học
              </p>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-6">
                  {currentData.map((res) => (
                    <ResourceCard
                      key={res._id}
                      id={res._id}
                      imageSrc={res.imageSrc || "./../src/assets/images/lesson.png"}
                      title={res.title}
                      views={res.views || 0}
                      likes={res.likes || 0}
                      type={res.type}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center mt-8 space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border rounded hover:bg-blue-50 disabled:opacity-50"
                    >
                      Trang trước
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 border rounded hover:bg-blue-50 ${
                          currentPage === page ? "bg-blue-600 text-white" : ""
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border rounded hover:bg-blue-50 disabled:opacity-50"
                    >
                      Trang sau
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ResourcePage;
