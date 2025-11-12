import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";

const PaymentSuccess: React.FC = () => {
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#10b981", "#34d399", "#6ee7b7", "#86efac", "#d1fae5"],
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">
        {/* Card chính */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-[1.02]">
          {/* Header xanh lá */}
          <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-8 text-white">
            <div className="flex flex-col items-center">
              <div className="relative">
                <CheckCircle className="w-24 h-24 animate-pulse" />
                <div className="absolute inset-0 animate-ping">
                  <CheckCircle className="w-24 h-24 opacity-75" />
                </div>
              </div>
              <h1 className="text-4xl font-bold mt-6 tracking-tight">
                Thanh toán thành công!
              </h1>
              <p className="text-emerald-50 mt-2 text-lg opacity-90">
                Cảm ơn bạn đã tin tưởng chúng tôi
              </p>
            </div>
          </div>

          {/* Nội dung */}
          <div className="p-8 space-y-6">
            <div className="text-center">
              <p className="text-gray-600 leading-relaxed">
                Đơn hàng của bạn đã được xử lý thành công. <br></br>
                Chúng tôi sẽ gửi email xác nhận ngay lập tức.
              </p>
            </div>

            <div className="bg-emerald-50 border-2 border-dashed border-emerald-200 rounded-2xl p-6">
              <p className="text-sm text-emerald-700 font-medium">
                🎉 Chúc mừng! Bạn đã nhận được ưu đãi đặc biệt trong lần mua tiếp theo.
              </p>
            </div>

            {/* Nút hành động */}
            <div className="flex flex-col gap-4">
              <Link
                to="/purchase-history"
                className="group flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold py-4 px-8 rounded-2xl hover:from-emerald-700 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Xem lịch sử mua hàng
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/"
                className="text-center text-gray-600 hover:text-emerald-600 font-medium transition-colors"
              >
                ← Quay lại trang chủ
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="mt-8 flex justify-center gap-3">
          <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
          <div className="w-3 h-3 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;