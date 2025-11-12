import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { XCircle, AlertCircle, ArrowRight, Home, RefreshCw } from "lucide-react";

const PaymentFail: React.FC = () => {
  useEffect(() => {
    document.title = "Thanh toán không thành công";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-[1.02]">
          {/* Header đỏ nhẹ */}
          <div className="bg-gradient-to-r from-rose-500 to-red-600 p-8 text-white">
            <div className="flex flex-col items-center">
              <div className="relative">
                <XCircle className="w-24 h-24 animate-pulse" />
                <div className="absolute inset-0 animate-pulse">
                  <XCircle className="w-24 h-24 opacity-70" />
                </div>
              </div>
              <h1 className="text-3xl font-bold mt-6 tracking-tight whitespace-nowrap">
                Thanh toán không thành công
              </h1>
              <p className="text-rose-100 mt-2 text-lg opacity-90">
                Đừng lo, chúng tôi sẽ giúp bạn khắc phục ngay!
              </p>
            </div>
          </div>

          {/* Nội dung */}
          <div className="p-8 space-y-6">
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <AlertCircle className="w-10 h-10 text-rose-500" />
              </div>
              <p className="text-gray-700 leading-relaxed">
                Có thể do:
              </p>
              <ul className="text-left text-sm text-gray-600 space-y-2 bg-rose-50 p-4 rounded-xl border border-rose-200">
                <li className="flex items-center gap-2">
                  <span className="text-rose-500">•</span> Số dư tài khoản không đủ
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-rose-500">•</span> Thông tin thẻ bị sai
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-rose-500">•</span> Lỗi kết nối mạng tạm thời
                </li>
              </ul>
            </div>

            {/* Nút hành động chính */}
            <div className="flex flex-col gap-4">
              <Link
                to="/payment"
                className="group flex items-center justify-center gap-3 bg-gradient-to-r from-rose-600 to-red-600 text-white font-semibold py-4 px-8 rounded-2xl hover:from-rose-700 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                Thử thanh toán lại
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="flex gap-4 justify-center">
                <Link
                  to="/"
                  className="flex items-center gap-2 text-gray-600 hover:text-rose-600 font-medium transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Trang chủ
                </Link>
                <Link
                  to="/support"
                  className="flex items-center gap-2 text-gray-600 hover:text-rose-600 font-medium transition-colors"
                >
                  <AlertCircle className="w-4 h-4" />
                  Liên hệ hỗ trợ
                </Link>
              </div>
            </div>

            {/* Tip nhỏ */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              <strong>Mẹo:</strong> Hãy kiểm tra lại thông tin thanh toán hoặc thử phương thức khác (Ví điện tử, chuyển khoản...).
            </div>
          </div>
        </div>

        {/* Decorative dots - nhẹ nhàng hơn */}
        <div className="mt-8 flex justify-center gap-3">
          <div className="w-3 h-3 bg-rose-400 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: "150ms" }}></div>
          <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: "300ms" }}></div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFail;