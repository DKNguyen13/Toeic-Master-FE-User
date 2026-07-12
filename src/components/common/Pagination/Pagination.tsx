import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  totalItems: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
}

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  currentPage,
  onPageChange,
  itemsPerPage,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust start/end to keep a consistent count
      let adjustedStart = start;
      let adjustedEnd = end;
      if (currentPage <= 3) {
        adjustedEnd = 4;
      } else if (currentPage >= totalPages - 2) {
        adjustedStart = totalPages - 3;
      }

      for (let i = adjustedStart; i <= adjustedEnd; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 mt-4 mb-4 pt-6 border-t border-gray-100 w-full">
      <nav className="flex items-center space-x-1.5 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
        <button
          className="flex items-center justify-center w-9 h-9 rounded-xl text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400 disabled:cursor-not-allowed"
          disabled={currentPage === 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          aria-label="Trang trước"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {getPageNumbers().map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="w-9 h-9 flex items-center justify-center text-gray-400 select-none text-sm font-medium"
              >
                &bull;&bull;&bull;
              </span>
            );
          }

          const isCurrent = currentPage === page;
          return (
            <button
              key={page}
              className={`w-9 h-9 flex items-center justify-center text-sm font-semibold rounded-xl transition-all duration-200 ${
                isCurrent
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              }`}
              onClick={() => onPageChange(page as number)}
            >
              {page}
            </button>
          );
        })}

        <button
          className="flex items-center justify-center w-9 h-9 rounded-xl text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400 disabled:cursor-not-allowed"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          aria-label="Trang sau"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </nav>

      <div className="text-sm text-gray-500 font-medium">
        Hiển thị <span className="text-gray-800 font-semibold">{Math.min(totalItems, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(totalItems, currentPage * itemsPerPage)}</span> trong số <span className="text-gray-800 font-semibold">{totalItems}</span> kết quả
      </div>
    </div>
  );
};

export default Pagination;
