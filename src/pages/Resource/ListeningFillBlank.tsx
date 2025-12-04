import api from "../../config/axios";
import React, { useEffect, useRef, useState } from "react";
import EmptyState from "../../components/EmptyState";
import { SpeedDropdown } from "../../layouts/common/SpeedDropdown";
import { Play, Pause, RotateCcw, CheckCircle, XCircle, Award, Clock, Circle, FileText, HelpCircle, X } from "lucide-react";

interface Blank {
  position: number;
  answer: string;
}

interface Question {
  _id: string;
  sentence: string;
  blanks: Blank[];
  userAnswers: string[];
}
  
const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export default function ListeningFillBlankOptimized(): JSX.Element {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [speechRate, setSpeechRate] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showGuide, setShowGuide] = useState(false);

  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<number | null>(null);
  
  useEffect(() => {
    const saved = localStorage.getItem("lfb_questions");
    if (saved) {
      const parsed = JSON.parse(saved);
      setQuestions(parsed.questions);
      setCurrentIndex(parsed.index);
      setSeconds(parsed.time);
      setLoading(false);
      return;
    }

    const fetchQuestions = async () => {
      try {
        const res = await api.get("/practice/random?count=25");
        const data = res.data?.data || [];
        const withUserAnswers = data.map((q: any) => ({
          ...q,
          _id: q._id.toString(),
          userAnswers: q.blanks.map(() => "")
        }));
        setQuestions(withUserAnswers);
        setLoading(false);
      } catch (err) {
        console.error("Lấy câu hỏi thất bại:", err);
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (!questions.length) return;

    const t = setTimeout(() => {
      localStorage.setItem("lfb_questions", JSON.stringify({
        questions, index: currentIndex, time: seconds
      }));
    }, 300);

    return () => clearTimeout(t);
  }, [questions, currentIndex, seconds]);

  // Timer
  useEffect(() => {
    if (!showResults) {
      timerRef.current = window.setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [showResults]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Đang tải câu hỏi...</div>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return <EmptyState message="Hệ thống hiện tại đang bảo trì. Vui lòng thử lại sau!"/>  
  }

  const current = questions[currentIndex];

  const buildSentenceWithBlanks = (q: Question) => {
    let s = q.sentence;
    q.blanks.forEach(b => {
      const reg = new RegExp(`\\b${escapeRegExp(b.answer)}\\b`, "i");
      s = s.replace(reg, "___");
    });
    return s;
  };

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = speechRate;
    u.pitch = 1;
    u.onstart = () => setIsPlaying(true);
    u.onend = () => setIsPlaying(false);
    utterRef.current = u;
    window.speechSynthesis.speak(u);
    setPlayCount((c) => c + 1);
  };

  const togglePlay = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }
    speak(current.sentence);
  };

  const setAnswer = (blankIdx: number, value: string) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[currentIndex] = {
        ...copy[currentIndex],
        userAnswers: copy[currentIndex].userAnswers.map((v, i) =>
          i === blankIdx ? value.trim().toLowerCase() : v
        )
      };
      return copy;
    });
  };

  const isQuestionCorrect = (q: Question) =>
    q.blanks.every((b, i) => b.answer.toLowerCase() === (q.userAnswers[i] || ""));

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = () => {
    let s = 0;
    questions.forEach((q) => {
      if (isQuestionCorrect(q)) s++;
    });
    setScore(s);
    setShowResults(true);
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const handleReset = async () => {
    try {
      setLoading(true);
      const res = await api.get("/practice/random?count=25");
      const data = res.data?.data || [];

      const withUserAnswers = data.map((q: any) => ({
        ...q,
        _id: q._id.toString(),
        userAnswers: q.blanks.map(() => "")
      }));

      setQuestions(withUserAnswers);
      setCurrentIndex(0);
      setPlayCount(0);
      setSeconds(0);
      setShowResults(false);
      setScore(0);
      window.speechSynthesis.cancel();
      setIsPlaying(false);

      localStorage.setItem("lfb_questions", JSON.stringify({
        questions: withUserAnswers,
        index: 0,
        time: 0
      }));

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const renderSentence = (q: Question) => {
    const blanked = buildSentenceWithBlanks(q);
    const parts = blanked.split("___");
    return (
      <div className="flex flex-wrap items-center gap-2 text-base leading-snug">
        {parts.map((part, i) => (
          <React.Fragment key={i}>
            <span className="text-gray-700">{part}</span>
            {i < q.blanks.length && (
              <input
                aria-label={`Blank ${i + 1}`}
                value={q.userAnswers[i] ?? ""}
                onChange={(e) => setAnswer(i, e.target.value)}
                disabled={showResults}
                placeholder={`(chỗ ${i + 1})`}
                className={`w-36 sm:w-44 lg:w-52 px-3 py-2 border rounded-md text-center text-sm
                  focus:outline-none focus:ring-2 focus:ring-offset-1 transition-shadow
                  ${showResults ? (q.blanks[i].answer.toLowerCase() === (q.userAnswers[i] ?? "") ?
                    "border-green-300 bg-green-50 text-green-800" :
                    "border-red-300 bg-red-50 text-red-800") :
                    "border-gray-200 focus:ring-blue-200"}`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white p-6 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white rounded-lg shadow-md flex items-center gap-4">
              <button onClick={togglePlay}
                aria-label="Play sentence"
                className="p-3 rounded-md bg-gradient-to-tr from-blue-600 to-blue-500 text-white hover:scale-105 transition-transform shadow">
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <SpeedDropdown value={speechRate} onChange={setSpeechRate} />
              <div className="text-sm text-slate-600 leading-relaxed py-1">
                <div className="font-semibold text-base mb-1">Luyện nghe - Điền từ</div>
                <div className="text-sm">Nhấn play để nghe, sau đó điền từ vào chỗ trống</div>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-6 text-base text-slate-600">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                <span className="font-medium">{formatTime(seconds)}</span>
              </div>

              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-500" />
                <span className="font-medium">{currentIndex + 1}/{questions.length}</span>
              </div>

              <div className="flex items-center gap-2">
                <Circle className="w-4 h-4 text-slate-500" />
                <span className="font-medium">{playCount}x</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setShowGuide(true)}
              className="p-2 rounded-full bg-gray-400 text-white hover:bg-gray-500 transition-colors"
              title="Hướng dẫn sử dụng">
              <HelpCircle className="w-5 h-5" />
            </button>

            <button onClick={() => { window.speechSynthesis.cancel(); speak(current.sentence.replace(/___/g, 'blank')); }}
              className="text-sm px-3 py-2 rounded-md border hover:bg-slate-200"
              title="Phát lại">
              Phát lại
            </button>

            <button onClick={() => { setQuestions((qs) => qs.map(q => ({ ...q, userAnswers: q.blanks.map(() => "") }))); }}
              className="text-sm px-3 py-2 rounded-md border hover:bg-slate-200"
              title="Xóa câu đã điền">
              <RotateCcw className="inline w-4 h-4 mr-2" />
              Làm mới
            </button>

            <button onClick={handleSubmit}
              className="text-sm px-3 py-2 rounded-md bg-emerald-500 text-white hover:bg-emerald-600">
              Nộp bài
            </button>
          </div>
        </header>

        {/* Card: sentence */}
        <main className="bg-white rounded-2xl shadow-sm p-6 mb-6 border">
          <div className="mb-4 font-semibold text-base text-gray-800">Câu {currentIndex + 1}</div>
          <div className="rounded-lg p-4 bg-gradient-to-r from-white to-slate-50 border border-gray-300">
            {renderSentence(current)}
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-xs text-slate-500">Nhấn ? để xem hướng dẫn chi tiết</div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="px-4 py-2 bg-gray-100 rounded-md disabled:opacity-50 hover:bg-gray-200">
                ← Trước
              </button>

              {currentIndex === questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
                >
                  Nộp bài
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Sau →
                </button>
              )}
            </div>
          </div>
        </main>

        {/* Small pager dots */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {questions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to question ${idx + 1}`}
              className={`min-w-[36px] h-9 rounded-md text-sm px-3 flex items-center justify-center border transition-colors ${
                idx === currentIndex ? "bg-blue-600 text-white" : "bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {/* Results panel */}
        {showResults && (
          <section className="bg-white rounded-2xl shadow-sm p-6 border">
            <div className="flex items-center gap-4 mb-4">
              <Award className="w-10 h-10 text-amber-400" />
              <div>
                <div className="text-lg font-semibold">Hoàn thành</div>
                <div className="text-sm text-slate-600">Điểm: {score}/{questions.length} — {Math.round((score / questions.length) * 100)}%</div>
                <div className="text-xs text-slate-500">Thời gian: {formatTime(seconds)}</div>
              </div>
            </div>

            <div className="grid gap-3">
              {questions.map((q, qi) => {
                const ok = isQuestionCorrect(q);
                return (
                  <div key={q._id} className={`p-3 rounded-md border ${ok ? 'border-green-100 bg-green-50' : 'border-red-100 bg-red-50'}`}>
                    <div className="flex items-start gap-3">
                      <div>{ok ? <CheckCircle className="w-6 h-6 text-green-600" /> : <XCircle className="w-6 h-6 text-red-600" />}</div>
                      <div>
                        <div className="font-medium">Câu {qi + 1}</div>
                        <div className="text-sm text-slate-700">{q.sentence}</div>
                        {!ok && (
                          <div className="mt-1 mb-1 text-xs">
                            <div><strong>Đáp án của bạn:</strong> {q.userAnswers.map(a => a || '—').join(', ')}</div>
                            <div><strong>Đáp án đúng:</strong> {q.blanks.map(b => b.answer).join(', ')}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex gap-3 justify-center">
              <button onClick={handleReset} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Làm lại</button>
            </div>
          </section>
        )}

        {/* Guide Modal */}
        {showGuide && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Hướng dẫn sử dụng</h2>
                <button 
                  onClick={() => setShowGuide(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <h3 className="font-semibold text-blue-900 mb-2">Mục đích</h3>
                  <p className="text-blue-800 text-sm">
                    Luyện kỹ năng nghe hiểu tiếng Anh thông qua bài tập điền từ vào chỗ trống.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Cách làm bài:</h3>
                  <ol className="space-y-3 text-sm text-gray-700">
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-600 min-w-[24px]">1.</span>
                      <span>Nhấn nút <strong>Play ▶️</strong> để nghe câu tiếng Anh</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-600 min-w-[24px]">2.</span>
                      <span>Điền từ bạn nghe được vào các ô trống (chỗ trống)</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-600 min-w-[24px]">3.</span>
                      <span>Bạn có thể nghe lại nhiều lần bằng nút <strong>Phát lại</strong></span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-600 min-w-[24px]">4.</span>
                      <span>Sử dụng nút <strong>← Trước</strong> và <strong>Sau →</strong> để chuyển câu</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-600 min-w-[24px]">5.</span>
                      <span>Khi hoàn thành tất cả, nhấn <strong>Nộp bài</strong> để xem kết quả</span>
                    </li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">⚙️ Các tính năng:</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600">🔊</span>
                      <div>
                        <strong>Tốc độ nghe:</strong> Điều chỉnh tốc độ phát từ 0.5x đến 1.5x
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600">⏱️</span>
                      <div>
                        <strong>Đồng hồ:</strong> Theo dõi thời gian làm bài của bạn
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600">🔄</span>
                      <div>
                        <strong>Làm mới:</strong> Xóa tất cả câu trả lời đã điền
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600">📊</span>
                      <div>
                        <strong>Tiến độ:</strong> Xem bạn đã làm được bao nhiêu câu
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                  <h3 className="font-semibold text-amber-900 mb-2">💡 Lưu ý:</h3>
                  <ul className="space-y-1 text-sm text-amber-800">
                    <li>• Viết đúng chính tả (không cần viết hoa chữ cái đầu)</li>
                    <li>• Có thể nghe lại nhiều lần để nghe rõ hơn</li>
                    <li>• Thử điều chỉnh tốc độ nghe nếu thấy quá nhanh</li>
                    <li>• Kết quả sẽ hiển thị ngay sau khi nộp bài</li>
                  </ul>
                </div>

                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <h3 className="font-semibold text-green-900 mb-2">🎓 Mẹo học tập:</h3>
                  <ul className="space-y-1 text-sm text-green-800">
                    <li>• Nghe câu hoàn chỉnh trước khi điền</li>
                    <li>• Tập trung vào ngữ cảnh của câu</li>
                    <li>• Nghe lại phần khó nhiều lần</li>
                    <li>• Kiên nhẫn và thực hành đều đặn</li>
                  </ul>
                </div>

                <div className="pt-4 border-t">
                  <button
                    onClick={() => setShowGuide(false)}
                    className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                  >
                    Đã hiểu, bắt đầu làm bài!
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}