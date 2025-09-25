import React from "react";
import ExamCard from "./component/ExamCard";
import IcArrow from "../../assets/icons/IcArrow";
import { Link } from "react-router-dom";
import { toeicTest } from "../../data/toeicMockData";
export interface Exam {
  id: number;
  title: string;
  image: string;
  questions: number;
  students: number;
  level: "Beginner" | "Intermediate" | "Advanced";
}

const Home = ({ setIsOpen }) => {
  const examData = [toeicTest];
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-400 p-6">
        <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2  items-center">
          {/* Left Section */}
          <div className="text-white space-y-6">
            <h1 className="text-4xl font-bold">
              Chinh phục TOEIC cùng chúng tôi!
            </h1>
            <p className="text-lg">
              Học và luyện thi TOEIC với hệ thống bài tập thông minh, bài thi mô
              phỏng thực tế và chatbot AI hỗ trợ 24/7.
            </p>
            <Link to={"/register"}>
              <button className="bg-yellow-400 text-gray-900 font-semibold px-6 py-3 rounded-lg hover:bg-yellow-500 transition">
                Bắt đầu ngay
              </button>
            </Link>
          </div>

          {/* Right Section (Illustration) */}
          <div className="relative flex items-center justify-center right-0">
            <img
              src="./src/assets/images/hero-image.png"
              alt="Video Icon"
              className="w-full rounded-xl h-full"
            />
          </div>
        </div>
      </div>

      {/* Luyện tập cá nhân hóa Section */}
      <div className="flex justify-center w-full mt-12 ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-5xl w-full">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-xl border border-gray-300 flex flex-col max-w-lg mx-auto justify-center">
            <h2 className="text-xl font-bold text-blue-600">
              Luyện tập cá nhân hóa
            </h2>
            <p className="text-gray-700 mt-2">
              Hệ thống bài tập đa dạng giúp bạn làm quen với cấu trúc đề thi
              TOEIC. Chọn chủ đề bạn muốn luyện tập và cải thiện từng kỹ năng
              một cách hiệu quả.
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src="./src/assets/images/personalization-image.png"
              alt="Education"
              className="w-full max-w-xs"
            />
          </div>

          {/* Card 2 */}
          <div className="flex justify-center">
            <img
              src="src\assets\images\mock-test-image.png"
              alt="Online Test"
              className="w-full max-w-sm"
            />
          </div>
          <div className="bg-white p-6 rounded-lg max-w-lg mx-auto">
            <h2 className="text-xl font-bold text-gray-900">
              Thi thử TOEIC chuẩn
            </h2>
            <p className="text-gray-700 mt-2">
              Bạn đã sẵn sàng cho kỳ thi TOEIC chưa? Hãy làm bài thi thử với
              giao diện giống hệt bài thi thật, có chấm điểm tự động và phân
              tích chi tiết kết quả để biết bạn cần cải thiện những gì.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-xl flex flex-col max-w-lg mx-auto justify-center">
            <h2 className="text-xl font-bold text-gray-900">
              Theo dõi tiến độ
            </h2>
            <p className="text-gray-700 mt-2">
              Bạn đã tiến bộ đến đâu trong quá trình luyện thi TOEIC?
            </p>
            <ul className="list-disc list-inside text-gray-700 mt-2 ">
              <li>✅ Xem điểm số và sự cải thiện qua từng bài thi thử.</li>
              <li>✅ Phân tích điểm mạnh, điểm yếu theo từng kỹ năng.</li>
              <li>✅ Gợi ý bài tập cá nhân hóa để nâng cao điểm số.</li>
            </ul>
          </div>
          <div className="flex justify-center">
            <img
              src="src\assets\images\progress-track-image.png"
              alt="Education"
              className="w-full max-w-xs"
            />
          </div>
        </div>
      </div>

      {/* Luyện tập Section */}
      <section className="flex justify-center mt-12 flex-col items-center">
        <div>
          <h1 className="w-full text-2xl font-bold text-gray-900 justify-start text-start items-start mb-3">
            Luyện tập
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 gap-y-12 mb-12 max-w-[1000px] justify-center items-center">
            {examData.map((item, index) => (
              <ExamCard
                id={item.id}
                title={item.title}
                image={item.image}
                questions={item.questions}
                students={item.students}
                level={item.level}
              />
            ))}
          </div>
        </div>

        <Link to={"/mock-test"}>
          <button className="mt-6 px-8 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-700 hover:text-white border border-blue-600 focus:outline-none w-full max-w-[300px] flex mb-12">
            <div className=" justify-center w-full flex flex-row items-center">
              Xem thêm
              <div className="mx-2">
                <IcArrow />
              </div>
            </div>
          </button>
        </Link>
      </section>

      {/* Thi thử Section */}
      <section className="flex justify-between items-center p-10 bg-cover bg-center rounded-lg bg-[url(src/assets/images/mock-test-background.png)]">
        <div className="max-w-lg">
          <h2 className="text-4xl font-bold text-gray-900">Thi Thử</h2>
          <p className="text-lg text-gray-700 mt-4 leading-relaxed">
            Tham gia bài thi thử trực tuyến với giao diện giống hệt bài thi
            thật, giúp bạn làm quen với cấu trúc đề và đánh giá chính xác trình
            độ của mình.
          </p>
          <Link to={"/mock-test"}>
            <button className="mt-6 px-8 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 focus:outline-none">
              Thi Thử Ngay
            </button>
          </Link>
        </div>
      </section>
      {/* Chatbot Section */}
      <section className="flex justify-between items-center p-10 bg-cover bg-center rounded-lg w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 items-center">
          <div className="max-w-lg items-center align-center">
            <h2 className="text-4xl font-bold text-gray-900">
              Chatbot AI hỗ trợ
            </h2>
            <p className="text-lg text-gray-700 mt-4 leading-relaxed">
              Cần lời khuyên về cách làm bài TOEIC? Bạn có câu hỏi về ngữ pháp,
              từ vựng hay mẹo làm bài? Chatbot AI có thể giúp bạn ngay lập tức!
            </p>
            <button
              onClick={() => setIsOpen(true)}
              className="mt-6 px-8 py-2 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 focus:outline-none"
            >
              Trò chuyện ngay
            </button>
          </div>
          <div className="max-w-full">
            <img
              className="max-size-[200px]"
              src="src\assets\images\ai-image.png"
              alt="Chatbot AI"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
