import React, { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import api, { setAccessToken } from "../../config/axios.js";
import { Eye, EyeOff, Mail, Lock, ArrowRight, ShieldCheck, Target, BookOpen, GraduationCap, Library } from "lucide-react";

type LoginErrors = {
  email?: string;
  password?: string;
  general?: string;
};

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRemember(true);
    }
  }, []);

  const handleLogin = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    setIsLoading(true);
    setErrors({});

    if (remember) {
      localStorage.setItem("rememberEmail", email);
    } else {
      localStorage.removeItem("rememberEmail");
    }

    const newErrors: LoginErrors = {};
    if (!email) newErrors.email = "Vui lòng nhập email";
    if (!password) newErrors.password = "Vui lòng nhập mật khẩu";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data.success) {
        const { user, accessToken } = res.data.data;
        setAccessToken(accessToken);

        localStorage.setItem("fullname", user.fullname);
        localStorage.setItem("email", user.email);
        localStorage.setItem("phone", user.phone);
        localStorage.setItem("avatarUrl", user.avatarUrl);
        localStorage.setItem("role", user.role);
        localStorage.setItem("userId", user.id);
        window.dispatchEvent(new Event("userUpdated"));
        navigate("/");
      } else {
        setErrors({ general: res.data.message || "Đăng nhập thất bại" });
        setPassword("");
      }
    } catch (error: any) {
      setPassword("");
      setErrors({ general: error.response?.data?.message || "Lỗi kết nối server" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: Hero Section – TOEIC Focus */}
        <div className="hidden lg:flex flex-col justify-center space-y-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-800 rounded-2xl shadow-lg">
              <GraduationCap className="w-9 h-9 text-white" />
            </div>
            <span className="text-lg font-semibold text-blue-700">TOEIC MASTER</span>
          </div>

          <h1 className="text-5xl font-bold text-gray-900 leading-tight">
            Chinh phục <span className="text-blue-600">TOEIC 990</span> cùng chúng tôi!
          </h1>

          <p className="text-lg text-gray-600">
            Hệ thống luyện thi TOEIC thông minh, cá nhân hóa lộ trình, bảo mật tuyệt đối.
          </p>

          <div className="grid grid-cols-2 gap-6 mt-8">
            <div className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="p-3 bg-indigo-100 rounded-xl">
                <Target className="w-7 h-7 text-indigo-700" />
              </div>
              <div>
                <p className="font-bold text-gray-800">Lộ trình cá nhân</p>
                <p className="text-sm text-gray-500">Phù hợp từng trình độ</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Library className="w-7 h-7 text-blue-700" />
              </div>
              <div>
                <p className="font-bold text-gray-800">Flashcard</p>
                <p className="text-sm text-gray-500">Ôn từ vựng mỗi ngày</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="p-3 bg-green-100 rounded-xl">
                <BookOpen className="w-7 h-7 text-green-700" />
              </div>
              <div>
                <p className="font-bold text-gray-800">Ngân hàng đề thi</p>
                <p className="text-sm text-gray-500">Cập nhật mới nhất</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="p-3 bg-purple-100 rounded-xl">
                <ShieldCheck className="w-7 h-7 text-purple-700" />
              </div>
              <div>
                <p className="font-bold text-gray-800">Bảo mật OTP</p>
                <p className="text-sm text-gray-500">Xác thực 2 lớp</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Login Form */}
        <div className="w-full">
          <form onSubmit={handleLogin} className="bg-white rounded-3xl shadow-2xl p-10 backdrop-blur-sm bg-opacity-98 border border-gray-100 max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Đăng nhập</h1>
              <p className="text-lg text-gray-600 mt-2">Tiếp tục hành trình chinh phục TOEIC</p>
            </div>

            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <p className="text-red-700 font-medium">{errors.general}</p>
              </div>
            )}

            <div className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    maxLength={40}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email của bạn"
                    className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${                      errors.email ? "border-red-500" : "border-gray-200"
                    }`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1.5">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    maxLength={50}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin(e)}
                    className={`w-full pl-11 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.password ? "border-red-500" : "border-gray-200"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1.5">{errors.password}</p>}
              </div>

              {/* Options */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-gray-600 cursor-pointer">
                  <input type="checkbox" checked={remember} onChange={() => setRemember(!remember)} className="mr-2 w-4 h-4 accent-indigo-600 rounded" />
                  Ghi nhớ đăng nhập
                </label>
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Quên mật khẩu?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3.5 bg-gradient-to-r from-blue-500 to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center group ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                ) : (
                  <>
                    Đăng nhập
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              
              {/* Divider */}
              <div className="flex items-center my-6">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="px-4 text-sm text-gray-500">Hoặc</span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>
              
              {/* Google Login */}
              <div className="mt-6">
                <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                      try {
                        const res = await api.post("/auth/google", {
                          tokenId: credentialResponse.credential,
                        });

                        if (res.data.success) {
                          const { user, accessToken } = res.data.data;
                          setAccessToken(accessToken);
                          localStorage.setItem("fullname", user.fullname);
                          localStorage.setItem("email", user.email);
                          localStorage.setItem("avatarUrl", user.avatarUrl);
                          localStorage.setItem("userId", user.id);
                          window.dispatchEvent(new Event("userUpdated"));
                          navigate("/");
                        } else {
                          setErrors({
                            general:
                              res.data.message || "Đăng nhập Google thất bại",
                          });
                        }
                      } catch (err: any) {
                        setErrors({
                          general:
                            err.response?.data?.message || "Lỗi kết nối server",
                        });
                      }
                    }}
                    onError={() =>
                      setErrors({ general: "Đăng nhập Google thất bại" })
                    }
                  />
              </div>
            </div>

            {/* Register Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Chưa có tài khoản?{" "}
                <Link to="/register" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Đăng ký miễn phí
                </Link>
              </p>
            </div>
          </form>
          
          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-6">© 2025 TOEIC Master. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;