import { BookOpen, Sparkles, Users, Target, Layers } from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'Lộ trình học cá nhân hoá',
    desc: 'AI tự động điều chỉnh bài học theo trình độ của bạn.',
  },
  {
    icon: BookOpen,
    title: 'Kho đề thi khổng lồ',
    desc: 'Hơn 500+ đề thật, sát đề thi thật 99%.',
  },
  {
    icon: Users,
    title: 'Cộng đồng 50.000+ học viên',
    desc: 'Thảo luận, chia sẻ kinh nghiệm luyện thi.',
  },
  {
    icon: Sparkles,
    title: 'AI hỗ trợ 24/7',
    desc: 'Giải thích chi tiết và gợi ý học tập tức thì.',
  },
  {
    icon: Layers,
    title: 'Học từ vựng bằng Flashcard',
    desc: 'Ghi nhớ nhanh hơn với hệ thống flashcard thông minh và nhắc lại định kỳ bằng AI.',
  },
];

const FeaturesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-100 py-20 px-6 lg:px-16">
      {/* Tiêu đề chính */}
      <h1 className="text-4xl lg:text-5xl font-bold text-center text-emerald-700 mb-12">
        Tính năng nổi bật của{' '}
        <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
          TOEIC MASTER
        </span>
      </h1>

      {/* Danh sách tính năng */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
        {features.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-lg p-6 text-center border border-emerald-100 hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-md">
                <item.icon className="w-8 h-8" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-emerald-700 mb-2">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesPage;
