import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Choice, Question, UserAnswerResult } from "../interface/interfaces";
import { getSessionResults } from "../../../service/sessionService";

export const useViewSession = () => {
  const navigate = useNavigate();

  const [session, setSession] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [parts, setParts] = useState<number[]>([]);
  const [currentPart, setCurrentPart] = useState<number>(1);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const {id} = useParams();

  useEffect(() => {

    if (!id) {
      setError("Không tìm thấy bài thi");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getSessionResults(id);
        console.log('data result', data);
        // Kiểm tra dữ liệu hợp lệ
        if (!data || !data.session || !Array.isArray(data.answers) || data.answers.length === 0) {
          setError("Không tìm thấy dữ liệu cho bài thi này");
          return;
        }

        // lưu session info
        setSession(data.session);

        // Chuẩn bị dữ liệu câu hỏi từ UserAnswer[]
        const questions: Question[] = data.answers.map((ans: any) => {
          const answerResult: UserAnswerResult | null = {
            questionId: ans.id,
            selectedAnswer: ans.userAnswer.selectedAnswer,
            isCorrect: ans.userAnswer.selectedAnswer === ans.correctAnswer,
            timeSpent: ans.timeSpent ?? 0,
            isSkipped: ans.userAnswer.isSkipped ?? false,
            isFlagged: ans.isFlagged ?? false,
            explanation: ans.explanation
          };

          return {
            id: ans.id,
            question: ans.question ?? null,
            questionNumber: ans.questionNumber,
            globalQuestionNumber: ans.globalQuestionNumber,
            partNumber: ans.partNumber,
            group: ans.group,
            choices: ans.choices.map((c: Choice) => ({
              ...c,
              isUserChoice: c.label === ans.userAnswer,
              isCorrect: c.label === ans.correctAnswer
            })),
            answerResult
          };
        });

        setQuestions(questions);

        // Lấy các part có trong câu hỏi
        const allParts = data.session?.selectedParts;
        setParts(allParts);
        setCurrentPart(allParts[0] || 1);

      } catch (err: string | any) {
        setError(`Lỗi gì ?`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  

  // Danh sách câu hỏi trong part hiện tại
  const questionsInPart: Question[] = useMemo(() => {
    return questions.filter(q => q.partNumber === currentPart);
  }, [questions, currentPart]);

  const handleNavigateQuestion = (indexInPart: number) => {
    const partQuestions = questionsInPart;
    setCurrentQuestion(indexInPart);
    const element = document.getElementById(`question-${partQuestions[indexInPart].globalQuestionNumber}`);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  const handleNextPart = () => {
    const nextPartIndex = parts.indexOf(currentPart) + 1;
    if (nextPartIndex < parts.length) {
      setCurrentPart(parts[nextPartIndex]);
      setCurrentQuestion(0);
    }
  };

  const handleGoBack = () => navigate(-1);
  return {
    loading,
    error,
    session,
    parts,
    currentPart,
    currentQuestion,
    questionsInPart,
    handleNavigateQuestion,
    handleGoBack,
    setCurrentPart,
    setCurrentQuestion,
    handleNextPart
  };
};
