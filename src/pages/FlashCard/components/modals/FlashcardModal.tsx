import React from "react";
import { Flashcard } from "../FlashcardList";

type FlashcardFields = "word" | "meaning" | "example" | "note";

interface FlashcardModalProps {
  form: Flashcard;
  error: string;
  onChange: (field: FlashcardFields, value: string) => void;
  onAdd: () => void;
  onClose: () => void;
}

const FlashcardModal: React.FC<FlashcardModalProps> = ({
  form,
  error,
  onChange,
  onAdd,
  onClose,
}) => {
  const fields: FlashcardFields[] = ["word", "meaning", "example", "note"];
  const labels: Record<FlashcardFields, string> = {
    word: "Từ vựng",
    meaning: "Nghĩa",
    example: "Ví dụ",
    note: "Ghi chú",
  };
  const maxLengths: Record<FlashcardFields, number> = {
    word: 100,
    meaning: 100,
    example: 200,
    note: 200,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Tạo Flashcard Mới</h2>
          <p className="text-gray-500 mt-2">Thêm các từ mới vào bộ từ vựng của bạn</p>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        <div className="space-y-4">
          {fields.map((field) => {
            const required = field === "word" || field === "meaning";
            return (
              <div key={field}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {labels[field]} {required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  value={form[field] ?? ""}
                  maxLength={maxLengths[field]}
                  placeholder={`Nhập ${labels[field].toLowerCase()}...`}
                  onChange={(e) => onChange(field, e.target.value)}
                  className={`w-full border-2 rounded-xl px-4 py-3 transition-all duration-200 ${
                    error.toLowerCase().includes(labels[field].toLowerCase())
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                />
                <span className="text-xs text-gray-500">
                  {(form[field]?.length ?? 0)}/{maxLengths[field]} ký tự
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex gap-4 mt-8">
          <button onClick={onAdd}
            className="flex-1 px-6 py-3 text-base font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-200">
            Tạo mới
          </button>
          <button onClick={onClose}
            className="flex-1 px-6 py-3 text-base font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200">
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardModal;