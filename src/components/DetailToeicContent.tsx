import React, { useState } from "react";
import {
  Clock,
  BookOpen,
  Users,
  MessageCircle,
  CheckCircle,
  Info,
  Pin,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Select } from "../components/ui/select";

type Comment = {
  id: string;
  user: string;
  date: string; // ISO or formatted date
  text: string;
  pinned?: boolean;
};

type ToeicTestProps = {
  testName: string;
  durationMinutes: number;
  totalParts: number;
  totalQuestions: number;
  practicedCount: number;
  commentsCount: number;
  parts: Array<{
    id: number;
    title: string;
    questionCount: number;
    tags: string[];
  }>;
  comments: Comment[]; // list of comments to display
  defaultActiveTab?: "practice" | "fulltest" | "discussion";
};

type TabType = "practice" | "fulltest" | "discussion";

const DetailToeicTest: React.FC<ToeicTestProps> = ({
  testName,
  durationMinutes = 120,
  totalParts = 7,
  totalQuestions = 200,
  practicedCount,
  commentsCount,
  parts,
  comments,
  defaultActiveTab = "practice",
}) => {
  const [activeTab, setActiveTab] = useState<TabType>(defaultActiveTab);
  const [selectedParts, setSelectedParts] = useState<Set<number>>(new Set());
  const [selectedTime, setSelectedTime] = useState<string>("");

  const handlePartToggle = (partId: number) => {
    const newSelectedParts = new Set(selectedParts);
    if (newSelectedParts.has(partId)) {
      newSelectedParts.delete(partId);
    } else {
      newSelectedParts.add(partId);
    }
    setSelectedParts(newSelectedParts);
  };

  const generateTimeOptions = () => {
    const options = [] as { value: string; label: string }[];
    for (let i = 0; i <= 135; i += 5) {
      options.push({
        value: i.toString(),
        label: i === 0 ? "Unlimited" : `${i} minutes`,
      });
    }
    return options;
  };

  const handleStartPractice = (mode: "practice" | "fulltest" = "practice") => {
    const selectedPartsArray = Array.from(selectedParts);
    // nếu fulltest thì thời gian = 120, ngược lại thì lấy từ dropdown
    const timeValue =
      mode === "fulltest"
        ? "120 minutes"
        : selectedTime === "0"
        ? "unlimited"
        : selectedTime
        ? `${selectedTime} minutes`
        : "unlimited";

    console.log("Starting practice with:", {
      selectedParts: selectedPartsArray,
      timeLimit: timeValue,
      partTitles: selectedPartsArray
        .map((id) => parts.find((p) => p.id === id)?.title)
        .filter(Boolean),
    });
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const tabs = [
    { id: "practice" as TabType, label: "Practice", icon: BookOpen },
    { id: "fulltest" as TabType, label: "Full Test", icon: Clock },
    { id: "discussion" as TabType, label: "Discussion", icon: MessageCircle },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Top Info Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Stats */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {testName}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-gray-500">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                Duration: {durationMinutes} minutes
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm">
                {totalParts} parts, {totalQuestions} questions
              </span>
            </div>
          </div>
        </div>

        {/* Engagement Stats */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  {formatNumber(practicedCount)}
                </div>
                <div className="text-sm text-gray-500">practiced</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-green-600" />
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  {formatNumber(commentsCount)}
                </div>
                <div className="text-sm text-gray-500">comments</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Note */}
      <div className="bg-yellow-100 border-l-4 border-yellow-400 rounded-r-lg p-4">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-900">
            To be converted into a scaled score (e.g., up to 990 for TOEIC),
            please select <strong>FULL TEST</strong> mode.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Tab Headers */}
        <div
          className="flex border-b border-gray-200"
          role="tablist"
          aria-label="Test modes"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`${tab.id}-panel`}
                id={`${tab.id}-tab`}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-inset ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Practice Tab */}
          {activeTab === "practice" && (
            <div
              role="tabpanel"
              id="practice-panel"
              aria-labelledby="practice-tab"
              className="space-y-6"
            >
              {/* Pro Tips */}
              <div className="bg-green-100 border border-green-300 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-green-600 mb-1">
                      Pro Tips
                    </h3>
                    <p className="text-sm text-gray-900">
                      Practicing by section and selecting a suitable time limit
                      will help you focus on answering correctly instead of
                      being pressured to complete the entire test.
                    </p>
                  </div>
                </div>
              </div>

              {/* Parts Checklist */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Select Parts to Practice
                </h3>
                <div className="grid gap-3">
                  {parts.map((part) => (
                    <div
                      key={part.id}
                      className="flex items-start gap-3 p-4 bg-gray-100 rounded-lg border border-gray-200 hover:bg-gray-200 transition-colors"
                    >
                      <input
                        type="checkbox"
                        id={`part-${part.id}`}
                        checked={selectedParts.has(part.id)}
                        onChange={() => handlePartToggle(part.id)}
                        className="mt-1 w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-600 focus:ring-2"
                        aria-describedby={`part-${part.id}-description`}
                      />
                      <div className="flex-1 min-w-0">
                        <label
                          htmlFor={`part-${part.id}`}
                          className="text-sm font-medium text-gray-900 cursor-pointer"
                        >
                          {part.title} ({part.questionCount} questions)
                        </label>
                        {part.tags.length > 0 && (
                          <div
                            id={`part-${part.id}-description`}
                            className="flex flex-wrap gap-1 mt-2"
                          >
                            {part.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-200 text-gray-800 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timer Selector */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Time Limit
                </h3>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                  <div className="w-full sm:w-64">
                    <Select
                      value={selectedTime}
                      onValueChange={setSelectedTime}
                      placeholder="Select time"
                      options={generateTimeOptions()}
                    />
                  </div>
                  <Button
                    onClick={() => handleStartPractice("practice")}
                    disabled={selectedParts.size === 0}
                    className="w-full sm:w-auto"
                  >
                    Start Practice
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Full Test Tab */}
          {activeTab === "fulltest" && (
            <div
              role="tabpanel"
              id="fulltest-panel"
              aria-labelledby="fulltest-tab"
              className="text-center py-12"
            >
              <Clock className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Full Test Mode
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Take the complete {testName} under timed conditions. Your
                results will be converted to a scaled score up to 990 points.
              </p>

              <Button
                onClick={() => handleStartPractice("fulltest")}
                className="mt-4 w-full sm:w-auto"
              >
                Start Full Test
              </Button>
            </div>
          )}

          {/* Discussion Tab */}
          {activeTab === "discussion" && (
            <div
              role="tabpanel"
              id="discussion-panel"
              aria-labelledby="discussion-tab"
              className="text-center py-12"
            >
              <MessageCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Discussion Forum
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Join the discussion with {formatNumber(commentsCount)} comments
                from other test takers. Share tips, ask questions, and learn
                together.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Comments</h3>
        </div>
        <div className="p-6 space-y-4">
          {comments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Please log in to comment
            </p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className={`p-4 rounded-lg border ${
                    comment.pinned
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 bg-gray-100"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {comment.user}
                      </span>
                      {comment.pinned && (
                        <Pin className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {comment.date}
                    </span>
                  </div>
                  <p className="text-gray-900 text-sm">{comment.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailToeicTest;
