import React, { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  XCircle,
  Award,
  Clock,
  Circle,
  FileText
} from "lucide-react";
import { SpeedDropdown } from "../../layouts/common/SpeedDropdown";

interface Blank {
  position: number;
  answer: string;
}

interface Question {
  id: number;
  sentence: string;
  blanks: Blank[];
  userAnswers: string[];
}

export default function ListeningFillBlankOptimized(): JSX.Element {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      sentence:
        "The train will arrive at the station by 3 PM, and passengers should prepare their tickets.",
      blanks: [
        { position: 0, answer: "train" },
        { position: 1, answer: "prepare" }
      ],
      userAnswers: ["", ""]
    },
    {
      id: 2,
      sentence: "Please ___ the documents before the ___ tomorrow morning.",
      blanks: [
        { position: 0, answer: "submit" },
        { position: 1, answer: "deadline" }
      ],
      userAnswers: ["", ""]
    }
  ]);

  const buildSentenceWithBlanks = (q: Question) => {
    let s = q.sentence;
    q.blanks.forEach(b => {
      const reg = new RegExp("\\b" + b.answer + "\\b", "i");
      s = s.replace(reg, "___");
    });
    return s;
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [speechRate, setSpeechRate] = useState(1);

  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<number | null>(null);

  const current = questions[currentIndex];

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

  // Input handling
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
    }
  };
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      window.speechSynthesis.cancel();
      setIsPlaying(false);
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

  const handleReset = () => {
    setQuestions((prev) => prev.map((q) => ({ ...q, userAnswers: q.blanks.map(() => "") })));
    setCurrentIndex(0);
    setPlayCount(0);
    setSeconds(0);
    setShowResults(false);
    setScore(0);
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  // Render the sentence with compact inline inputs
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
            <button
              onClick={() => { window.speechSynthesis.cancel(); speak(current.sentence.replace(/___/g, 'blank')); }}
              className="text-sm px-3 py-2 rounded-md border hover:bg-slate-50"
              title="Phát lại chậm"
            >
              Phát lại
            </button>

            <button onClick={() => { setQuestions((qs) => qs.map(q => ({ ...q, userAnswers: q.blanks.map(() => "") }))); }}
              className="text-sm px-3 py-2 rounded-md border hover:bg-slate-50"
              title="Xóa câu đã điền">
              <RotateCcw className="inline w-4 h-4 mr-2" />
              Làm mới
            </button>
          </div>
        </header>

        {/* Card: sentence */}
        <main className="bg-white rounded-2xl shadow-sm p-6 mb-6 border">
          <div className="mb-4 font-semibold text-base text-gray-800">Câu {currentIndex + 1}</div>
          <div className="rounded-lg p-4 bg-gradient-to-r from-white to-slate-50 border border-gray-100">
            {renderSentence(current)}
          </div>

          {/* Inline small helper + accessibility */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-xs text-slate-500">Viết đúng chính tả — không cần hoa chữ cái.</div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="px-4 py-2 bg-gray-100 rounded-md disabled:opacity-50"
              >
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

        {/* Progress bar */}
        <div className="mb-6">
          <div className="text-xs text-slate-500 mb-2">Tiến độ</div>
          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
            <div
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-width"
            />
          </div>
        </div>

        {/* Small pager dots */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {questions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to question ${idx + 1}`}
              className={`min-w-[36px] h-9 rounded-md text-sm px-3 flex items-center justify-center border ${
                idx === currentIndex ? "bg-blue-600 text-white" : "bg-white text-slate-700"
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
                  <div key={q.id} className={`p-3 rounded-md border ${ok ? 'border-green-100 bg-green-50' : 'border-red-100 bg-red-50'}`}>
                    <div className="flex items-start gap-3">
                      <div>{ok ? <CheckCircle className="w-6 h-6 text-green-600" /> : <XCircle className="w-6 h-6 text-red-600" />}</div>
                      <div>
                        <div className="font-medium">Câu {qi + 1}</div>
                        <div className="text-sm text-slate-700">{q.sentence}</div>
                        {!ok && (
                          <div className="mt-1 text-xs">
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
              <button onClick={handleReset} className="px-4 py-2 bg-blue-500 text-white rounded-md">Làm lại</button>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
