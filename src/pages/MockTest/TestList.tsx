import React, { useEffect, useMemo, useState } from "react";
import api from "../../config/axios";
import TestCard from "./component/TestCard";
import { getAllTest } from "../../service/testService";
import Pagination from "../../components/common/Pagination/Pagination";
import LoadingSkeleton from "../../components/common/LoadingSpinner/LoadingSkeleton";
import { FileText, Search, X, Calendar } from "lucide-react";
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
  defaultConfig?: {
    timeLimit?: number;
    parts?: number[];
  };
  statistics?: {
    totalAttempts?: number;
    totalComments?: number;
  };
  publishedAt?: string;
  createdAt?: string;
}

const getTestYear = (test: Test) => {
  // 1. Tìm năm 4 chữ số bắt đầu bằng 20 trong title (ví dụ: ETS 2024 Test 1 -> 2024)
  const titleMatch = test.title.match(/\b(20\d{2})\b/);
  if (titleMatch) {
    return titleMatch[1];
  }
  // 2. Nếu không có, lấy năm từ publishedAt hoặc createdAt
  const dateStr = test.publishedAt || test.createdAt;
  if (dateStr) {
    return String(new Date(dateStr).getFullYear());
  }
  return null;
};

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
  const [selectedYear, setSelectedYear] = useState<string>("all");

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
        const response = await getAllTest(1, 1000);
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
  }, []);

  // Lấy danh sách các năm xuất hiện trong danh sách đề thi (luôn bao gồm 2026, 2025, 2024 làm mặc định)
  const availableYears = useMemo(() => {
    const yearsSet = new Set<string>(["2026", "2025", "2024", "2023"]);
    allTests.forEach((test) => {
      const year = getTestYear(test);
      if (year) {
        yearsSet.add(year);
      }
    });
    // Sắp xếp các năm từ mới nhất đến cũ nhất
    return Array.from(yearsSet).sort((a, b) => b.localeCompare(a));
  }, [allTests]);

  // Fuzzy search và lọc theo năm ra mắt
  const filteredAndSearchedResults = useMemo(() => {
    let tempResults = allTests;
    if (searchQuery.trim()) {
      const fuse = new Fuse(allTests, fuseOptions);
      const results = fuse.search(searchQuery);
      tempResults = results.map((result) => result.item);
    }

    if (selectedYear !== "all") {
      tempResults = tempResults.filter((test) => {
        const year = getTestYear(test);
        return year === selectedYear;
      });
    }

    return tempResults;
  }, [allTests, searchQuery, selectedYear]);

  // Tự phân trang frontend
  const displayData = useMemo(() => {
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    return {
      items: filteredAndSearchedResults.slice(startIndex, endIndex),
      total: filteredAndSearchedResults.length,
    };
  }, [filteredAndSearchedResults, currentPage, limit]);

  // Reset về trang 1 khi search hoặc thay đổi bộ lọc
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedYear]);

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

  if (compact) {
    return (
      <section className="flex flex-col items-center">
        <div className={containerClass}>
          {displayData.items.map((item, index) => (
            <TestCard
              key={index}
              slug={item.slug}
              title={item.title}
              questions={200}
              time={item.defaultConfig?.timeLimit || 120}
              attempts={item.statistics?.totalAttempts || 0}
              totalComments={item.statistics?.totalComments || 0}
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="w-full flex flex-col min-h-screen">
      {/* Header */}
      <div
        className="w-full shadow-lg py-10 px-8"
        style={{
          background:
            "linear-gradient(to right, #f1eadfff 0%, #D6EAF8 60%, #D6EAF8 100%)",
        }}
      >
        <div className="flex flex-col items-start mb-4">
          <span className="text-3xl font-bold text-black flex items-center gap-2">
            📝 Danh sách đề thi
          </span>
        </div>
        <p className="text-gray-600 text-lg max-w-full">
          Lựa chọn đề thi TOEIC phù hợp để ôn luyện và kiểm tra trình độ.
        </p>
      </div>

      {/* Main Content with Sidebar and Grid */}
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 items-start justify-center px-4 lg:px-8">
        <div className="container mx-auto py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-80 flex-shrink-0">
              <div className="sticky top-8 space-y-8">
                {/* Search Box */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <label className="block text-md font-bold text-gray-700 mb-3">
                    Tìm kiếm đề thi
                  </label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Nhập từ khóa..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-sm"
                    />
                    {searchQuery && (
                      <button
                        onClick={handleClearSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-500 transition-all duration-300"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Suggestions inside Search Box */}
                  <div className="mt-4 flex flex-wrap justify-items-start gap-2">
                    <span className="text-[11px] text-gray-400 self-center">Gợi ý:</span>
                    {["Test 1", "Test 2"].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSearchQuery(tag)}
                        className="px-2 py-0.5 text-[11px] font-medium text-gray-600 bg-white rounded-full border border-gray-200 hover:border-blue-500 hover:text-blue-600 transition-all duration-300"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Year Filter */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <label className="block text-md font-bold text-gray-700 mb-4">
                    Đề thi theo năm
                  </label>
                  <nav className="space-y-2">
                    <button
                      onClick={() => setSelectedYear("all")}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                        selectedYear === "all"
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-400/50"
                          : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                      }`}
                    >
                      <div className={selectedYear === "all" ? "text-white" : "text-gray-400"}>
                        <Calendar className="w-5 h-5" />
                      </div>
                      <span className="flex-1 text-left">Tất cả các năm</span>
                      {selectedYear === "all" && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </button>

                    {availableYears.map((year) => (
                      <button
                        key={year}
                        onClick={() => setSelectedYear(year)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                          selectedYear === year
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-400/50"
                            : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                        }`}
                      >
                        <div className={selectedYear === year ? "text-white" : "text-gray-400"}>
                          <Calendar className="w-5 h-5" />
                        </div>
                        <span className="flex-1 text-left">Năm {year}</span>
                        {selectedYear === year && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Stats Card */}
                <div className="bg-gray-500 rounded-2xl shadow-lg p-6 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                      <FileText className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-lg">Thống kê đề thi</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-100 text-sm">Tổng số đề</span>
                      <span className="font-bold text-xl">{allTests.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-100 text-sm">Đang hiển thị</span>
                      <span className="font-bold text-xl">{filteredAndSearchedResults.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Test Cards Grid */}
            <main className="flex-1">
              {filteredAndSearchedResults.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-md">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-xl font-medium text-gray-600 mb-2">Không tìm thấy đề thi phù hợp</p>
                  <p className="text-gray-500 mb-4">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
                  {(searchQuery || selectedYear !== "all") && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedYear("all");
                      }}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Xóa bộ lọc
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mb-8 justify-items-center">
                    {displayData.items.map((item, index) => (
                      <TestCard
                        key={index}
                        slug={item.slug}
                        title={item.title}
                        questions={200}
                        time={item.defaultConfig?.timeLimit || 120}
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
            </main>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestList;
