import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnswerState, Question, Session } from "../interface/interfaces";
import { getSession, getSessionResults, getSessionsUser, submitBulkAnswers, submitSession } from "../../../service/sessionService";

export const useTestSession = () => {
  const navigate = useNavigate();
  const sessionId = localStorage.getItem("toeic-session-id");

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

        const allParts = sessionData?.session?.testConfig?.selectedParts;
        setParts(allParts);
        setCurrentPart(allParts[0] || 1);
        setCurrentQuestion(0);

        if (fetchedQuestions.length > 0) {
          const initialAnswers: AnswerState[] = questions.map(q => ({
            selectedAnswer: null,
            timeSpent: 0,
            isSkipped: true,
            isFlagged: false,
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

  // ====== Phần transform câu hỏi của 1 part (memoize) ======
  const questionsInPart: Question[] = useMemo(() => {
    return questions
      .filter(q => q.partNumber === currentPart)
      .map(q => {
        const isSimple = [1, 2].includes(q.partNumber);
        const images = Array.isArray(q.group?.image) ? q.group.image : [];
        return {
          ...q,
          question: isSimple ? null : q.question,
          group: {
            ...q.group,
            image: images
          },
          choices: q.choices.map(c => ({
            ...c,
            text: isSimple ? c.label : `${c.text}`
          }))
        };
      });
  }, [questions, currentPart]);

  const indexToLetter = ["A", "B", "C", "D"];

  const handleAnswer = (indexInPart: number, answerIndex: number) => {
    const questionsInPart = questions.filter(
      (q) => q.partNumber === currentPart
    );
    const question = questionsInPart[indexInPart];
    
    if (!question) {
      console.error("Question not found at index:", indexInPart);
      return;
    }

    const selectedLetter = indexToLetter[answerIndex] as "A" | "B" | "C" | "D";
    
    setAnswers(prev => {
    const updated = [...prev];
    // nếu câu chưa có dữ liệu trong answers → tạo mặc định là skip
    if (!updated[question.globalQuestionNumber - 1]) {
      updated[question.globalQuestionNumber - 1] = {
        selectedAnswer: null,
        timeSpent: 0,
        isSkipped: true,
        isFlagged: false,
      };
    }

    // cập nhật đáp án + isSkipped
    updated[question.globalQuestionNumber - 1] = {
      ...updated[question.globalQuestionNumber - 1],
      selectedAnswer: selectedLetter,
      isSkipped: selectedLetter ? false : true,
    };

    return updated;
  });

    // Cập nhật unsent answers
    setUnsentAnswers((prev) => {
      const filtered = prev.filter((ans) => ans.questionId !== question.id);
      return [
        ...filtered,
        {
          questionId: question.id,
          selectedAnswer: selectedLetter,
          timeSpent: 0,  // TODO: Tính thời gian thực tế
        },
      ];
    });
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
      setError(null); // reset lỗi cũ
      setLoading(true);
      const nextPartIndex = parts.indexOf(currentPart) + 1;
      if (nextPartIndex < parts.length) {
        setCurrentPart(parts[nextPartIndex]);
        setCurrentQuestion(0);
      }
    } catch (err: any) {
      setError(err.message || "Lỗi khi chuyển phần tiếp theo");
    }
    finally{
      setLoading(false);
    }
    
  };

  const handleSubmitSession = async (noRedirect = false) => {
    try {
      setError(null); // reset lỗi cũ
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
    }
    finally{
      setLoading(false);
    }
    
  };

  const handleGoBack = () => navigate(-1);

  return {
    sessionId,
    session,
    questions,
    parts,
    currentPart,
    setCurrentPart,
    currentQuestion,
    questionsInPart,
    answers,
    handleAnswer,
    handleNavigateQuestion,
    handleNextPart,
    handleSubmitSession,
    handleGoBack,
    loading,
    error
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
        if(answers) {
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
    userAnswers
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

        const res = await getSessionsUser(page, limit); // gọi API có phân trang
        if(!res) {
          setError('Chưa có dữ liệu làm bài thi');
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
    setPage, // Dùng để đổi trang
  };
};