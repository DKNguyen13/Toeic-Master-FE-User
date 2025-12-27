import api from "../../../config/axios";
import React, { useEffect, useState } from "react";
import { X, BookOpen, CaseUpper } from "lucide-react";

interface FlashcardSet {
  _id: string;
  name: string;
}

interface Props {
  defaultText: string;
  onClose: () => void;
  onSuccess?: () => void;
  onNeedUpgrade: (message: string) => void;
}

const FlashcardModal: React.FC<Props> = ({
  defaultText,
  onClose,
  onSuccess,
  onNeedUpgrade,
}) => {
  const [sets, setSets] = useState<FlashcardSet[]>([]);
  const [selectedSet, setSelectedSet] = useState("");
  const [newSetName, setNewSetName] = useState("");
  const [setMode, setSetMode] = useState<"existing" | "new">("existing");

  const [word, setWord] = useState(defaultText.slice(0, 100));
  const [meaning, setMeaning] = useState("");
  const [example, setExample] = useState("");
  const [note, setNote] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .get("/flashcard-set")
      .then((res) => setSets(res.data.data || []))
      .catch(() => {});
  }, []);

  const handleSubmit = async () => {
    if (!word || !meaning) {
      setError("Từ và nghĩa không được bỏ trống");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let setId = selectedSet;

      // Create flashcard set
      if (!setId && newSetName) {
        const resSet = await api.post("/flashcard-set", {
          name: newSetName,
        });
        setId = resSet.data.data._id;
      }

      if (!setId) {
        setError(
          "Vui lòng chọn bộ flashcard trước khi thêm từ vựng. Nếu không có hãy tạo bộ mới!"
        );
        setLoading(false);
        return;
      }

      // Create flashcard
      await api.post("/flashcard", {
        set: setId,
        word,
        meaning,
        example,
        note,
      });

      onSuccess?.();
      onClose();
    } catch (err: any) {
      if (err.response?.status === 403) {
        onNeedUpgrade(err.response.data.message);
        return;
      }
      setError(err.response?.data?.message || "Không thể tạo flashcard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-800">
              Tạo Flashcard Mới
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Flashcard Set Selection */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Flashcard Set
            </label>

            {/* Mode Toggle */}
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => {
                  setSetMode("existing");
                  setNewSetName("");
                }}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  setMode === "existing"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Chọn set có sẵn
              </button>
              <button
                type="button"
                onClick={() => {
                  setSetMode("new");
                  setSelectedSet("");
                }}
                className={`flex-1 px-4 py-2 text-sm text-black font-medium rounded-lg transition-all ${
                  setMode === "new"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Tạo set mới
              </button>
            </div>

            {/* Conditional Input */}
            {setMode === "existing" ? (
              <select
                className="w-full border border-slate-300 rounded-lg text-black px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                value={selectedSet}
                onChange={(e) => setSelectedSet(e.target.value)}
              >
                <option value="">-- Chọn một set --</option>
                {sets.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            ) : (
              <div>
                <input
                  placeholder="Nhập tên set mới..."
                  className="w-full border border-slate-300 rounded-lg text-black px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={newSetName}
                  maxLength={25}
                  onChange={(e) => setNewSetName(e.target.value)}
                />
                <CaseUpper className="w-4 h-4 text-blue-500 inline-block mr-2" />
                <span className="text-xs text-gray-500">
                  {newSetName.length}/25 ký tự
                </span>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-500 uppercase tracking-wide">
              Nội dung từ vựng mới
            </span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Flashcard Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Từ / Cụm từ <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={word}
                maxLength={100}
                onChange={(e) => setWord(e.target.value)}
                placeholder="Nhập từ hoặc cụm từ..."
              />
              <CaseUpper className="w-4 h-4 text-blue-500 inline-block mr-2" />
              <span className="text-xs text-gray-500">
                {word.length}/100 ký tự
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Nghĩa <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={meaning}
                maxLength={100}
                onChange={(e) => setMeaning(e.target.value)}
                placeholder="Nhập nghĩa..."
              />
              <CaseUpper className="w-4 h-4 text-blue-500 inline-block mr-2" />
              <span className="text-xs text-gray-500">
                {meaning.length}/100 ký tự
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Ví dụ
              </label>
              <textarea
                className="w-full border border-slate-300 text-black rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                value={example}
                maxLength={200}
                onChange={(e) => setExample(e.target.value)}
                placeholder="Thêm câu ví dụ (tùy chọn)..."
                rows={2}
              />
              <CaseUpper className="w-4 h-4 text-blue-500 inline-block mr-2" />
              <span className="text-xs text-gray-500">
                {example.length}/200 ký tự
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Ghi chú
              </label>
              <textarea
                className="w-full border border-slate-300 text-black rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                value={note}
                maxLength={200}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Thêm ghi chú (tùy chọn)..."
                rows={2}
              />
              <CaseUpper className="w-4 h-4 text-blue-500 inline-block mr-2" />
              <span className="text-xs text-gray-500">
                {note.length}/200 ký tự
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Đang lưu..." : "Lưu Flashcard"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardModal;
