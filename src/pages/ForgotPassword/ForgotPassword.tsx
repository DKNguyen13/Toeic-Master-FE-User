import api from "../../config/axios.js";
import { Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import React, { useState, useRef, useEffect } from "react";
import { Mail, Lock, KeyRound, ArrowRight, Sparkles, Shield, Send } from "lucide-react";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const recaptchaRef = useRef<any>(null);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const token = recaptchaRef.current?.getValue();
    if (!token) {
      setError("Vui lòng xác thực CAPTCHA.");
      return;
    }
    if (!email) {
      setError("Vui lòng nhập email!");
      return;
    }

    try {
      const res = await api.post("/auth/send-otp", { email, token });
      setMessage(res.data.message);
      setCountdown(res.data.data?.cooldown || 60);
      recaptchaRef.current?.reset();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Có lỗi xảy ra!";
      const cooldown = err.response?.data?.errors?.cooldown || 0;
      setError(msg);
      if (cooldown > 0) setCountdown(cooldown);
      recaptchaRef.current?.reset();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: Hero */}
        <div className="hidden lg:flex flex-col justify-center space-y-10">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-800 rounded-2xl shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-600">Bảo mật tuyệt đối</span>
            </div>

            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
              Quên mật khẩu?
              <br />
              <span className="bg-gradient-to-r from-blue-500 to-blue-800 bg-clip-text text-transparent">
                Đừng lo lắng.
              </span>
            </h1>

            <p className="text-lg text-gray-600 max-w-lg">
              Chúng tôi sẽ gửi mã OTP đến email của bạn. Chỉ mất <span className="font-semibold text-blue-600">30 giây</span> để lấy lại tài khoản.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Lock className="w-6 h-6 text-blue-700" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Mã hóa mạnh</p>
                <p className="text-xs text-gray-500">Bảo mật dữ liệu tối ưu</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-3 bg-blue-100 rounded-xl">
                <KeyRound className="w-6 h-6 text-blue-700" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">OTP tức thì</p>
                <p className="text-xs text-gray-500">Hiệu lực 10 phút</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Form Card */}
        <div className="w-full">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 lg:p-10">
            {/* Mobile Title */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-800 rounded-2xl">
                  <Shield className="w-7 h-7 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Khôi phục mật khẩu</h2>
              <p className="text-gray-600 mt-2">Nhập email để nhận mã OTP</p>
            </div>

            {/* Messages */}
            {message && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <p className="text-blue-800 font-medium">{message}</p>
              </div>
            )}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  Email của bạn
                </label>
                <input
                  type="email"
                  value={email}
                  maxLength={40}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email đăng ký..."
                  className="w-full px-5 py-4 rounded-2xl border border-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-gray-800 placeholder:text-gray-400"
                  required
                />
              </div>

              <div className="flex justify-center py-4 bg-gray-50 rounded-2xl">
                <ReCAPTCHA
                  sitekey="6LcPecArAAAAAOUVjIYmkFx3uaXw-HbomQYjCtqE"
                  ref={recaptchaRef}
                />
              </div>

              <button
                type="submit"
                disabled={countdown > 0}
                className={`w-full max-w-sm py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] mx-auto ${
                  countdown > 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-blue-800 hover:shadow-xl hover:shadow-blue-500/30"
                }`}
              >
                {countdown > 0 ? (
                  <>Gửi lại sau {countdown}s</>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Gửi mật khẩu mới
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center space-y-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Quay lại đăng nhập
              </Link>
              <p className="text-sm text-gray-500">
                Chưa có tài khoản?{" "}
                <Link to="/register" className="font-semibold text-blue-600 hover:underline">
                  Đăng ký miễn phí
                </Link>
              </p>
            </div>

            <p className="text-center text-xs text-gray-400 mt-6">
              Mã OTP có hiệu lực 10 phút • Được bảo mật nghiêm ngặt
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;