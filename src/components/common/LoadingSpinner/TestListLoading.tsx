import React from "react";

interface TestListLoadingProps {
  compact?: boolean;
  itemCount?: number;
}

const TestCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-w-[280px] animate-pulse">
    <div className="h-8 bg-gray-200 rounded-lg w-4/5 mb-4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </div>
    <div className="flex gap-6 mt-6">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-gray-300 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-gray-300 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  </div>
);

export default function TestListLoading({ compact = false, itemCount }: TestListLoadingProps) {
  const count = itemCount ?? (compact ? 4 : 9);

  const containerClass = compact
    ? "flex flex-row gap-4 overflow-x-auto pb-4 scrollbar-thin snap-x snap-mandatory"
    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1000px] mx-auto";

  return (
    <div className={containerClass}>
      {Array.from({ length: count }).map((_, i) => (
        <TestCardSkeleton key={i} />
      ))}
    </div>
  );
}