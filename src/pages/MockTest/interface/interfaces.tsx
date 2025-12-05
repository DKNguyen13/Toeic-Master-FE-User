
export interface Choice {
  _id: string;
  label: string;      // Ví dụ: "A", "B", "C", "D"
  text: string;       // Nội dung đáp án
  isCorrect?: boolean; // Đúng hay sai
  isUserChoice?: boolean;
}

export interface Group {
  groupId: string;
  image?: string[];
  audio?: string;
  text?: string;
}

export interface AnswerState {
  selectedAnswer: "A" | "B" | "C" | "D" | null;
  timeSpent: number;
  isSkipped: boolean;
  isFlagged: boolean;
}

export interface UserAnswerResult {
  questionId: string;
  selectedAnswer: "A" | "B" | "C" | "D" | null;
  isCorrect: boolean;
  timeSpent: number;
  isSkipped: boolean;
  isFlagged: boolean;
  explanation?: string;
}

export interface Question {
  id: string;
  question: string | null;
  questionNumber: number;
  globalQuestionNumber: number; // số thứ tự toàn bài
  partNumber: number;           // part nào
  group: Group;
  choices: Choice[];
  userAnswer?: AnswerState | null;
  answerState?: AnswerState;
  answerResult?: UserAnswerResult | null; // chỉ dùng khi review kết quả
}

export interface SessionProgress {
  answeredCount: number;
  completionPercentage: number; // dạng number
  totalQuestions: number;
}

export interface SessionTestConfig {
  allowReview: boolean;
  selectedParts: number[];
  shuffleQuestions: boolean;
  timeLimit: number; // phút
}

export interface TestId {
  _id: string;
  audio: string;
  title: string;
  testCode: string;
}

export interface Session {
  id: string;
  sessionType: "full-test" | "practice";
  sessionCode?: string; // từ API trả về ở getSessionQuestions
  testConfig: SessionTestConfig;
  progress: SessionProgress;
  testId: TestId;
  timeRemaining: number; // milliseconds còn lại
}

export interface UnsentAnswer {
  questionId: string;
  selectedAnswer: string | null;
  timeSpent?: number;
  isFlagged?: boolean;
}