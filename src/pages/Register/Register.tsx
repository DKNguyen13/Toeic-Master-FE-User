import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import api from "../../config/axios.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState<Date | null>(null);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [dobError, setDobError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpMessage, setOtpMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  // Check tuổi >= 16
  const isValidAge = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const m = today.getMonth() - date.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
      age--;
    }
    return age >= 16;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    // Validate tên
    if (!/^[\p{L}\s]+$/u.test(fullname.trim())) {
      setNameError("Tên chỉ được chứa chữ cái và khoảng trắng");
      hasError = true;
    } else {
      setNameError("");
    }

    // Validate mật khẩu
    if (password.length < 6) {
      setPasswordError("Mật khẩu phải ít nhất 6 ký tự");
      hasError = true;
    } else if (password !== confirmPassword) {
      setPasswordError("Mật khẩu không khớp");
      hasError = true;
    } else {
      setPasswordError("");
    }

    // Validate ngày sinh
    if (!isValidAge(dob)) {
      setDobError("Bạn phải từ 16 tuổi trở lên để đăng ký");
      hasError = true;
    } else {
      setDobError("");
    }

    // Validate số điện thoại
    if (phone.length < 10 || phone.length > 11) {
      setPhoneError("Số điện thoại phải từ 10 đến 11 chữ số");
      hasError = true;
    } else {
      setPhoneError("");
    }

    if (hasError) return;

    try {
      const res = await api.post("/auth/register", {
        fullName: fullname,
        email,
        password,
        phone,
        dob,
        otp,
      });

      if (res.data.success) {
        setOtpMessage({ type: "success", text: "Đăng ký thành công!" });
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
      } else {
        setPasswordError(res.data.message || "Có lỗi xảy ra");
      }
    } catch (error: any) {
      setPasswordError(error.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-blue-50 via-white to-pink-50 p-4">
      <div className="flex flex-col md:flex-row max-w-5xl bg-white shadow-2xl rounded-xl overflow-hidden w-full">
        {/* Left Side */}
        <div className="hidden md:flex flex-1 bg-gradient-to-tr from-blue-400 to-purple-500 items-center justify-center p-8">
          <div className="text-white text-center">
            <h2 className="text-3xl font-bold mb-6">Chào mừng bạn!</h2>
            <p className="mb-4">
              Hãy đăng ký ngay và khám phá các tính năng tuyệt vời!
            </p>
            <img
              src="src/assets/images/personalization-image.png"
              alt="illustration"
              className="mx-auto w-3/4 rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 p-8 md:p-12">
          <h2 className="text-3xl text-center font-bold mb-6 text-gray-800">
            Đăng ký
          </h2>
          <form onSubmit={handleRegister} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Tên</label>
              <input
                type="text"
                value={fullname}
                onChange={(e) => {
                  setFullname(e.target.value);
                  if (!/^[\p{L}\s]*$/u.test(e.target.value)) {
                    setNameError("Tên chỉ được chứa chữ cái và khoảng trắng");
                  } else {
                    setNameError("");
                  }
                }}
                placeholder="Nhập tên của bạn"
                maxLength={60}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 shadow-sm ${
                  nameError
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                required
              />
              {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <input
                type="email"
                maxLength={80}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Số điện thoại</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setPhone(value);
                  setPhoneError(
                    value.length < 10 || value.length > 11
                      ? "Số điện thoại phải từ 10 đến 11 chữ số"
                      : ""
                  );
                }}
                placeholder="Nhập số điện thoại"
                maxLength={11}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 shadow-sm ${
                  phoneError
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                required
              />
              {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
            </div>

            {/* DOB with DatePicker */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Ngày sinh</label>
              <DatePicker
                selected={dob}
                onChange={(date) => setDob(date)}
                maxDate={new Date()}
                showYearDropdown
                showMonthDropdown
                placeholderText="Chọn ngày sinh"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 shadow-sm ${
                  dobError
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                dateFormat="dd/MM/yyyy"
              />
              {dobError && <p className="text-red-500 text-sm mt-1">{dobError}</p>}
            </div>

            {/* Password & Confirm Password */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  maxLength={30}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  minLength={6}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 shadow-sm ${
                    passwordError
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                >
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Xác nhận mật khẩu</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  maxLength={30}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  minLength={6}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 shadow-sm ${
                    passwordError
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                >
                  {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </button>
              </div>
              {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
            </div>

            {/* OTP Section */}
            <div>
              <label className="block text-gray-600 font-medium mb-1">OTP</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="Nhập mã OTP"
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                  maxLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      if (!email) {
                        setOtpMessage({
                          type: "error",
                          text: "Vui lòng nhập email trước khi gửi OTP",
                        });
                        return;
                      }
                      await api.post("/auth/send-otp", { email });
                      setOtpMessage({
                        type: "success",
                        text: "OTP đã được gửi đến email của bạn!",
                      });
                    } catch (error: any) {
                      setOtpMessage({
                        type: "error",
                        text: error.response?.data?.message || "Lỗi server khi gửi OTP",
                      });
                    }
                  }}
                  className="bg-gradient-to-r from-blue-500 shadow-lg to-purple-500 rounded-lg hover:opacity-90 text-white px-4 py-2 font-medium transition"
                >
                  Gửi OTP
                </button>
              </div>
              {otpMessage && (
                <p
                  className={`text-sm mt-1 ${
                    otpMessage.type === "error" ? "text-red-500" : "text-green-600"
                  }`}
                >
                  {otpMessage.text}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-lg hover:opacity-90 transition"
            >
              Đăng ký
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Bạn đã có tài khoản?{" "}
            <Link className="text-blue-500 font-medium hover:underline" to="/login">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
