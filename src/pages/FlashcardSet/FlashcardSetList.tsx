import api from "../../config/axios";
import { showToast } from "../../utils/toast";
import { useNavigate } from "react-router-dom";
import LoginModal from "../../layouts/common/LoginModal";
import React, { useEffect, useRef, useState } from "react";
import EditFlashcardSetModal from "./modals/EditFlashcardSetModal";
import AddFlashcardSetModal from "./modals/AddFlashcardSetModal";
import { Book, Inbox, Library, Pencil, Search, Star, Trash } from "lucide-react";
import ConfirmDeleteModal from "../FlashCard/components/modals/ConfirmDeleteModal";

export interface FlashcardSet {
  _id?: string;
  user?: string;
  name: string;
  description?: string;
  count?: number;
}

interface FlashcardSetListProps {
  type?: "myList" | "explore";
  isLoggedIn?: boolean;
}

const FlashcardSetList: React.FC<FlashcardSetListProps> = ({
  type = "myList",
  isLoggedIn = false,
}) => {
  const [sets, setSets] = useState<FlashcardSet[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [editingSet, setEditingSet] = useState<FlashcardSet | null>(null);
  const [deleteSetId, setDeleteSetId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const closeModal = () => {
    setShowModal(false);
    setError("");
  };

  const fetchSets = async () => {
    if (type === "myList" && !isLoggedIn) return;
    try {
      setLoading(true);
      const res =
        type === "myList"
          ? await api.get("/flashcard-set")
          : await api.get("/flashcard-set/free");
      setSets(res.data.data as FlashcardSet[]);
    } catch (err: any) {
      showToast(err.response?.data?.message || "Không thể tải dữ liệu!", "error", { autoClose: 1000 });         
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteSetId) return;
    try {
      await api.delete(`/flashcard-set/${deleteSetId}`);
      setSets(prev => prev.filter(s => s._id !== deleteSetId));
      showToast("Xóa bộ flashcard thành công!", "success", { autoClose: 1000 });
    } catch (err: any) {
      showToast(err.response?.data?.message || "Không thể xóa bộ flashcard!", "error", { autoClose: 1000 });
    } finally {
      setDeleteSetId(null);
    }
  };

  const handleEdit = (set: FlashcardSet) => {
    setEditingSet(set);
  };

  const handleAdd = async () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    if (!form.name) {
      setError("Vui lòng nhập tên bộ flashcard!");
      return;
    }

    try {
      const res = await api.post("/flashcard-set", form);
      setSets((prev) => [...prev, res.data.data]);
      setShowModal(false);
      setForm({ name: "", description: "" });
      showToast("Thêm bộ từ vựng thành công!", "success", { autoClose: 1000 });
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Lỗi khi tạo bộ từ vựng!");
    }
  };

  const handleSetClick = (setId?: string) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      navigate(`/flashcards/${setId}`, { state: { type } });
    }
  };

  const didFetch = useRef(false);
  
  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;
    fetchSets();
  }, [isLoggedIn, type]);

  return (
    <div className="min-h-screenp-6 pb-16">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-4 space-x-2">
            {type === "myList" ? (
              <Library className="w-6 h-6 text-blue-500" />
            ) : (
              <Star className="w-6 h-6 text-yellow-400" />
            )}
            <h1 className="text-2xl font-bold text-gray-800">
              {type === "myList" ? "Bộ Từ Vựng Của Bạn" : "Khám Phá Flashcards"}
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            {type === "myList"
              ? "Quản lý và học từ vựng của bạn một cách hiệu quả"
              : "Khám phá các bộ flashcards miễn phí từ cộng đồng"}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-56 w-full bg-white rounded-2xl animate-pulse shadow-md"
              ></div>
            ))}
          </div>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          {/* Add Button */}
          {type === "myList" && (
            <div
              onClick={() => {
                if (!isLoggedIn) setShowLoginModal(true);
                else setShowModal(true);
              }}
              className="group flex flex-col justify-center items-center h-56 bg-white border-2 border-dashed border-blue-300 rounded-2xl shadow-md hover:shadow-lg cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 p-4">
              <div className="w-20 h-20 flex items-center justify-center rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors shadow-inner">
                <span className="text-3xl text-blue-500 font-bold">+</span>
              </div>
              <p className="text-lg font-semibold text-blue-600 mt-4 text-center">Tạo Mới</p>
              <p className="text-sm text-blue-400 mt-1 text-center">Tạo bộ từ vựng của riêng bạn</p>
            </div>
            )}

            {/* Flashcard Sets */}
            {sets.length > 0 ? (
              sets.map((set) => (
                <div  key={set._id}
                  onClick={() => handleSetClick(set._id)}
                  className="group relative bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 h-56 flex flex-col justify-between cursor-pointer transform hover:scale-105 border border-gray-200 hover:border-blue-300 overflow-hidden">
                  {/* Gradient Background Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Book className="text-white text-2xl" />
                      </div>
                      {type === "myList" && isLoggedIn && (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(set);
                            }}
                            className="p-2 rounded-lg hover:bg-blue-100" title="Chỉnh sửa">
                            <Pencil size={18} className="text-blue-500" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteSetId(set._id!);
                            }}
                            className="p-2 rounded-lg hover:bg-red-100" title="Xóa">
                            <Trash size={18} className="text-red-500" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {set.name}
                    </h2>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {set.description || "Không có mô tả"}
                    </p>
                  </div>
                  
                  <div className="relative z-10 flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-600">{set.count || 0}</span>
                      </div>
                      <p className="text-xs text-gray-500 font-medium">flashcards</p>
                    </div>
                    <div className="flex items-center text-blue-500 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Học ngay</span>
                      <span className="ml-1">→</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-200">
                <div className="p-4 bg-blue-50 rounded-full mb-4">
                  {type === "myList" ? (
                    <Inbox className="w-10 h-10 text-blue-500" />
                  ) : (
                    <Search className="w-10 h-10 text-blue-500" />
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  { type === "myList" ? "Chưa có bộ từ vựng nào" : "Hiện chưa có flashcards miễn phí" }
                </h3>

                <p className="text-gray-500 text-sm text-center max-w-xs">
                  { type === "myList"
                    ? "Nhấn vào nút '+' để tạo bộ từ vựng đầu tiên và bắt đầu hành trình học tập của bạn!"
                    : "Hãy quay lại sau để khám phá các bộ flashcards mới từ cộng đồng." }
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      <AddFlashcardSetModal
        open={showModal}
        form={form}
        error={error}
        setForm={setForm}
        onClose={closeModal}
        onAdd={handleAdd}
      />

      {/* Modal update flashcard set */}
      <EditFlashcardSetModal
        open={!!editingSet}
        set={editingSet}
        onClose={() => setEditingSet(null)}
        onUpdated={(updatedSet) => {
          setSets(prev =>
            prev.map(item =>
              item._id === updatedSet._id ? updatedSet : item
            )
          );

          setEditingSet(null);
        }}
      />

      {/* Modal confirm delete */}
      <ConfirmDeleteModal
        open={!!deleteSetId}
        title="Xác nhận xóa"
        message={`Bạn có chắc muốn xóa bộ ${
          sets.find(s => s._id === deleteSetId)?.name || ""
        } này? Hành động này không thể hoàn tác.`}
        onCancel={() => setDeleteSetId(null)}
        onConfirm={confirmDelete}
      />

      {/* Modal login */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => window.location.reload()}
      />
    </div>
  );
};

export default FlashcardSetList;