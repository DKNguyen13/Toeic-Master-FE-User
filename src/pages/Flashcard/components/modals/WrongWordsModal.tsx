import React from "react";
import { useWrongWords } from "../../../../hooks/useWrongWords";
import { Trash2, Play, X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onStartPractice: () => void;
  setId?: string;
  mode?: string;
}

const WrongWordsModal: React.FC<Props> = ({ open, onClose, onStartPractice, setId, mode }) => {
  const { wrongWords, removeWrongWord, clearWrongWords } = useWrongWords(setId, mode);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 animate-fadeIn p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl p-6 shadow-xl border border-gray-100 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📝</span>
            <h2 className="text-xl font-bold text-gray-800">Danh sách từ sai ({wrongWords.length})</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
          {wrongWords.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <div className="text-4xl mb-3">🎉</div>
              <p className="font-semibold text-lg">Tuyệt vời! Danh sách từ sai trống.</p>
              <p className="text-sm text-gray-400 mt-1">Hãy tiếp tục phát huy ở các phần luyện tập nhé!</p>
            </div>
          ) : (
            wrongWords.map((card) => (
              <div
                key={card._id || card.word}
                className="flex items-center justify-between p-4 bg-red-50/50 hover:bg-red-50 border border-red-100 rounded-2xl transition duration-200"
              >
                <div className="space-y-1">
                  <p className="font-bold text-gray-800 text-lg">{card.word}</p>
                  <p className="text-sm text-gray-600 font-medium">{card.meaning}</p>
                  {card.example && (
                    <p className="text-xs text-gray-400 italic mt-1">VD: {card.example}</p>
                  )}
                </div>

                <button
                  onClick={() => removeWrongWord(card._id || card.word)}
                  title="Xóa khỏi danh sách từ sai"
                  className="p-2 rounded-xl text-red-500 hover:bg-red-100 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {wrongWords.length > 0 && (
          <div className="pt-4 border-t border-gray-100 flex justify-between items-center gap-4">
            <button
              onClick={() => {
                if (window.confirm("Bạn có chắc muốn xóa tất cả từ sai?")) {
                  clearWrongWords();
                }
              }}
              className="px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold transition"
            >
              Xóa tất cả
            </button>

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-semibold transition"
              >
                Đóng
              </button>

              <button
                onClick={() => {
                  onStartPractice();
                  onClose();
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Play size={16} fill="white" />
                Luyện từ sai
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WrongWordsModal;
