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
import { useSessionTest } from "../../../context/sessionTest/useSessionTest" // IMPORT useSocket để lấy sendAnswer và registerSession

export const useTestSession = () => {
  const { registerSession, sendAnswer, connected } = useSessionTest() // Lấy sendAnswer và registerSession từ context
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
  const [answers, setAnswers] = useState<Record<string, AnswerState>>({});
  const [unsentAnswers, setUnsentAnswers] = useState<
    { questionId: string; selectedAnswer: string | null }[]
  >([]);
  const hasPausedRef = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!sessionId) {
          setError("Không tìm thấy bài thi.");
          return;
        }

        const sessionData = await getSession(sessionId);
        if (!sessionData?.session) {
          setError("Bài thi không tồn tại hoặc đã bị xóa.");
          return;
        }

        setSession(sessionData.session);
        const fetchedQuestions = (sessionData.questions ?? []) as Question[];

        if (fetchedQuestions.length === 0) {
          setError("Không có câu hỏi nào trong bài thi này.");
          return;
        }

        setQuestions(fetchedQuestions);

        // console.group("📦 FETCH SESSION DATA");
        // console.log("Total fetchedQuestions:", fetchedQuestions.length);

        fetchedQuestions.forEach((q, idx) => {
          console.log(
            `Index ${idx} | globalQ: ${q.globalQuestionNumber} | part: ${q.partNumber} | userAnswer:`,
            q.userAnswer
          );
        });

        console.groupEnd();

        const allParts = sessionData?.session?.testConfig?.selectedParts;
        setParts(allParts);
        setCurrentPart(allParts[0] || 1);
        setCurrentQuestion(0);

        if (fetchedQuestions.length > 0) {
          const initialAnswers: Record<string, AnswerState> = {};

          fetchedQuestions.forEach((q) => {
            initialAnswers[q.id] = {
              selectedAnswer: q.userAnswer?.selectedAnswer ?? null,
              timeSpent: q.userAnswer?.timeSpent ?? 0,
              isSkipped: q.userAnswer?.isSkipped ?? true,
              isFlagged: q.userAnswer?.isFlagged ?? false,
            };
          });

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
    if (sessionId && connected) {
      registerSession(sessionId)
    }
  }, [sessionId, registerSession, connected]);

  // ====== Phần transform câu hỏi của 1 part (memoize) ======
  const questionsInPart: Question[] = useMemo(() => {
    return questions
      .filter((q) => q.partNumber === currentPart)
      .map((q) => {
        const isSimple = [1, 2].includes(q.partNumber);
        const images = Array.isArray(q.group?.image) ? q.group.image : [];
        return {
          ...q,
          question: isSimple ? null : q.question,
          group: {
            ...q.group,
            image: images,
          },
          choices: q.choices.map((c) => ({
            ...c,
            text: isSimple ? c.label : `${c.text}`,
          })),
        };
      });
  }, [questions, currentPart]);

  const indexToLetter = ["A", "B", "C", "D"];

  // handleAnswer với kiểm tra isSocketReady
  const handleAnswer = (questionId: string, answerIndex: number) => {
    const question = questions.find((q) => q.id === questionId)

    if (!question) {
      console.error("Question not found:", questionId)
      return
    }

    const selectedLetter = indexToLetter[answerIndex] as "A" | "B" | "C" | "D"

    setAnswers((prev) => ({
      ...prev,
      [question.id]: {
        ...prev[question.id],
        selectedAnswer: selectedLetter,
        isSkipped: false,
      },
    }))

    // Chỉ auto-save, không phụ thuộc nó để submit
    sendAnswer(sessionId!, question.id, selectedLetter)
  }

  // Điều hướng câu hỏi trong part
  const handleNavigateQuestion = (indexInPart: number) => {
    const questionsInPart = questions.filter(
      (q) => q.partNumber === currentPart
    );
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
    } catch (err: any) {
      setError(err.message || "Lỗi khi chuyển phần tiếp theo");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSession = async (noRedirect = false) => {
    try {
      setError(null)
      setLoading(true)

      const finalAnswers = Object.entries(answers)
        .filter(([_, value]) => value.selectedAnswer !== null)
        .map(([questionId, value]) => ({
          questionId,
          selectedAnswer: value.selectedAnswer,
        }))
      if(finalAnswers.length === 0) {
        alert("Bạn chưa trả lời câu hỏi nào để nộp bài.")
        return
      }

      await submitBulkAnswers(sessionId!, finalAnswers)

      await submitSession(sessionId!)

      if (!noRedirect) {
        navigate(`/session/${sessionId}/results`)
      }
    } catch (err: any) {
      setError(err.message || "Lỗi khi nộp bài")
    } finally {
      setLoading(false)
    }
  }

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
      if (refreshed?.session) {
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
    handleResumeTestSession
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
      } catch (err: any) {
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
    current: initialPage,
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
        if (!res) {
          setError("Chưa có dữ liệu làm bài thi");
          return;
        }
        if (res?.sessions) {
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
