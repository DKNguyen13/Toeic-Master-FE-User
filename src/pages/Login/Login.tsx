import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import api, { setAccessToken } from "../../config/axios.js";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    let newErrors: { email?: string; password?: string } = {};
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

        if (user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Left Side */}
        <div className="flex-1 p-10 bg-gradient-to-br from-blue-500 to-blue-800 text-white max-sm:hidden">
          <h2 className="text-3xl font-bold mb-4">TOEIC MASTER</h2>
          <p className="text-lg mb-6">Chinh phục TOEIC với lộ trình học tập chuyên sâu và bài thi chất lượng!</p>
          <img src="src/assets/images/ai-image.png"
            alt="TOEIC Illustration"
            className="w-full max-w-sm mx-auto rounded-xl shadow-lg"
          />
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 p-10">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Đăng nhập</h2>

            {errors.general && (
              <p className="text-red-500 text-center mb-6 bg-red-50 p-3 rounded-lg">{errors.general}</p>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="text-gray-700 text-sm font-medium block mb-2">
                  Email
                </label>
                <input type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email của bạn"
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                    errors.email ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="text-gray-700 text-sm font-medium block mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"}
                    id="password" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu"
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                      errors.password ? "border-red-500" : "border-gray-200"
                    }`}
                    minLength={5}
                  />
                  <button type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition">
                    {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              {/* Extra Options */}
              <div className="flex items-center justify-between mt-4">
                <label className="flex items-center text-sm text-gray-600">
                  <input type="checkbox" className="mr-2 accent-blue-500" /> Nhớ mật khẩu
                </label>
                <Link to="/forgot-password" className="text-sm text-blue-600 font-medium hover:underline"></Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 flex items-center justify-center ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}>
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : null}
                {isLoading ? "Đang xử lý..." : "Đăng nhập"}
              </button>
            </form>

            {/* OR Separator */}
            <div className="flex items-center my-6">
              <div className="flex-grow h-px bg-gray-300"></div>
              <span className="px-3 text-gray-500 text-sm">Hoặc</span>
              <div className="flex-grow h-px bg-gray-300"></div>
            </div>

            {/* Google Login */}
            <div className="mt-4">
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
                      window.dispatchEvent(new Event("userUpdated"));
                      navigate("/");
                    }
                    else{
                      setErrors({ general: res.data.message || "Đăng nhập Google thất bại" });
                    }
                  } catch (err : any) {
                    setErrors({ general: err.response?.data?.message || "Lỗi kết nối server" });
                  }
                }}
                onError={() => {
                  console.log("Đăng nhập Google thất bại");
                }}
              />
            </div>

            {/* Register link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Bạn chưa có tài khoản?{" "}
                <Link to="/register" className="text-blue-600 font-medium hover:underline">Đăng ký ngay</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
