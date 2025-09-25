import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import api from "../../config/axios.js";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const recaptchaRef = useRef<InstanceType<typeof ReCAPTCHA> | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = recaptchaRef.current?.getValue(); // Lấy token ReCAPTCHA
    if (!token) {
      setMessage("Vui lòng xác thực CAPTCHA trước khi gửi.");
      return;
    }

    try {
      const res = await api.post("/auth/forgot-password", { email, token });
      setMessage(res.data.message);
      recaptchaRef.current?.reset(); // Reset ReCAPTCHA
      setEmail("")
      //navigate("/login");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Có lỗi xảy ra");
      recaptchaRef.current?.reset();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="flex max-w-4xl bg-white rounded-lg w-full overflow-hidden items-center">
        {/* Left Side */}
        <div className="flex-1 p-8 max-sm:hidden">
          <h2 className="text-xl font-bold text-gray-800">
            Ups, quay lại nào, bạn ơi!
          </h2>
          <div className="mt-4">
            <img
              src="src/assets/images/forgot_pass_img.jpg"
              alt="illustration"
              className="w-full"
            />
          </div>
        </div>

        {/* Right Side - Forgot Password Form */}
        <div className="flex-1 p-8 bg-blue-100">
          <h2 className="text-3xl font-bold mb-6 text-center">Quên mật khẩu</h2>
          {message && (
            <div className="bg-green-100 text-green-700 p-3 mb-4 rounded">
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="text-gray-700 text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            {/* ReCAPTCHA */}
            <div className="mt-2">
              <ReCAPTCHA
                sitekey="6LcPecArAAAAAOUVjIYmkFx3uaXw-HbomQYjCtqE"
                ref={recaptchaRef}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-lg hover:opacity-90 transition">
              Reset mật khẩu
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm">
              Bạn chưa có tài khoản?{" "}
              <Link className="text-blue-500 font-medium hover:underline" to={"/register"}>
                Đăng ký
              </Link>
            </p>
            <p className="text-sm mt-2">
              Quay lại{" "}
              <Link className="text-blue-500 font-medium hover:underline" to={"/login"}>
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
