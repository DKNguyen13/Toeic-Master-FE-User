import IcArrow from "../../assets/icons/IcArrow";
import { Link } from "react-router-dom";
import { NotepadText, CircleUserRound, NotebookPen, FlipHorizontal, ArrowRight, Sparkles, MessageCircle, CheckCircle2 } from 'lucide-react';
import BannerSlider from "./component/BannerSlider";
import TestList from "../MockTest/TestList";

export interface Exam {
  id: number;
  title: string;
  image: string;
  questions: number;
  students: number;
  level: "Beginner" | "Intermediate" | "Advanced";
}

interface HomeProps {
  setIsOpen: (open: boolean) => void;
}

const Home : React.FC<HomeProps> = ({ setIsOpen })  => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="flex bg-blue-500 gap-8 min-h-[35vh] pt-5 hidden">
        
        <div className="flex-[65%] pt-6 hidden md:block">
          {/* Left Section */}
          <div className="text-white space-y-6 ml-[12%] mt-[2%] p-6">
        <h2 className="text-4xl font-bold">
        Nền tảng thi thử TOEIC® trực tuyến miễn phí
        Kho đề "XỊN" & được cập nhật mới liên tục!
        </h2>

        <ul className="text-lg list-disc pl-10">
          <li>Tuyển tập những bộ đề gần với đề thi nhất từ nhiều nguồn</li>
          <li>Đánh giá đúng thực lực của người học & sát đề thi thật</li>
          <li>Chatbot hỗ trợ 24/7</li>
        </ul>
        <Link to={"/register"}>
          <button className="mt-5 bg-red-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-orange-600 transition border border-orange-500">
            Bắt đầu ngay
          </button>
        </Link>
          </div>
        </div>
        
        <div className="flex-[35%] relative">
          <img 
          src="src/assets/images/banner-img.svg"
          className="h-[80%] absolute bottom-0 right-10"
        /> 
        </div>
      </div>

      <BannerSlider />

      {/* Features Section */}
      <div className="flex justify-center w-full py-16 bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="max-w-6xl w-full px-6">
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-12">
        Tại sao chọn TOEIC MASTER?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-9">
            {/* Feature Card 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-blue-600 mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <NotebookPen size={30}/>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Luyện tập cá nhân hóa
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Hệ thống bài tập đa dạng giúp bạn làm quen với cấu trúc đề thi
                TOEIC. Chọn chủ đề bạn muốn luyện tập và cải thiện từng kỹ năng
                một cách hiệu quả.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-blue-600 mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <NotepadText size={30}/>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Thi thử TOEIC chuẩn
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Bài thi thử với giao diện giống hệt bài thi thật, có chấm điểm 
                tự động và phân tích chi tiết kết quả để biết bạn cần cải thiện những gì.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-blue-600 mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <CircleUserRound size={30}/>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Theo dõi tiến độ
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Xem điểm số và sự cải thiện qua từng bài thi thử. Phân tích điểm mạnh, 
                điểm yếu theo từng kỹ năng với gợi ý bài tập cá nhân hóa.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Luyện tập Section */}
      <section className="flex justify-center mt-12 flex-col items-center">
        <div>
          <h1 className="w-full text-3xl font-bold text-gray-900 justify-start text-start items-start mb-6">
            Luyện tập
          </h1>
          {/* Test list */}
          <TestList limit={4} showPagination={false} compact={true}/>
        </div>

        <Link to={"/tests"}>
          <button className="mt-8 px-8 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-700 hover:text-white border border-blue-600 focus:outline-none w-full max-w-[300px] flex mb-8">
            <div className=" justify-center w-full flex flex-row items-center">
              Xem thêm
              <div className="mx-2">
                <IcArrow />
              </div>
            </div>
          </button>
        </Link>
      </section>

      {/* Flashcard Section */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left */}
            <div className="space-y-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                Học từ vựng TOEIC<br />
                <span className="text-blue-600">nhanh – nhớ lâu</span><br/>
                với Flashcard thông minh
              </h2>

              <p className="text-lg text-gray-600 leading-relaxed">
                Dựa trên phương pháp học bằng flashcard với nhiều chế độ ôn tập ngẫu nhiên, trắc nghiệm sẽ giúp bạn ghi nhớ từ vựng một cách tự nhiên và thú vị mỗi lần học.
              </p>

              {/* 4 benefit */}
              <div className="grid grid-cols-2 gap-5 mt-8">
                {[
                  "Ghi nhớ lâu",
                  "Học 10 phút/ngày là đủ",
                  "Nghe phát âm chuẩn",
                  "Hơn 200 từ vựng có sẵn"
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-blue-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{text}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link to="/flashcard">
                  <button className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    Tạo flashcard ngay
                  </button>
                </Link>
              </div>
            </div>

            {/* Right */}
            <div className="relative h-96 lg:h-full flex items-center justify-center">
              <div className="absolute w-80 h-96 bg-white rounded-3xl shadow-xl border border-gray-200 p-10 flex flex-col justify-between transform rotate-[-6deg] hover:rotate-[-3deg] transition-all duration-500 hover:z-10 hover:scale-[1.03]">
                <div>
                  <span className="text-sm font-semibold text-blue-600">TOEIC Vocabulary</span>
                  <h3 className="text-4xl font-bold text-gray-900 mt-3">accomplish</h3>
                  <p className="text-xl text-gray-600 mt-2">/əˈkʌm.plɪʃ/</p>
                </div>
                <div className="text-2xl font-medium text-gray-800">
                  Hoàn thành, thực hiện thành công
                </div>
              </div>

              <div className="absolute w-80 h-96 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-3xl shadow-xl p-10 flex flex-col justify-center items-center text-center transform rotate-[6deg] hover:rotate-[9deg] transition-all duration-500 hover:z-10 hover:scale-[1.03]">
                <h3 className="text-3xl font-bold mb-6">accomplish</h3>
                <p className="text-lg leading-relaxed opacity-95">
                  Hoàn thành, thực hiện thành công
                </p>
                <div className="mt-6 text-sm space-y-1 opacity-90">
                  <p>• She accomplished her goal of 900 TOEIC</p>
                  <p>• The task was accomplished ahead of schedule</p>
                </div>
              </div>

              {/* Mini card */}
              <div className="absolute top-8 right-8 w-48 h-40 bg-blue-50 border-2 border-dashed border-blue-300 rounded-2xl flex flex-col items-center justify-center text-blue-700 transform rotate-12">
                <span className="text-4xl font-bold">5000+</span>
                <span className="text-sm font-medium">Từ vựng</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-orange-50 py-16">
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Chatbot AI hỗ trợ học <span className="text-orange-500">TOEIC</span>
              </h2>

              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Cần giải đáp ngay về ngữ pháp, từ vựng, mẹo làm bài? 
                Chỉ cần hỏi, AI sẽ trả lời chi tiết trong <strong className="text-orange-600">vòng 3 giây</strong>!
              </p>

              <div className="space-y-3 mb-8">
                {[
                  "Giải đáp thắc mắc 24/7",
                  "Phân tích lỗi sai chi tiết",
                  "Gợi ý phương pháp học hiệu quả"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-orange-500 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <button onClick={() => setIsOpen(true)}
                  className="px-8 py-4 bg-orange-500 text-white font-bold rounded-full hover:shadow-lg transition-all flex items-center gap-2">
                  Trò chuyện ngay
                </button>
              </div>
            </div>

            {/* Right Image */}
            <div className="flex justify-center lg:justify-end order-1 lg:order-2">
              <div className="relative">                
                <img
                  src="src\assets\images\robot_img1.png"
                  alt="Chatbot AI TOEIC"
                  className="relative z-10 w-full max-w-md"
                />             
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
