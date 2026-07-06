import api from "../../../config/axios";
import FlashcardItem from "./FlashcardItem";
import { useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { showToast } from "../../../utils/toast";
import FlashcardQuiz from "./modes/FlashcardQuiz";
import React, { useEffect, useState } from "react";
import FlashcardModal from "./modals/FlashcardModal";
import FlashcardMatrix from "./modes/FlashcardMatrix";
import FlashcardDictation from "./modes/FlashcardDictation";
import EditFlashcardModal from "./modals/EditFlashcardModal";
import ConfirmDeleteModal from "./modals/ConfirmDeleteModal";
import BulkFlashcardModal from "./modals/BulkFlashcardModal";
import FlashcardRandomMode from "./modes/FlashcardRandomMode";
import { ArrowLeft, Book, Check, ChevronDown } from "lucide-react";
import UpgradeModal from "../../../components/common/UpgradeModal";
import FlashcardShadowingMode from "./modes/FlashcardShadowingMode";
import FlashcardTrueFalseMode from "./modes/FlashcardTrueFalseMode";
import FlashcardListenPickMode from "./modes/FlashcardListenPickMode";
import Pagination from "../../../components/common/Pagination/Pagination";
import { Flashcard, MODE_CONFIG, ModeKey, UserTier } from "../types/flashcardModes";
import { useWrongWords } from "../../../hooks/useWrongWords";
import WrongWordsModal from "./modals/WrongWordsModal";

interface FlashcardListProps {
  setId?: string;
  type?: "myList" | "explore";
  onBack?: () => void;
}

const FlashcardList: React.FC<FlashcardListProps> = ({ setId, type: propType, onBack, }) => {
  const location = useLocation();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ word: "", meaning: "", example: "", note: "" });
  const [randomIndex, setRandomIndex] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [quizDirection, setQuizDirection] = useState<"en2vi" | "vi2en">("en2vi");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [canQuiz, setCanQuiz] = useState(true);
  const [correctCard, setCorrectCard] = useState<Flashcard | null>(null);
  const [error, setError] = useState("");
  const [deleteCardId, setDeleteCardId] = useState<string | null>(null);
  const [userTier, setUserTier] = useState<UserTier>("free");
  const type = propType || location.state?.type || "myList";
  const editable = type === "myList";
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeMode, setUpgradeMode] = useState<ModeKey | null>(null);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [openMode, setOpenMode] = useState(false);
  const [openDirection, setOpenDirection] = useState(false);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const FLASHCARD_PER_PAGE = type === "myList" ? 10 : 12;

  const [mode, setMode] = useState<ModeKey>(() => {
    return (localStorage.getItem("flashcard_mode") as ModeKey) || "ALL";
  });

  const { wrongWords, addWrongWord } = useWrongWords(setId, mode);
  const [isPracticeWrong, setIsPracticeWrong] = useState(false);
  const [showWrongWordsModal, setShowWrongWordsModal] = useState(false);

  const activeFlashcards = isPracticeWrong
    ? flashcards.filter(card =>
        wrongWords.some(w => (w._id && card._id && w._id === card._id) || w.word.trim().toLowerCase() === card.word.trim().toLowerCase())
      )
    : flashcards;

  const checkPremium = async () => {
    try {
      const res = await api.get("/auth/me");
      setUserTier(res.data.data.tier);
    } catch {
      setUserTier("free");
    }
  };

  const tierOrder: Record<UserTier, number> = {
    free: 0,
    basic: 1,
    advanced: 2,
    premium: 3,
  };

  const isLockedMode = (key: ModeKey) => {
    const m = MODE_CONFIG.find((x) => x.key === key);

    if (!m?.requiredTier) return false;
    return tierOrder[userTier] < tierOrder[m.requiredTier];
  };

  const getRequiredTier = (key: ModeKey) => {
    const mode = MODE_CONFIG.find(m => m.key === key);
    return mode?.requiredTier;
  };

  const closeModal = () => {
    setShowModal(false);
    setError("");
  };

  const fetchFlashcards = async () => {
    if (!setId) return;
    try {
      setLoading(true);
      const url = type === "explore" ? "/flashcard/free" : "/flashcard";
      const res = await api.get(url, { params: { set: setId } });
      setFlashcards(res.data.data || []);
    } catch (err: any) {
      showToast(err.response?.data?.message || "Không thể tải flashcard!", "error", { autoClose: 1000 });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!form.word || !form.meaning) {
      setError("Từ và nghĩa không được bỏ trống!");
      return;
    }
    if (!setId) return;

    try {
      const res = await api.post("/flashcard", { ...form, set: setId });
      setFlashcards((prev) => [...prev, res.data.data]);
      setShowModal(false);
      setForm({ word: "", meaning: "", example: "", note: "" });
      showToast("Thêm flashcard thành công!", "success", { autoClose: 1000 });
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Lỗi khi tạo flashcard!");
    }
  };

  const confirmDeleteCard = async () => {
    if (!deleteCardId) return;
    try {
      await api.delete(`/flashcard/${deleteCardId}`);
      setFlashcards(prev => prev.filter(f => f._id !== deleteCardId));
      showToast("Xóa flashcard thành công!", "success", { autoClose: 1000 });
    } catch (err: any) {
      showToast(err.response?.data?.message || "Không thể xóa flashcard!", "error", { autoClose: 1000 });
    } finally {
      setDeleteCardId(null);
    }
  };

  const handleUpdateFlashcard = async (updatedCard: Flashcard) => {
    try {
      const res = await api.put(`/flashcard/${updatedCard._id}`,
        {
          word: updatedCard.word,
          meaning: updatedCard.meaning,
          example: updatedCard.example,
          note: updatedCard.note,
        }
      );

      setFlashcards(prev =>
        prev.map(card =>
          card._id === updatedCard._id
            ? res.data.data
            : card
        )
      );

      showToast("Cập nhật flashcard thành công!", "success", { autoClose: 1000 });
      setEditingCard(null);
    } catch (err: any) {
      showToast(err.response?.data?.message || "Không thể cập nhật flashcard!", "error");
    }
  };

  const generateQuiz = () => {
    if (activeFlashcards.length < 4) {
      setCanQuiz(false);
      return;
    }

    const shuffled = [...activeFlashcards].sort(() => Math.random() - 0.5);
    const correct = shuffled[0];
    setCorrectCard(correct);

    const wrongOptions: string[] = [];
    for (let i = 1; i < shuffled.length && wrongOptions.length < 3; i++) {
      const value = quizDirection === "en2vi" ? shuffled[i].meaning : shuffled[i].word;
      const correctValue = quizDirection === "en2vi" ? correct.meaning : correct.word;
      if (value !== correctValue && !wrongOptions.includes(value)) {
        wrongOptions.push(value);
      }
    }

    if (wrongOptions.length < 3) {
      setCanQuiz(false);
      return;
    }

    const options = [quizDirection === "en2vi" ? correct.meaning : correct.word, ...wrongOptions];
    setQuizOptions(options.sort(() => Math.random() - 0.5));
    setSelectedOption(null);
    setCanQuiz(true);
  };

  const handleNextQuiz = () => {
    setQuizIndex(prev => (prev + 1) % activeFlashcards.length);
    generateQuiz();
  };

  const handleOptionClick = (option: string) => {
    if (selectedOption) return;
    setSelectedOption(option);

    if (!correctCard) return;

    const correct = quizDirection === "en2vi" ? correctCard.meaning : correctCard.word;

    if (option === correct) setScore(prev => prev + 1);
  };

  useEffect(() => {
    fetchFlashcards();
  }, [setId]);

  useEffect(() => {
    checkPremium();
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;

      const modeEl = document.getElementById("mode-dropdown");
      const directionEl = document.getElementById("direction-dropdown");

      if (modeEl && !modeEl.contains(target)) {
        setOpenMode(false);
      }

      if (directionEl && !directionEl.contains(target)) {
        setOpenDirection(false);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  useEffect(() => {
    if (mode !== "TRUE_FALSE") {
      setIsPracticeWrong(false);
    }
    if (mode === "RANDOM") setRandomIndex(0);
    if (mode === "QUIZ") generateQuiz();
  }, [mode, activeFlashcards, quizDirection]);

  const getPaginatedFlashcards = () => {
    const start = (currentPage - 1) * FLASHCARD_PER_PAGE;
    return activeFlashcards.slice(start, start + FLASHCARD_PER_PAGE);
  };

  const paginatedFlashcards = getPaginatedFlashcards();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="relative mb-8">
          {onBack && (
            <button
              onClick={onBack}
              className="absolute left-0 top-1/2 -translate-y-1/2 group flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-all font-medium w-fit"
            >
              <div className="p-1.5 rounded-full bg-gray-100 group-hover:bg-blue-100 transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </div>
              <span>Quay lại</span>
            </button>
          )}

          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">📚 Flashcards</h1>
            <p className="text-gray-600">Học từ vựng hiệu quả với flashcards</p>
          </div>
        </div>

        {/* Mode Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-wrap items-center justify-center gap-4">

            {/* Custom Dropdown */}
            <div className="flex items-center gap-3 relative">
              <label className="text-sm font-semibold text-gray-700">Chế độ học:</label>
              <div id="mode-dropdown" className="relative">
                {/* Button */}
                <button
                  onClick={() => setOpenMode(prev => !prev)}
                  className="min-w-[210px] flex items-center justify-between px-4 py-2 border-2 border-gray-200 rounded-xl bg-white text-sm font-medium hover:border-gray-300 transition-all">
                  <span>
                    {MODE_CONFIG.find(m => m.key === mode)?.icon}{" "}
                    {MODE_CONFIG.find(m => m.key === mode)?.label}
                  </span>
                  <ChevronDown size={16} />
                </button>

                {/* Dropdown */}
                {openMode && (
                  <div className="absolute top-full left-0 mt-2 w-[210px] bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                    {MODE_CONFIG.map((m) => {
                      const locked = isLockedMode(m.key);
                      const active = mode === m.key;

                      return (
                        <button key={m.key}
                          onClick={() => {
                            if (locked) {
                              setUpgradeMode(m.key);
                              setShowUpgradeModal(true);
                              setOpenMode(false);
                              return;
                            }

                            setMode(m.key);
                            localStorage.setItem("flashcard_mode", m.key);
                            setOpenMode(false);
                          }}
                          className={`w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-gray-50 transition
                            ${active ? "bg-blue-50 text-blue-600 font-semibold" : ""}
                          `}>
                          <span>{m.icon} {m.label} {locked && " 🔒"}</span>
                          {active && <Check size={16} />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {mode === "QUIZ" && flashcards.length >= 4 && (
              <div className="flex items-center gap-2 relative">
                <label className="text-sm font-semibold text-gray-700">Chuyển đổi:</label>

                {/* Button */}
                <div id="direction-dropdown" className="relative">
                  <button onClick={() => setOpenDirection(prev => !prev)}
                    className="flex items-center justify-between gap-2 px-4 py-2 min-w-[120px] border-2 border-gray-200 rounded-xl bg-white text-sm font-medium hover:border-gray-300 transition">
                    <span>
                      {quizDirection === "en2vi" ? "Anh → Việt" : "Việt → Anh"}
                    </span>
                    <span className="text-gray-400">▾</span>
                  </button>

                  {/* Dropdown */}
                  {openDirection && (
                    <div className=" absolute top-full left-0 mt-2 w-[130px] bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                      <button
                        onClick={() => {
                          setQuizDirection("en2vi");
                          setOpenDirection(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50
                          ${quizDirection === "en2vi" ? "bg-blue-50 text-blue-600 font-semibold" : ""}`}>
                        Anh → Việt
                      </button>

                      <button
                        onClick={() => {
                          setQuizDirection("vi2en");
                          setOpenDirection(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50
                         ${quizDirection === "vi2en" ? "bg-blue-50 text-blue-600 font-semibold" : ""}`}>
                        Việt → Anh
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Wrong Words Button */}
            {mode === "TRUE_FALSE" && (
              <button
                onClick={() => setShowWrongWordsModal(true)}
                className="flex items-center gap-2 px-4 py-2 border-2 border-red-200 rounded-xl bg-red-50 text-red-700 text-sm font-semibold hover:bg-red-100 transition-all duration-200"
              >
                📝 Từ sai ({wrongWords.length})
              </button>
            )}
          </div>
        </div>

        {/* Wrong Words Practice Indicator Banner */}
        {isPracticeWrong && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-8 flex flex-wrap items-center justify-between gap-4 animate-fadeIn">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <p className="font-bold text-red-800 text-sm">Chế độ: Luyện từ sai</p>
                <p className="text-xs text-red-600">Đang luyện tập {activeFlashcards.length} từ trả lời chưa chính xác trong bộ này.</p>
              </div>
            </div>
            <button
              onClick={() => setIsPracticeWrong(false)}
              className="px-4 py-2 bg-white border border-red-300 text-red-700 hover:bg-red-50 text-xs font-semibold rounded-xl transition"
            >
              Học tất cả từ
            </button>
          </div>
        )}

        {/* Content Area */}
        {mode === "QUIZ" ? (
          <FlashcardQuiz
          canQuiz={canQuiz}
          quizDirection={quizDirection}
          correctCard={correctCard}
          quizOptions={quizOptions}
          selectedOption={selectedOption}
          score={score}
          onSelectOption={handleOptionClick}
          onNext={handleNextQuiz}
          />
        ) : mode === "RANDOM" ? (
          <FlashcardRandomMode
          flashcards={activeFlashcards}
          editable={editable && !isPracticeWrong}
          onDelete={(id) => setDeleteCardId(id)}
          onEdit={(card) => setEditingCard(card)}
          onUpdateFlashcards={setFlashcards}
          setId={setId}
          />
        ) : mode === "MATCH" ? (
          activeFlashcards.length > 0 ? (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-300 p-6">
              <FlashcardMatrix flashcards={activeFlashcards} />
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
                <span className="text-3xl">🧩</span>
              </div>
              <p className="text-xl font-semibold text-gray-700 mb-2">
                Chưa có flashcard!
              </p>
              <p className="text-gray-500">
                Hãy thêm flashcard để chơi chế độ tìm cặp
              </p>
            </div>
          )
        ): mode === "DICTATION" ? (
          <FlashcardDictation flashcards={activeFlashcards} />
        ) : mode === "TRUE_FALSE" ? (
          <FlashcardTrueFalseMode flashcards={activeFlashcards} onWrongAnswer={addWrongWord} />
        ) : mode === "LISTEN_PICK" ? (
          <FlashcardListenPickMode flashcards={activeFlashcards} />
        ) : mode === "SHADOWING" ? (
          <FlashcardShadowingMode flashcards={activeFlashcards} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {editable && !isPracticeWrong && (
              <div onClick={() => setShowModal(true)}
              className="group border-3 border-dashed border-blue-300 rounded-3xl flex flex-col justify-center items-center h-64 text-blue-500 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all duration-300 transform hover:scale-105">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <span className="text-3xl text-blue-500 font-bold">+</span>
                </div>
                <p className="font-semibold text-lg">Thêm flashcard</p>
                <p className="text-sm text-blue-400 mt-1 text-center">
                  Nhấn để tạo mới
                </p>
              </div>
            )}
            {editable && !isPracticeWrong && (
              <div onClick={() => setShowBulkModal(true)}
                className="group border-3 border-dashed border-green-300 rounded-3xl flex flex-col justify-center items-center h-64 text-green-500 hover:border-green-400 hover:bg-green-50 cursor-pointer transition-all duration-300 transform hover:scale-105">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <span className="text-3xl text-green-400 font-bold">+</span>
                </div>
                <p className="font-semibold text-lg">Thêm hàng loạt</p>
                <p className="text-sm text-green-400 mt-1 text-center">Dán nhiều từ vựng cùng lúc</p>
              </div>
            )}

            {activeFlashcards.length > 0 ? (
              paginatedFlashcards.map((card) => (
                <FlashcardItem
                  key={card._id}
                  flashcard={card}
                  onDelete={
                    editable && !isPracticeWrong ? (id) => setDeleteCardId(id) : undefined
                  }
                  onEdit={
                    editable && !isPracticeWrong ? (card) => setEditingCard(card) : undefined
                  }
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-200">
                <div className="p-4 bg-blue-50 rounded-full mb-4">
                  <Book className="w-10 h-10 text-blue-500" />
                </div>

                <h3 className="text-lg font-bold text-gray-700 mb-2">
                  {isPracticeWrong
                    ? "Không có từ sai nào để hiển thị"
                    : editable
                    ? "Chưa có flashcard nào"
                    : "Set này chưa có flashcard"}
                </h3>
                {editable && !isPracticeWrong && (
                  <p className="text-gray-500 text-sm text-center max-w-xs">
                    Nhấn vào nút '+' để tạo các từ vựng đầu tiên!
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {mode === "ALL" && activeFlashcards.length > FLASHCARD_PER_PAGE && (
          <Pagination
            totalItems={activeFlashcards.length}
            currentPage={currentPage}
            itemsPerPage={FLASHCARD_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        )}

        {editable && showModal && (
          <FlashcardModal
          form={form}
          error={error}
          onChange={(field, value) => setForm({ ...form, [field]: value })}
          onAdd={handleAdd}
          onClose={closeModal}
          />
        )}

        {editingCard && (
          <EditFlashcardModal
            flashcard={editingCard}
            onClose={() => {
              setEditingCard(null);
              setError("");
            }}
            onSave={handleUpdateFlashcard}
          />
        )}

        <BulkFlashcardModal
          open={showBulkModal}
          onClose={() => setShowBulkModal(false)}
          setId={setId}
          onSuccess={(newCards) =>
            setFlashcards((prev) => [...prev, ...newCards])
          }
        />

        <ConfirmDeleteModal
          open={!!deleteCardId}
          message="Bạn có chắc muốn xóa flashcard này? Hành động này không thể hoàn tác."
          onCancel={() => setDeleteCardId(null)}
          onConfirm={confirmDeleteCard}
        />
        
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          title="Nâng cấp tài khoản"
          description={
            upgradeMode
              ? (() => {
                  const required = getRequiredTier(upgradeMode);
                  if (!required) return "";
                  switch (required) {
                    case "basic": return "Bạn cần gói Basic để sử dụng tính năng này.";
                    case "advanced": return "Bạn cần gói Advanced để sử dụng tính năng này.";
                    case "premium": return "Bạn cần gói Premium để sử dụng tính năng này.";
                    default: return "";
                  }
                })()
              : ""
          }
        />

        <WrongWordsModal
          open={showWrongWordsModal}
          onClose={() => setShowWrongWordsModal(false)}
          onStartPractice={() => setIsPracticeWrong(true)}
          setId={setId}
          mode={mode}
        />
      </div>
    </div>
  )
};

export default FlashcardList;