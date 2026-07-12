import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TestHeaderProps {
  session: any;
  onGoBack: () => void;
  isView: boolean;
  currentPart: number;
}

const TestHeader: React.FC<TestHeaderProps> = ({
  session,
  onGoBack,
  isView,
  currentPart
}) => {
  const navigate = useNavigate();
  const sessionType = session?.sessionType || "full-test";
  const LISTENING_PARTS = [1, 2, 3, 4];
  const hasListeningPart = session?.testConfig?.selectedParts?.some(
  (part: number) => LISTENING_PARTS.includes(part));

  let audioSrc = null

  if (sessionType === "full-test") {
    audioSrc = session?.audio
  } else if (sessionType === "practice") {
    audioSrc = session?.partsAudio?.[currentPart] || null
  }
  return (
    <div className="w-full flex items-center justify-between mb-5">
      {/* Return button */}
      <div
        className="group flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-all font-medium w-fit cursor-pointer"
        onClick={() => {
          if (!isView) {
            const confirmLeave = window.confirm("Bạn có chắc muốn thoát không? Bài thi sẽ được tạm dừng.");
            if (confirmLeave) navigate("/");
          } else {
            onGoBack();
          }
        }}
      >
        <div className="p-1.5 rounded-full bg-gray-100 group-hover:bg-blue-100 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </div>
        <span>{isView ? "Trở về" : "Thoát"}</span>
      </div>

      {/* Audio player */}
      {hasListeningPart && audioSrc && (
        <div className="flex-1 flex justify-center">
          <audio
            key={audioSrc}
            controls
            className="w-full max-w-2xl rounded-full bg-gray-100"
            src={audioSrc}
          >
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  )
};

export default TestHeader;