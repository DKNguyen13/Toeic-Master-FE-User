import { Link } from 'react-router-dom';
import { CheckCircle, Sparkles, TrendingUp, Award, BookOpen, Users, Target } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './BannerSlider.css';

const BannerSlider = () => {
  return (
    <div className="relative w-full overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
          waitForTransition: false,
        }}
        loop={true}
        speed={600}
        grabCursor={true}
        watchSlidesProgress={true}
        className="banner-swiper"
      >
        {/* Slide 1: Main Banner */}
        <SwiperSlide>
          <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative flex flex-col lg:flex-row items-center gap-8 h-[600px] px-6 lg:px-16 py-8">
              <div className="flex-1 text-white space-y-4 z-10">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium border border-white/20">
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>Nền tảng TOEIC #1 Việt Nam</span>
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  Chinh phục<br />
                  <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent">
                    TOEIC 990
                  </span>
                  <br />cùng chúng tôi
                </h1>

                <p className="text-base md:text-lg text-blue-100 max-w-xl">
                  Hệ thống học TOEIC thông minh với AI, đề thi chuẩn quốc tế và phương pháp học tập hiệu quả nhất.
                </p>

                <div className="space-y-2 pt-2">
                  {[ 
                    { icon: TrendingUp, text: '10,000+ học viên đạt mục tiêu' },
                    { icon: Award, text: 'Đề thi sát 99% với đề thật' },
                    { icon: Sparkles, text: 'AI chatbot hỗ trợ 24/7' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 group">
                      <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-all border border-white/20">
                        <item.icon className="w-4 h-4 text-yellow-300" />
                      </div>
                      <p className="text-sm md:text-base font-medium">{item.text}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                  <Link to="/register">
                    <button className="group px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300">
                      Bắt đầu miễn phí
                      <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  </Link>
                  <Link to="/tests">
                    <button className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border-2 border-white/30 hover:bg-white/20 transition-all">
                      Xem đề thi
                    </button>
                  </Link>
                </div>
              </div>

              <div className="flex-1 hidden lg:flex justify-center items-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400/30 to-orange-500/30 rounded-full blur-3xl"></div>
                  <img
                    src="src/assets/images/banner-img.png"
                    alt="TOEIC Learning"
                    className="relative w-full max-w-md drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 2: Flash Sale */}
        <SwiperSlide>
          <div className="relative bg-gradient-to-br from-red-600 via-orange-600 to-yellow-500 overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-yellow-200 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative flex flex-col lg:flex-row items-center gap-8 h-[600px] px-6 lg:px-16 py-8">
              <div className="flex-1 text-white space-y-4 z-10">
                <div className="inline-flex items-center gap-3 mb-2">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-white flex flex-col items-center justify-center shadow-2xl animate-bounce">
                      <span className="text-[10px] text-red-600 leading-tight">Up to</span>
                      <span className="text-3xl font-black text-red-600">50%</span>
                      <span className="text-xs font-bold text-red-500">OFF</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center text-lg animate-pulse">
                      🔥
                    </div>
                  </div>
                  <div className="bg-yellow-400 text-red-700 px-5 py-2 rounded-lg font-black text-base shadow-lg transform -rotate-2">
                    FLASH SALE
                  </div>
                </div>

                <h2 className="text-3xl md:text-4xl font-black leading-tight">
                  Ưu đãi đặc biệt<br />
                  <span className="text-yellow-300">cuối năm!</span>
                </h2>

                <p className="text-lg text-white/90 max-w-xl font-medium">
                  Nâng cấp Premium ngay hôm nay và nhận ngay 12 tháng học với mức giá ưu đãi chưa từng có!
                </p>

                <div className="flex items-end gap-4 pt-2">
                  <div className="text-white/80">
                    <div className="text-sm font-medium line-through">Giá gốc</div>
                    <div className="text-xl font-bold line-through">999.000đ</div>
                  </div>
                  <div className="text-white pb-1">→</div>
                  <div className="bg-white/20 backdrop-blur-md rounded-2xl px-5 py-2 border-2 border-white/40">
                    <div className="text-xs font-medium text-yellow-300">Giá ưu đãi</div>
                    <div className="text-3xl font-black">699.000đ</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-2">
                  <Link to="/payment">
                    <button className="group px-6 py-3 bg-white text-red-600 font-black rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-base">
                      Mua ngay - Tiết kiệm
                      <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  </Link>
                </div>

                <div className="inline-flex items-center gap-2 bg-red-900/50 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-bold border border-white/30">
                  ⏰ Chỉ còn <span className="text-yellow-300 text-base mx-1">48 giờ</span> - Nhanh tay!
                </div>
              </div>

              <div className="flex-1 hidden lg:flex justify-center items-end mt-[155px]">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/30 rounded-full blur-3xl animate-pulse"></div>
                  <img
                    src="src/assets/images/discount-banner.png"
                    alt="Special Offer"
                    className="relative w-full max-w-md drop-shadow-2xl transform hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 3: Study Features */}
        <SwiperSlide>
          <div className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-green-300 rounded-full blur-3xl"></div>
            </div>

            <div className="relative flex flex-col lg:flex-row items-center gap-8 h-[600px] px-6 lg:px-16 py-8">
              <div className="flex-1 text-white space-y-4 z-10">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium border border-white/20">
                  <BookOpen className="w-4 h-4 text-green-300" />
                  <span>Học thông minh hơn</span>
                </div>

                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  Phương pháp học<br />
                  <span className="bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
                    Độc quyền
                  </span>
                  <br />cho bạn
                </h2>

                <p className="text-base md:text-lg text-emerald-100 max-w-xl">
                  Kết hợp công nghệ AI và phương pháp học khoa học để giúp bạn tiến bộ nhanh chóng và hiệu quả.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {[ 
                    { icon: Target, title: 'Lộ trình cá nhân', desc: 'Phù hợp với trình độ' },
                    { icon: BookOpen, title: '500+ đề thi thật', desc: 'Cập nhật liên tục' },
                    { icon: Users, title: 'Cộng đồng 50K+', desc: 'Học cùng nhau' },
                    { icon: Sparkles, title: 'AI đánh giá', desc: 'Phản hồi tức thì' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 hover:bg-white/15 transition-all group">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{item.title}</p>
                        <p className="text-xs text-emerald-100">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                  <Link to="/features">
                    <button className="group px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-green-500/50 hover:scale-105 transition-all duration-300">
                      Khám phá tính năng
                      <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  </Link>
                  <Link to="/register">
                    <button className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border-2 border-white/30 hover:bg-white/20 transition-all">
                      Dùng thử miễn phí
                    </button>
                  </Link>
                </div>
              </div>

              <div className="flex-1 hidden lg:flex justify-center items-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-green-400/30 to-teal-500/30 rounded-full blur-3xl"></div>
                  <img
                    src="src/assets/images/features-banner.png"
                    alt="Study Features"
                    className="relative w-full max-w-md drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default BannerSlider;