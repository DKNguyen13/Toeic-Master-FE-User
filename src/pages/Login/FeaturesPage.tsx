import { BookOpen, Sparkles, Users, Target, Layers } from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'Lộ trình học cá nhân hoá',
    desc: 'AI tự động điều chỉnh bài học theo trình độ và mục tiêu của bạn.',
  },
  {
    icon: BookOpen,
    title: 'Kho đề luyện tập đa dạng',
    desc: 'Luyện tập với nhiều bộ đề được xây dựng theo cấu trúc TOEIC hiện hành.',
  },
  {
    icon: Users,
    title: 'Học tập cùng cộng đồng',
    desc: 'Trao đổi kinh nghiệm, chia sẻ mẹo học và giải đáp thắc mắc.',
  },
  {
    icon: Sparkles,
    title: 'AI hỗ trợ 24/7',
    desc: 'Giải thích đáp án, phân tích lỗi sai và đề xuất hướng cải thiện.',
  },
  {
    icon: Layers,
    title: 'Flashcard thông minh',
    desc: 'Ghi nhớ từ vựng hiệu quả với cơ chế nhắc lại ngắt quãng (Spaced Repetition).',
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
