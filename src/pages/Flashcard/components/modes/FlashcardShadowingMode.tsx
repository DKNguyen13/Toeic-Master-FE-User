import { Flashcard } from "../../types/flashcardModes";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Volume2, Mic, MicOff, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  flashcards: Flashcard[];
}

const FlashcardShadowingMode: React.FC<Props> = ({ flashcards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const recognitionRef = useRef<any>(null);
  const textToSpeakRef = useRef("");

  const currentCard = flashcards[currentIndex] || null;
  const textToSpeak = currentCard?.example || currentCard?.word || "";

  useEffect(() => {
    textToSpeakRef.current = textToSpeak;
  }, [textToSpeak]);

  const normalize = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();

  const calculateAccuracy = useCallback((spoken: string) => {
    const target = textToSpeakRef.current;
    if (!target) return;

    const targetWords = normalize(target).split(" ");
    const spokenWords = normalize(spoken).split(" ");

    const targetFreq: Record<string, number> = {};
    for (const w of targetWords) {
      targetFreq[w] = (targetFreq[w] || 0) + 1;
    }

    let matchCount = 0;
    for (const w of spokenWords) {
      if (targetFreq[w] && targetFreq[w] > 0) {
        matchCount++;
        targetFreq[w]--;
      }
    }

    setAccuracy(Math.round((matchCount / targetWords.length) * 100));
  }, []);

  useEffect(() => {
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) return;

    recognitionRef.current = new SpeechRecognitionAPI();
    recognitionRef.current.lang = "en-US";
    recognitionRef.current.interimResults = false;
    recognitionRef.current.maxAlternatives = 1;

    recognitionRef.current.onresult = (event: any) => {
      const spoken = event.results[0][0].transcript.trim().toLowerCase();
      setTranscript(spoken);
      calculateAccuracy(spoken);
    };

    recognitionRef.current.onerror = () => setIsRecording(false);

    recognitionRef.current.onend = () => setIsRecording(false);

    return () => {
      recognitionRef.current?.abort();
      setIsRecording(false);
    };
  }, [calculateAccuracy]);

  const speak = () => {
    if (!textToSpeak) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = "en-US";
    utterance.rate = speed;
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const startRecording = async () => {
    if (!recognitionRef.current) return;
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      recognitionRef.current.start();
      setIsRecording(true);
      setTranscript("");
      setAccuracy(null);
    } catch {
      alert("Không thể truy cập microphone. Vui lòng kiểm tra quyền trong trình duyệt!");
    }
  };

  const stopRecording = () => recognitionRef.current?.stop();

  const resetCardState = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setTranscript("");
    setAccuracy(null);
    setIsRecording(false);
  };

  const nextCard = () => {
    resetCardState();
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const prevCard = () => {
    resetCardState();
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const getAccuracyColor = (acc: number) => {
    if (acc >= 80) return { bar: "#4F46E5", text: "#4338CA" };
    if (acc >= 50) return { bar: "#F59E0B", text: "#D97706" };
    return { bar: "#EF4444", text: "#DC2626" };
  };

  if (flashcards.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
          <Mic className="w-8 h-8 text-blue-500" />
        </div>
        <p className="text-xl font-semibold text-gray-700 mb-2">Chưa đủ flashcards!</p>
        <p className="text-gray-500">Hãy thêm flashcard để luyện phát âm</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "1.5rem 1rem", fontFamily: "inherit" }}>

      {/* ── Header card ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 40%, #EDE9FE 100%)",
          borderRadius: 20,
          padding: "1.5rem 1.75rem",
          marginBottom: "1.75rem",
          boxShadow: "0 1px 3px rgba(79,70,229,0.08)",
        }}
      >
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#6366F1", marginBottom: 6 }}>
          SHADOWING MODE
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <Mic size={20} color="#4F46E5" />
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1E1B4B", margin: 0 }}>
            Nghe và luyện phát âm
          </h2>
        </div>
        <p style={{ fontSize: 14, color: "#6366F1", marginBottom: "1.25rem" }}>
          Nghe mẫu, sau đó nói theo và kiểm tra độ khớp.
        </p>

        {/* Speed + action row */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {/* Listen button */}
          <button
            onClick={speak}
            disabled={isPlaying}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: isPlaying ? "#A5B4FC" : "#4F46E5",
              color: "#fff",
              border: "none", borderRadius: 12,
              padding: "10px 20px",
              fontSize: 14, fontWeight: 600,
              cursor: isPlaying ? "default" : "pointer",
              transition: "background 0.15s",
            }}
          >
            <Volume2 size={16} />
            {isPlaying ? "Đang phát..." : "Nghe lại"}
          </button>

          {/* Speed buttons */}
          {([0.5, 1.0, 1.5] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              style={{
                padding: "10px 16px",
                borderRadius: 12,
                border: speed === s ? "2px solid #4F46E5" : "2px solid #E0E7FF",
                background: speed === s ? "#EEF2FF" : "#fff",
                color: speed === s ? "#4338CA" : "#9CA3AF",
                fontSize: 13, fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {s === 0.5 ? "Chậm" : s === 1.0 ? "Bình thường" : "Nhanh"} {s}×
            </button>
          ))}

          {/* Hint text right-aligned */}
          <span style={{ marginLeft: "auto", fontSize: 13, color: "#6366F1", fontWeight: 500 }}>
            Nghe kỹ và nói theo
          </span>
        </div>
      </div>

      {/* ── Flashcard ── */}
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          border: "1.5px solid #E0E7FF",
          padding: "2rem 2rem 1.75rem",
          marginBottom: "1.5rem",
          boxShadow: "0 2px 8px rgba(99,102,241,0.07)",
          position: "relative",
        }}
      >
        {/* Card index badge */}
        <div
          style={{
            position: "absolute", top: 20, right: 20,
            width: 32, height: 32,
            background: "#EEF2FF",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700, color: "#6366F1",
          }}
        >
          {currentIndex + 1}
        </div>

        {/* Accent line */}
        <div style={{ width: 36, height: 3, background: "#4F46E5", borderRadius: 2, marginBottom: 16 }} />

        <h3
          style={{
            fontSize: 36, fontWeight: 700, color: "#111827",
            marginBottom: 8, lineHeight: 1.15,
          }}
        >
          {currentCard?.word}
        </h3>

        {currentCard?.meaning && (
          <p style={{ fontSize: 16, color: "#6B7280", marginBottom: currentCard?.example ? "1.25rem" : 0 }}>
            {currentCard.meaning}
          </p>
        )}

        {currentCard?.example && (
          <div
            style={{
              background: "#F5F7FF",
              borderLeft: "3px solid #6366F1",
              borderRadius: "0 10px 10px 0",
              padding: "12px 16px",
            }}
          >
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#A5B4FC", marginBottom: 4 }}>
              VÍ DỤ
            </p>
            <p style={{ fontSize: 15, color: "#374151", fontStyle: "italic", lineHeight: 1.6, margin: 0 }}>
              "{currentCard.example}"
            </p>
          </div>
        )}
      </div>

      {/* ── Record button ── */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
        <button
          onClick={isRecording ? stopRecording : startRecording}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "14px 36px",
            borderRadius: 14,
            border: isRecording ? "2px solid #EF4444" : "2px solid #E0E7FF",
            background: isRecording ? "#FEF2F2" : "#fff",
            color: isRecording ? "#DC2626" : "#4F46E5",
            fontSize: 15, fontWeight: 700,
            cursor: "pointer",
            boxShadow: isRecording
              ? "0 0 0 4px rgba(239,68,68,0.12)"
              : "0 2px 8px rgba(99,102,241,0.10)",
            transition: "all 0.2s",
          }}
        >
          {isRecording
            ? <><MicOff size={20} /> Dừng ghi âm</>
            : <><Mic size={20} /> Nói theo ngay</>
          }
        </button>
      </div>

      {/* ── Result ── */}
      {transcript && (
        <div
          style={{
            background: "#fff",
            border: "1.5px solid #E0E7FF",
            borderRadius: 16,
            padding: "1.25rem 1.5rem",
            marginBottom: "1.5rem",
            boxShadow: "0 2px 8px rgba(99,102,241,0.07)",
          }}
        >
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: "#A5B4FC", marginBottom: 8 }}>
            BẠN ĐÃ NÓI
          </p>
          <p style={{ fontSize: 16, color: "#111827", marginBottom: accuracy !== null ? 16 : 0, lineHeight: 1.5 }}>
            {transcript}
          </p>

          {accuracy !== null && (() => {
            const { bar, text } = getAccuracyColor(accuracy);
            return (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: "#6B7280" }}>Độ khớp</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: text }}>{accuracy}%</span>
                </div>
                <div style={{ height: 6, background: "#F3F4F6", borderRadius: 99, overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%", width: `${accuracy}%`,
                      background: bar,
                      borderRadius: 99,
                      transition: "width 0.5s ease",
                    }}
                  />
                </div>
                <p style={{ fontSize: 13, color: text, marginTop: 8, fontWeight: 500 }}>
                  {accuracy >= 80
                    ? "🎉 Rất tốt! Phát âm của bạn rất chuẩn."
                    : accuracy >= 50
                      ? "👍 Khá ổn! Hãy thử lại để cải thiện thêm."
                      : "💪 Tiếp tục luyện tập — nghe lại và thử thêm lần nữa!"}
                </p>
              </div>
            );
          })()}
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <button onClick={prevCard}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "10px 20px",
            borderRadius: 12,
            border: "1.5px solid #E0E7FF",
            background: "#fff",
            color: "#6366F1",
            fontSize: 14, fontWeight: 600,
            cursor: "pointer",
          }}>
          <ChevronLeft size={18} />
          Trước
        </button>

        {/* Progress dots */}
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {flashcards.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === currentIndex ? 20 : 8,
                height: 8,
                borderRadius: 99,
                background: i === currentIndex ? "#4F46E5" : i < currentIndex ? "#A5B4FC" : "#E0E7FF",
                transition: "all 0.25s",
              }}
            />
          ))}
        </div>

        <button
          onClick={nextCard}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "10px 20px",
            borderRadius: 12,
            border: "none",
            background: "#4F46E5",
            color: "#fff",
            fontSize: 14, fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Sau
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Card counter */}
      <p style={{ textAlign: "center", fontSize: 13, color: "#9CA3AF", marginTop: 16 }}>
        {currentIndex + 1} / {flashcards.length}
      </p>
    </div>
  );
};

export default FlashcardShadowingMode;