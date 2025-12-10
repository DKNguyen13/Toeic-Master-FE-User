import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnswerState, Question, Session } from "../interface/interfaces";
import {
  getSession,
  getSessionResults,
  getSessionsUser,
  pauseSession,
  resumeSession,
  submitBulkAnswers,
  submitSession,
} from "../../../service/sessionService";
import { useSocket } from "../../../context/SocketContext";
import { useSocketReady } from "../../../context/useSocketReady"; // THÊM IMPORT

export const useTestSession = () => {
  const { registerSession, sendAnswer } = useSocket();
  const isSocketReady = useSocketReady(); // ✅ THÊM DÒNG NÀY
  const navigate = useNavigate();
  const { id: sessionId } = useParams();

  // State base
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentPart, setCurrentPart] = useState<number>(1);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [parts, setParts] = useState<number[]>([]);
  const [answers, setAnswers] = useState<AnswerState[]>([]);
  const [unsentAnswers, setUnsentAnswers] = useState<
    { questionId: string; selectedAnswer: string | null }[]
  >([]);
  const hasPausedRef = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (! sessionId) {
          setError("Không tìm thấy bài thi.");
          return;
        }

        const sessionData = await getSession(sessionId);
        if (!sessionData?. session) {
          setError("Bài thi không tồn tại hoặc đã bị xóa.");
          return;
        }

        setSession(sessionData.session);
        const fetchedQuestions = (sessionData.questions ??  []) as Question[];

        if (fetchedQuestions.length === 0) {
          setError("Không có câu hỏi nào trong bài thi này.");
          return;
        }

        setQuestions(fetchedQuestions);

        const allParts = sessionData?. session?. testConfig?.selectedParts;
        setParts(allParts);
        setCurrentPart(allParts[0] || 1);
        setCurrentQuestion(0);

        if (fetchedQuestions.length > 0) {
          const initialAnswers:  AnswerState[] = fetchedQuestions.map((q) => ({
            selectedAnswer: q.userAnswer?. selectedAnswer ??  null,
            timeSpent:  q.userAnswer?.timeSpent ?? 0,
            isSkipped: q.userAnswer?.isSkipped ??  true,
            isFlagged: q.userAnswer?.isFlagged ?? false,
          }));

          setAnswers(initialAnswers);
        }
      } catch {
        setError("Lỗi khi tải dữ liệu bài thi.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sessionId]);

  useEffect(() => {
    if (sessionId) {
      registerSession(sessionId);
    }
  }, [sessionId, registerSession]);

  // ====== Phần transform câu hỏi của 1 part (memoize) ======
  const questionsInPart:  Question[] = useMemo(() => {
    return questions
      .filter((q) => q.partNumber === currentPart)
      .map((q) => {
        const isSimple = [1, 2]. includes(q.partNumber);
        const images = Array.isArray(q.group?. image) ? q.group.image : [];
        return {
          ... q,
          question: isSimple ? null : q.question,
          group: {
            ...q.group,
            image: images,
          },
          choices: q.choices. map((c) => ({
            ...c,
            text: isSimple ? c.label : `${c.text}`,
          })),
        };
      });
  }, [questions, currentPart]);

  const indexToLetter = ["A", "B", "C", "D"];

  // ✅ SỬA LẠI:  handleAnswer với kiểm tra isSocketReady
  const handleAnswer = (indexInPart:  number, answerIndex: number) => {
    const questionsInPart = questions. filter(
      (q) => q.partNumber === currentPart
    );
    const question = questionsInPart[indexInPart];

    if (! question) {
      console.error("Question not found at index:", indexInPart);
      return;
    }

    const selectedLetter = indexToLetter[answerIndex] as "A" | "B" | "C" | "D";

    setAnswers((prev) => {
      const updated = [...prev];
      // nếu câu chưa có dữ liệu trong answers → tạo mặc định là skip
      if (! updated[question.globalQuestionNumber - 1]) {
        updated[question.globalQuestionNumber - 1] = {
          selectedAnswer: null,
          timeSpent: 0,
          isSkipped: true,
          isFlagged: false,
        };
      }

      // cập nhật đáp án + isSkipped
      updated[question. globalQuestionNumber - 1] = {
        ...updated[question.globalQuestionNumber - 1],
        selectedAnswer: selectedLetter,
        isSkipped:  selectedLetter ?  false : true,
      };
      return updated;
    });

    // ✅ CHỈ GỬI ĐÁP ÁN KHI SOCKET READY (hoặc sẽ được queue nếu chưa ready)
    if (isSocketReady) {
      sendAnswer(sessionId!, question.id, selectedLetter);
    } else {
      console.warn(
        `⚠ Socket not ready yet → Answer will be queued (Q${question.globalQuestionNumber}, ${selectedLetter})`
      );
      // Vẫn gọi sendAnswer, nhưng nó sẽ queue lại trong context
      sendAnswer(sessionId!, question.id, selectedLetter);
    }
  };

  // Điều hướng câu hỏi trong part
  const handleNavigateQuestion = (indexInPart: number) => {
    const questionsInPart = questions.filter((q) => q.partNumber === currentPart);
    setCurrentQuestion(indexInPart);
    const element = document.getElementById(
      `question-${questionsInPart[indexInPart].globalQuestionNumber}`
    );
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  const handleNextPart = async () => {
    try {
      setError(null);
      setLoading(true);
      const nextPartIndex = parts.indexOf(currentPart) + 1;
      if (nextPartIndex < parts.length) {
        setCurrentPart(parts[nextPartIndex]);
        setCurrentQuestion(0);
      }
    } catch (err:  any) {
      setError(err.message || "Lỗi khi chuyển phần tiếp theo");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSession = async (noRedirect = false) => {
    try {
      setError(null);
      setLoading(true);

      if (unsentAnswers.length) {
        await submitBulkAnswers(sessionId!, unsentAnswers);
        setUnsentAnswers([]);
      }
      await submitSession(sessionId!);
      if (!noRedirect) {
        navigate(`/session/${sessionId}/results`);
      }
    } catch (err: any) {
      setError(err.message || "Lỗi khi nộp bài");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => navigate(-1);

  const handlePauseTestSession = useCallback(async () => {
    if (hasPausedRef.current) {
      return;
    }

    hasPausedRef.current = true;
    try {
      await pauseSession(sessionId);
    } catch (err: any) {
      setError(`Lỗi khi pause session :  ${err.message}`);
    }
  }, [sessionId]);

  const handleResumeTestSession = useCallback(async () => {
    try {
      await resumeSession(sessionId);
      const refreshed = await getSession(sessionId);
      if (refreshed?. session) {
        setSession(refreshed.session);
      }
      hasPausedRef.current = false;
    } catch (err) {
      console.error("Resume failed:", err);
    }
  }, [sessionId]);

  return {
    sessionId,
    session,
    questions,
    parts,
    currentPart,
    setCurrentPart,
    currentQuestion,
    setCurrentQuestion,
    questionsInPart,
    answers,
    handleAnswer,
    handleNavigateQuestion,
    handleNextPart,
    handleSubmitSession,
    handleGoBack,
    loading,
    error,
    handlePauseTestSession,
    handleResumeTestSession,
    isSocketReady, // ✅ EXPORT cái này để component biết socket đã sẵn sàng chưa
  };
};

export const useResult = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resultData, setResultData] = useState<any>(null);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await getSessionResults(id);

        const result = res.session;
        const answers = res.answers;

        if (result) {
          setResultData(result);
        }
        if (answers) {
          setUserAnswers(answers);
        }
      } catch (err:  any) {
        setError(err.message || "Không thể tải kết quả");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchResult();
    } else {
      setError("No session ID found");
      setLoading(false);
    }
  }, [id]);

  return {
    loading,
    error,
    resultData,
    userAnswers,
  };
};

interface Pagination {
  current: number;
  pages: number;
  total: number;
}

export const useSessionsUser = (initialPage = 1, limit = 10) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    current:  initialPage,
    pages: 1,
    total: 0,
  });

  const [page, setPage] = useState(initialPage);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getSessionsUser(page, limit);
        if (! res) {
          setError("Chưa có dữ liệu làm bài thi");
          return;
        }
        if (res?. sessions) {
          setSessions(res.sessions);
        }
        if (res?.pagination) {
          setPagination(res.pagination);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [page]);

  return {
    loading,
    error,
    sessions,
    pagination,
    setPage,
  };
};