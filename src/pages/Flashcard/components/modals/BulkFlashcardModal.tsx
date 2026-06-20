import React, { useState } from "react";
import api from "../../../../config/axios";
import { showToast } from "../../../../utils/toast";

interface Props {
  open: boolean;
  onClose: () => void;
  setId?: string;
  onSuccess: (newCards: any[]) => void;
}

interface Row {
  word: string;
  meaning: string;
  example?: string;
  note?: string;
}

const BulkFlashcardModal: React.FC<Props> = ({
  open,
  onClose,
  setId,
  onSuccess,
}) => {
  const [rows, setRows] = useState<Row[]>([
    { word: "", meaning: "", example: "", note: "" },
  ]);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleChange = (index: number, field: keyof Row, value: string) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const handleAddRow = () => {
    setRows([...rows, { word: "", meaning: "", example: "", note: "" }]);
  };

  const handleDeleteRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!setId) return;

    const valid = rows.filter((r) => r.word.trim() && r.meaning.trim());

    if (valid.length === 0) {
      showToast("Bạn chưa nhập dữ liệu hợp lệ!", "error", { autoClose: 600 });
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/flashcard/bulk", {
        setId,
        flashcards: valid,
      });

      onSuccess(res.data.data);
      showToast(`Đã thêm ${valid.length} flashcard!`, "success");

      setRows([{ word: "", meaning: "", example: "", note: "" }]);
      onClose();
    } catch (err: any) {
      showToast(err.response?.data?.message || "Lỗi import!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-5xl p-6 shadow-lg">
        <h2 className="text-2xl text-center font-bold mb-8 mt-2">Thêm flashcard hàng loạt</h2>

        {/* Table */}
        <div className="overflow-auto max-h-[400px] border rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="p-2 text-left">Từ vựng</th>
                <th className="p-2 text-left">Nghĩa</th>
                <th className="p-2 text-left">Ví dụ</th>
                <th className="p-2 text-left">Ghi chú</th>
                <th className="p-2 text-center"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-t">
                  <td className="p-1">
                    <input value={row.word}
                      onChange={(e) =>
                        handleChange(i, "word", e.target.value)
                      }
                      className="w-full border rounded px-2 py-1" />
                  </td>
                  <td className="p-1">
                    <input value={row.meaning}
                      onChange={(e) =>
                        handleChange(i, "meaning", e.target.value)
                      }
                      className="w-full border rounded px-2 py-1" />
                  </td>
                  <td className="p-1">
                    <input value={row.example}
                      onChange={(e) =>
                        handleChange(i, "example", e.target.value)
                      }
                      className="w-full border rounded px-2 py-1" />
                  </td>
                  <td className="p-1">
                    <input value={row.note}
                      onChange={(e) =>
                        handleChange(i, "note", e.target.value)
                      }
                      className="w-full border rounded px-2 py-1" />
                  </td>
                  <td className="text-center">
                    <button onClick={() => handleDeleteRow(i)} className="text-red-500 hover:text-red-700">
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mt-4">
          <button onClick={handleAddRow} className="px-4 py-2 rounded-xl border text-blue-600 hover:bg-blue-50">
            + Thêm dòng
          </button>

          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-xl border text-gray-600 hover:bg-gray-100">
              Hủy
            </button>

            <button onClick={handleSubmit} disabled={loading} className="px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50">
              {loading ? "Đang thêm..." : "Lưu tất cả"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkFlashcardModal;