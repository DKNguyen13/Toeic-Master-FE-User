import { Flashcard } from "./FlashcardList";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Volume2, VolumeX, Repeat, ChevronRight, RotateCcw, Eye, EyeOff, CheckCircle2, XCircle, BookOpen, Mic, Trophy, AlertTriangle, Send } from "lucide-react";

interface Props {
  flashcards: Flashcard[];
}

type SessionMode = "fullList" | "wrongOnly";
type CardState = "idle" | "correct" | "wrong";

interface WrongEntry {
  card: Flashcard;
  typed: string;
}

const speak = (text: string, lang: string, rate = 0.9) => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = lang;
  utt.rate = rate;
  window.speechSynthesis.speak(utt);
};

const shuffle = (arr: Flashcard[]) => {
  const newArr = [...arr];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const FlashcardDictation: React.FC<Props> = ({ flashcards }) => {
  const [sessionMode, setSessionMode] = useState<SessionMode>("fullList");
  const [queue, setQueue] = useState<Flashcard[]>([]);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [cardState, setCardState] = useState<CardState>("idle");
  const [showHint, setShowHint] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [wrongList, setWrongList] = useState<WrongEntry[]>([]);
  const [sessionDone, setSessionDone] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [showWrongPanel, setShowWrongPanel] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const loopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentCard = queue[index] ?? null;
  const [showMeaning, setShowMeaning] = useState(false);

  const getPrompt = useCallback((card: Flashcard) => card.word, []);
  const getAnswer = useCallback((card: Flashcard) => card.word, []);
  const promptLang = "en-US";

  // Build queue
  useEffect(() => {
    const src =
      sessionMode === "wrongOnly"
        ? wrongList.map((w) => w.card)
        : flashcards;
    setQueue(shuffle(src));
    setIndex(0);
    setInput("");
    setCardState("idle");
    setShowHint(false);
    setSessionDone(false);
    setCorrectCount(0);
  }, [sessionMode, flashcards, wrongList]);

  // Auto play when card changes
  useEffect(() => {
    if (currentCard && cardState === "idle") {
      speak(getPrompt(currentCard), promptLang);
      inputRef.current?.focus();
    }
  }, [index, currentCard, cardState]);

  // Loop logic
  useEffect(() => {
    if (loopRef.current) clearInterval(loopRef.current);
    if (isLooping && currentCard && cardState === "idle") {
      loopRef.current = setInterval(() => {
        speak(getPrompt(currentCard), promptLang);
      }, 3500);
    }
    return () => {
      if (loopRef.current) clearInterval(loopRef.current);
    };
  }, [isLooping, currentCard, cardState]);

  const handleSpeak = () => {
    if (!currentCard) return;
    speak(getPrompt(currentCard), promptLang);
  };

  const normalize = (s: string) =>
    s.trim().toLowerCase().replace(/\s+/g, " ");

  const handleSubmit = () => {
    if (!currentCard || cardState !== "idle") return;
    if (!input.trim()) return;
    setShowMeaning(false);

    const correct = normalize(getAnswer(currentCard));
    const typed = normalize(input);

    if (typed === correct) {
      setCardState("correct");
      setCorrectCount((p) => p + 1);
    } else {
      setCardState("wrong");
      // Add to wrong list if not already there
      setWrongList((prev) => {
        const alreadyIn = prev.some((e) => e.card._id === currentCard._id);
        if (alreadyIn) {
          return prev.map((e) =>
            e.card._id === currentCard._id ? { ...e, typed: input } : e
          );
        }
        return [...prev, { card: currentCard, typed: input }];
      });
    }
    setIsLooping(false);
  };

  const handleNext = () => {
    if (index + 1 >= queue.length) {
      setSessionDone(true);
    } else {
      setIndex((p) => p + 1);
      setInput("");
      setCardState("idle");
      setShowHint(false);
    }
  };

  const handleReset = () => {
    const src =
      sessionMode === "wrongOnly"
        ? wrongList.map((w) => w.card)
        : flashcards;
    setQueue(shuffle(src));
    setIndex(0);
    setInput("");
    setCardState("idle");
    setShowHint(false);
    setSessionDone(false);
    setCorrectCount(0);
    if (sessionMode === "wrongOnly") setWrongList([]);
  };

  const handlePracticeWrong = () => {
    setSessionMode("wrongOnly");
    setShowWrongPanel(false);
    setQueue(shuffle(wrongList.map((w) => w.card)));
    setIndex(0);
    setInput("");
    setCardState("idle");
    setShowHint(false);
    setSessionDone(false);
    setCorrectCount(0);
  };

  const handleBackToFull = () => {
    setSessionMode("fullList");
    setWrongList([]);
  };

  const accuracy =
    queue.length > 0 ? Math.round((correctCount / queue.length) * 100) : 0;

  // ─── Empty state ────
  if (flashcards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
          <Mic className="w-10 h-10 text-indigo-400" />
        </div>
        <p className="text-lg font-semibold text-gray-700">Chưa có flashcard!</p>
        <p className="text-gray-400 mt-1 text-sm">Thêm ít nhất 1 thẻ để luyện nghe chép.</p>
      </div>
    );
  }

  // ─── Session done ────
  if (sessionDone) {
    return (
      <div className="flex flex-col items-center gap-6 py-12 px-4">
        {/* Result card */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-10 w-full max-w-md text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ background: accuracy >= 80 ? "#d1fae5" : accuracy >= 50 ? "#fef9c3" : "#fee2e2" }}>
            <Trophy className={`w-10 h-10 ${accuracy >= 80 ? "text-emerald-500" : accuracy >= 50 ? "text-yellow-500" : "text-red-400"}`} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Hoàn thành!</h2>
          <p className="text-gray-500 text-sm mb-6">
            {sessionMode === "wrongOnly" ? "Luyện từ sai" : "Toàn bộ danh sách"}
          </p>

          <div className="flex justify-center gap-8 mb-8">
            <div>
              <div className="text-3xl font-bold text-emerald-500">{correctCount}</div>
              <div className="text-xs text-gray-400 mt-1">Đúng</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-400">{queue.length - correctCount}</div>
              <div className="text-xs text-gray-400 mt-1">Sai</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-500">{accuracy}%</div>
              <div className="text-xs text-gray-400 mt-1">Độ chính xác</div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button onClick={handleReset}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition">
              <RotateCcw className="w-4 h-4" /> Làm lại từ đầu
            </button>

            {wrongList.length > 0 && sessionMode === "fullList" && (
              <button onClick={handlePracticeWrong}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl font-semibold hover:bg-red-100 transition">
                <AlertTriangle className="w-4 h-4" />
                Luyện {wrongList.length} từ sai
              </button>
            )}

            {sessionMode === "wrongOnly" && (
              <button onClick={handleBackToFull}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition">
                <BookOpen className="w-4 h-4" /> Quay lại full list
              </button>
            )}
          </div>
        </div>

        {/* Wrong list summary */}
        {wrongList.length > 0 && (
          <div className="w-full max-w-md bg-white rounded-2xl border border-red-100 shadow p-5">
            <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-400" />
              Danh sách từ sai ({wrongList.length})
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {wrongList.map((e, i) => (
                <div key={i} className="bg-red-50 rounded-xl p-3 text-sm">
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-gray-800">{e.card.word}</span>
                    <span className="text-xs text-gray-400 mt-0.5">→ {e.card.meaning}</span>
                  </div>
                  <div className="mt-1 flex gap-4">
                    <span className="text-red-400">✗ {e.typed}</span>
                    <span className="text-emerald-600">✓ {e.card.word}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── Main dictation UI ────
  const progress = ((index) / queue.length) * 100;

  return (
    <div className="flex flex-col gap-5 max-w-xl mx-auto">
      {/* Top bar: session mode badge + wrong panel toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-2xl border border-gray-200 shadow-sm px-5 py-3">
        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
          <span>🎧</span>
          <span>Nghe chép chính tả</span>
        </div>

        <div className="flex items-center gap-2">
          {sessionMode === "wrongOnly" && (
            <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-1 rounded-full">
              ⚡ Luyện từ sai
            </span>
          )}
          {wrongList.length > 0 && (
            <button onClick={() => setShowWrongPanel((p) => !p)}
              className="flex items-center gap-1.5 text-xs font-semibold text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-100 transition">
              <AlertTriangle className="w-3.5 h-3.5" />
              {wrongList.length} sai
            </button>
          )}
        </div>
      </div>

      {/* Wrong list panel */}
      {showWrongPanel && wrongList.length > 0 && (
        <div className="bg-white rounded-2xl border border-red-100 shadow p-5 animate-fadeIn">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-700 flex items-center gap-2 text-sm">
              <XCircle className="w-4 h-4 text-red-400" />
              Từ sai ({wrongList.length})
            </h3>
            <button onClick={handlePracticeWrong}
              className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-red-600 transition">
              Luyện ngay
            </button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {wrongList.map((e, i) => (
                <div key={i} className="flex items-center justify-between text-sm bg-red-50 rounded-xl px-3 py-2">
                  <span className="font-medium text-gray-700">{e.card.word}</span>
                  <span className="text-gray-400 text-xs">→ {e.card.meaning}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Progress */}
      <div>
        <div className="flex justify-between text-xs font-medium text-gray-400 mb-1.5">
          <span>Thẻ {index + 1} / {queue.length}</span>
          <span className="text-emerald-500">{correctCount} đúng</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Card */}
      {currentCard && (
        <div className={`bg-white rounded-3xl border-2 shadow-md p-8 transition-all duration-300 ${
          cardState === "correct"
            ? "border-emerald-300 bg-emerald-50"
            : cardState === "wrong"
            ? "border-red-300 bg-red-50"
            : "border-gray-200"
        }`}>
          {/* Prompt area */}
          <div className="text-center mb-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              Nghe và gõ lại từ tiếng Anh
            </p>

            {/* Audio controls */}
            <div className="flex items-center justify-center gap-3 mb-5">
              <button
                onClick={handleSpeak}
                disabled={cardState !== "idle"}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-40 transition shadow-sm">
                <Volume2 className="w-4 h-4" />
                Nghe
              </button>

              <button
                onClick={() => setIsLooping((p) => !p)}
                disabled={cardState !== "idle"}
                title="Lặp lại tự động mỗi 3.5s"
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold border transition ${
                  isLooping
                    ? "bg-indigo-100 text-indigo-700 border-indigo-300"
                    : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
                } disabled:opacity-40`}>
                {isLooping ? <Repeat className="w-4 h-4 animate-spin-slow" /> : <Repeat className="w-4 h-4" />}
                {isLooping ? "Đang lặp" : "Lặp"}
              </button>

              <button
                onClick={() => setShowHint((p) => !p)}
                title="Hiện/tắt gợi ý"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold border border-gray-200 bg-gray-100 text-gray-500 hover:bg-gray-200 transition"
              >
                {showHint ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button onClick={() => setShowMeaning((p) => !p)}
                title="Hiện nghĩa"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold border border-gray-200 bg-gray-100 text-gray-500 hover:bg-gray-200 transition"
            >📖</button>
            </div>

            {/* Hint */}
            {showHint && (
              <div className="inline-block bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2 text-sm text-yellow-700 font-medium mb-2 animate-fadeIn">{getPrompt(currentCard)}</div>
            )}
            {showMeaning && (
                <div className="inline-block bg-blue-50 border border-blue-200 rounded-xl px-4 py-2 text-sm text-blue-700 font-medium mb-2 animate-fadeIn">
                    {currentCard.meaning}
                </div>
            )}
          </div>

          {/* Input */}
          <div className="space-y-3">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (cardState === "idle") handleSubmit();
                  else handleNext();
                }
              }}
              disabled={cardState !== "idle"}
              placeholder="Gõ từ tiếng Anh..."
              className={`w-full border-2 rounded-2xl px-5 py-4 text-base font-medium transition-all outline-none focus:ring-2 ${
                cardState === "correct"
                  ? "border-emerald-400 bg-emerald-50 text-emerald-800 focus:ring-emerald-200"
                  : cardState === "wrong"
                  ? "border-red-400 bg-red-50 text-red-800 focus:ring-red-200"
                  : "border-gray-200 focus:border-indigo-400 focus:ring-indigo-100"
              }`}
            />

            {/* Feedback */}
            {cardState === "correct" && (
              <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm animate-fadeIn">
                <CheckCircle2 className="w-5 h-5" />
                Chính xác!
              </div>
            )}
            {cardState === "wrong" && (
              <div className="animate-fadeIn space-y-1">
                <div className="flex items-center gap-2 text-red-500 font-semibold text-sm">
                  <XCircle className="w-5 h-5" />
                  Chưa đúng rồi!
                </div>
                <div className="bg-white border border-red-200 rounded-xl px-4 py-2 text-sm">
                  <span className="text-gray-400">Đáp án: </span>
                  <span className="font-bold text-gray-800">{getAnswer(currentCard)}</span>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-1">
              {cardState === "idle" ? (
                <button onClick={handleSubmit}
                  disabled={!input.trim()}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 disabled:opacity-40 transition shadow-sm">
                  <Send className="w-4 h-4" /> Nộp
                </button>
              ) : (
                <button onClick={handleNext}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition shadow-sm">
                  Tiếp theo <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-center text-xs text-gray-400">
              {cardState === "idle" ? "Nhấn Enter hoặc nút nộp để kiểm tra" : "Nhấn Enter hoặc Tiếp theo để tiếp tục"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardDictation;