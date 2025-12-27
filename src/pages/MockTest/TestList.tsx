import React, { useEffect, useMemo, useState } from "react";
import api from "../../config/axios";
import TestCard from "./component/TestCard";
import { getAllTest } from "../../service/testService";
import Pagination from "../../components/common/Pagination/Pagination";
import LoadingSkeleton from "../../components/common/LoadingSpinner/LoadingSkeleton";
import { FileText, Search, X } from "lucide-react";
import Fuse from "fuse.js";

interface TestListProps {
  limit?: number; // Giới hạn số test mỗi trang
  showPagination?: boolean; // Ẩn/hiện phân trang
  compact?: boolean;
}

interface Test {
  slug: string;
  title: string;
  description?: string;
  statistics?: {
    totalAttempts?: number;
    totalComments?: number;
  };
}

const TestList: React.FC<TestListProps> = ({
  limit = 9,
  showPagination = true,
  compact = false,
}) => {
  const [allTests, setAllTests] = useState<Test[]>([]); // Toàn bộ data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fuseOptions = {
    keys: ["title", "description"],
    threshold: 0.4,
    distance: 100,
    minMatchCharLength: 2,
    ignoreLocation: true,
  };

  // Fetch toàn bộ data 1 lần khi component mount
  useEffect(() => {
    const fetchAllTests = async () => {
      setLoading(true);
      try {
        // Fetch tất cả bằng cách set limit lớn hoặc gọi API đặc biệt
        const response = await getAllTest(1, 1000); // Hoặc endpoint /api/tests/all
        if (!response) {
          setError("Không có đề thi nào");
          return;
        }
        setAllTests(response.tests || []);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllTests();
  }, []); // Chỉ fetch 1 lần

  // Fuzzy search trên TOÀN BỘ data
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return allTests; // Trả về tất cả nếu không search
    }
    const fuse = new Fuse(allTests, fuseOptions);
    const results = fuse.search(searchQuery);
    return results.map((result) => result.item);
  }, [allTests, searchQuery]);

  // Tự phân trang frontend
  const displayData = useMemo(() => {
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    return {
      items: searchResults.slice(startIndex, endIndex),
      total: searchResults.length,
    };
  }, [searchResults, currentPage, limit]);

  // Reset về trang 1 khi search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  if (loading) return <LoadingSkeleton />;
  if (error)
    return (
      <div className="flex justify-center items-center mt-12">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );

  const containerClass = compact
    ? "flex flex-row gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent snap-x snap-mandatory"
    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 max-w-[1000px] mx-auto justify-center";

  return (
    <section
      className={`flex flex-col items-center ${
        compact ? "" : "justify-center mt-12"
      }`}
    >
      {!compact && (
        <div className="w-full max-w-[1100px] flex flex-col items-center mb-8 text-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Danh sách đề thi
            </h2>
          </div>
          <p className="text-gray-600 mt-2 text-base max-w-xl mb-6">
            Lựa chọn đề thi TOEIC phù hợp để ôn luyện và kiểm tra trình độ.
          </p>

          {/* Enhanced Search Box */}
          <div className="w-full max-w-xl">
            <div className="relative group">
              <div
                className={`absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-blue-600 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500 ${
                  searchQuery ? "opacity-60" : ""
                }`}
              ></div>

              <div className="relative bg-white rounded-2xl shadow-xl">
                <div className="flex items-center px-5 py-4">
                  <Search
                    className={`w-5 h-5 transition-colors duration-300 ${
                      searchQuery ? "text-blue-600" : "text-gray-400"
                    }`}
                  />

                  <input
                    type="text"
                    placeholder="Nhập từ khóa: TOEIC Test 1, Listening..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-4 py-1 text-base text-gray-800 placeholder-gray-400 bg-transparent border-none outline-none"
                  />

                  {searchQuery && (
                    <button
                      onClick={handleClearSearch}
                      className="p-2 rounded-full bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-500 transition-all duration-300 transform hover:scale-110 hover:rotate-90"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {searchQuery && (
                  <div className="px-5 pb-3 flex items-center justify-between border-t border-gray-100 pt-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <p className="text-sm text-gray-600">
                        Tìm thấy{" "}
                        <span className="font-bold text-blue-600">
                          {displayData.total}
                        </span>{" "}
                        kết quả
                      </p>
                    </div>

                    <div className="px-3 py-1 bg-blue-50 rounded-full border border-blue-200">
                      <span className="text-xs text-blue-700 font-medium">
                        "{searchQuery}"
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick suggestions */}
            <div className="mt-4 flex flex-wrap justify-items-start gap-2">
              <span className="text-xs text-gray-500 self-center">Gợi ý:</span>
              {["Test 1", "Test 2"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  className="px-3 py-1 text-xs font-medium text-gray-700 bg-white rounded-full border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600 hover:shadow-md transition-all duration-300 transform hover:scale-105"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div>
        {displayData.items.length === 0 && searchQuery ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              Không tìm thấy đề thi nào phù hợp với "{searchQuery}"
            </p>
            <button
              onClick={handleClearSearch}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Xóa tìm kiếm
            </button>
          </div>
        ) : (
          <>
            <div className={containerClass}>
              {displayData.items.map((item, index) => (
                <TestCard
                  key={index}
                  slug={item.slug}
                  title={item.title}
                  questions={200}
                  time={120}
                  attempts={item.statistics?.totalAttempts || 0}
                  totalComments={item.statistics?.totalComments || 0}
                />
              ))}
            </div>

            {showPagination && displayData.total > limit && (
              <Pagination
                totalItems={displayData.total}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                itemsPerPage={limit}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default TestList;
