import React from "react";
import { ArrowLeft } from "lucide-react";

interface TestHeaderProps {
  session: any;
  onGoBack: () => void;
  isView: boolean;
}

const TestHeader: React.FC<TestHeaderProps> = ({
  session,
  onGoBack,
  isView,
}) => {
  return (
    <div className="w-full flex items-center justify-between mb-5">
      {/* Return button */}
      <div className="
          inline-flex items-center gap-2 text-base text-main
          cursor-pointer transition-colors duration-200 
          hover:text-blue-600
        "
        onClick={onGoBack}
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{isView ? "Trở về" : "Thoát"}</span>
      </div>

      {/* Audio player */}
      {/* session?.sessionType === "full-test" &&  */}
      {session?.audio && (
        <div className="flex-1 flex justify-center">
          <audio
            controls
            className="w-full max-w-2xl rounded-full bg-gray-100"
            src={session?.audio}
          >
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default TestHeader;
