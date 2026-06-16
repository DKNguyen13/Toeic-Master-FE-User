import React from "react";

interface Props {
  open: boolean;
  form: {
    name: string;
    description: string;
  };
  error: string;
  onClose: () => void;
  onAdd: () => void;
  setForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      description: string;
    }>
  >;
}

const AddFlashcardSetModal: React.FC<Props> = ({
  open,
  form,
  error,
  onClose,
  onAdd,
  setForm,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={onClose}>
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Tạo bộ từ vựng mới</h2>
          <p className="text-gray-500 mt-2">Bắt đầu xây dựng bộ từ vựng của riêng bạn</p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tên bộ từ vựng: <span className="text-red-500">*</span>
            </label>

            <input
              name="name"
              placeholder="VD: Từ vựng TOEIC Part 1..."
              maxLength={25}
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />

            <span className="text-xs text-gray-500">
              {form.name.length}/25 ký tự
            </span>

            <p className="text-red-500 text-sm mt-2">
              {error.includes("Nâng cấp VIP") ? (
                <>
                  Bạn đã đạt giới hạn bộ flashcard.{" "}
                  <a href="/payment" className="text-blue-500">
                    Nâng cấp VIP
                  </a>{" "}
                  để tạo thêm!
                </>
              ) : (
                error
              )}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Mô tả (tùy chọn):</label>

            <textarea
              name="description"
              placeholder="Thêm mô tả về bộ flashcard của bạn..."
              maxLength={25}
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
              rows={2}
            />

            <span className="text-xs text-gray-500">
              {form.description.length}/25 ký tự
            </span>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button onClick={onAdd} className="flex-1 px-6 py-3 text-base font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-200">
            Tạo mới
          </button>

          <button onClick={onClose} className="flex-1 px-6 py-3 text-base font-semibold text-gray-600 bg-gray-200 border border-gray-300 rounded-lg hover:bg-gray-300 hover:border-gray-400 transition-all duration-200">
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFlashcardSetModal;