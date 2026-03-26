import { Flashcard } from "../../types/flashcardModes";
import React, { useState, useEffect, useRef } from "react";
import { Volume2, Mic, MicOff, RefreshCw, SkipForward } from "lucide-react";

interface Props {
  flashcards: Flashcard[];
}

const FlashcardShadowingMode: React.FC<Props> = ({ flashcards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0); // 0.5 slow, 1.0 normal, 1.5 fast
  const recognitionRef = useRef<any>(null);
  const currentCard = flashcards[currentIndex] || null;
  const textToSpeak = currentCard?.example || currentCard?.word || "";

  useEffect(() => {
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      alert("Trình duyệt của bạn không hỗ trợ Speech Recognition. Hãy thử Chrome hoặc Edge!");
      return;
    }

    recognitionRef.current = new SpeechRecognitionAPI();
    recognitionRef.current.lang = "en-US";
    recognitionRef.current.interimResults = false;
    recognitionRef.current.maxAlternatives = 1;

    recognitionRef.current.onresult = (event: any) => {
      const spoken = event.results[0][0].transcript.trim().toLowerCase();
      setTranscript(spoken);
      calculateAccuracy(spoken);
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
    };

    recognitionRef.current.onend = () => {
      setIsRecording(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const speak = () => {
    if (!textToSpeak) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = "en-US";
    utterance.rate = speed;
    utterance.onend = () => setIsPlaying(false);
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
    } catch (err) {
      console.error("Microphone access error:", err);
      alert("Không thể truy cập microphone. Vui lòng kiểm tra quyền trong trình duyệt!");
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const normalize = (text: string) => {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, " ")
        .trim();
    };

  const calculateAccuracy = (spoken: string) => {
    if (!textToSpeak) return;

    const target = normalize(textToSpeak);
    const spokenNorm = normalize(spoken);

    const targetWords = target.split(" ");
    const spokenWords = spokenNorm.split(" ");

    let matchCount = 0;

    targetWords.forEach((word) => {
        if (spokenWords.includes(word)) {
        matchCount++;
        }
    });

    const acc = Math.round((matchCount / targetWords.length) * 100);
    setAccuracy(acc);
    };

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    setTranscript("");
    setAccuracy(null);
    setIsRecording(false);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    setTranscript("");
    setAccuracy(null);
    setIsRecording(false);
  };

  const getSpeedLabel = () => {
    if (speed < 0.95) return "Chậm";
    if (speed > 1.05) return "Nhanh";
    return "Bình thường";
    };

  if (flashcards.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-xl font-semibold text-gray-700">Chưa có flashcard!</p>
        <p className="text-gray-500">Hãy thêm thẻ để luyện nói theo.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          {currentCard?.word}
        </h2>
        {currentCard?.meaning && (
          <p className="text-xl text-gray-600 mb-6">{currentCard.meaning}</p>
        )}
        {currentCard?.example && (
          <p className="text-lg text-gray-500 italic">
            Ví dụ: "{currentCard.example}"
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
        <button onClick={speak} disabled={isPlaying}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 transition shadow-md">
          <Volume2 className="w-6 h-6" />
          Nghe mẫu ({getSpeedLabel()})
        </button>

        <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))}
          className="px-4 py-3 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value={0.5}>Chậm (0.5x)</option>
          <option value={1.0}>Bình thường (1.0x)</option>
          <option value={1.5}>Nhanh (1.5x)</option>
        </select>
      </div>

      {/* Record & speak */}
      <div className="flex flex-col items-center gap-6">
        <button onClick={isRecording ? stopRecording : startRecording}
          className={`inline-flex items-center gap-3 px-10 py-5 rounded-full font-bold text-white transition shadow-lg transform hover:scale-105 active:scale-95 ${
            isRecording
              ? "bg-red-600 hover:bg-red-700 animate-pulse"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isRecording ? (
            <>
              <MicOff className="w-7 h-7" /> Dừng ghi âm
            </>
          ) : (
            <>
              <Mic className="w-7 h-7" /> Nói theo ngay
            </>
          )}
        </button>

        {transcript && (
          <div className="w-full max-w-lg bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500 mb-2">Bạn đã nói:</p>
            <p className="text-lg font-medium text-gray-800">{transcript}</p>

            {accuracy !== null && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-1">Độ khớp: {accuracy}%</p>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      accuracy >= 80
                        ? "bg-green-500"
                        : accuracy >= 50
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${accuracy}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-center gap-6 mt-8">
        <button onClick={prevCard}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-200 text-gray-800 hover:bg-gray-300 transition shadow-sm">
          <RefreshCw className="w-5 h-5" />
          Thẻ trước
        </button>

        <button onClick={nextCard}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-800 text-white hover:bg-gray-900 transition shadow-sm">
          <SkipForward className="w-5 h-5" />
          Thẻ tiếp theo
        </button>
      </div>
    </div>
  );
};

export default FlashcardShadowingMode;