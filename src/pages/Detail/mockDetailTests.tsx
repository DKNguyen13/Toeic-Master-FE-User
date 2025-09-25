import DetailToeicTest from "../../components/DetailToeicContent";

const sampleParts = [
  {
    id: 1,
    title: "Part 1",
    questionCount: 6,
    tags: ["Picture description - people", "Picture description - objects"]
  },
  {
    id: 2,
    title: "Part 2", 
    questionCount: 25,
    tags: ["Question-response", "WH-questions", "Yes/No questions"]
  },
  {
    id: 3,
    title: "Part 3",
    questionCount: 39,
    tags: ["Conversations", "Multiple speakers", "Graphics"]
  },
  {
    id: 4,
    title: "Part 4",
    questionCount: 30,
    tags: ["Short talks", "Announcements", "Presentations"]
  },
  {
    id: 5,
    title: "Part 5",
    questionCount: 30,
    tags: ["Incomplete sentences", "Grammar", "Vocabulary"]
  },
  {
    id: 6,
    title: "Part 6",  
    questionCount: 16,
    tags: ["Text completion", "Context clues", "Grammar in context"]
  },
  {
    id: 7,
    title: "Part 7",
    questionCount: 54,
    tags: ["Reading comprehension", "Single passages", "Multiple passages"]
  }
];

const sampleComments = [
  {
    id: "1",
    user: "John Doe",
    date: "2024-01-15",
    text: "This test really helped me improve my listening skills. The explanations are clear and detailed.",
    pinned: true
  },
  {
    id: "2", 
    user: "Sarah Kim",
    date: "2024-01-14",
    text: "Part 7 reading passages are challenging but realistic. Great practice for the actual TOEIC exam."
  },
  {
    id: "3",
    user: "Mike Chen", 
    date: "2024-01-13",
    text: "The timer feature is very helpful for practice. I can focus on specific parts that need improvement."
  }
];


function MockDetailTests() {
    return (
    <div className="min-h-screen bg-background">
      <DetailToeicTest
        testName="New Economy TOEIC Test 2"
        durationMinutes={120}
        totalParts={7}
        totalQuestions={200}
        practicedCount={2500000}
        commentsCount={3000}
        parts={sampleParts}
        comments={sampleComments}
        defaultActiveTab="practice"
      />
    </div>
  );
}  


export default MockDetailTests;