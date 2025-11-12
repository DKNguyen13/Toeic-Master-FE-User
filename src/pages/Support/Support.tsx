import React, { useState } from "react";
import api from "../../config/axios";
import { FaEnvelope, FaPaperPlane } from "react-icons/fa";
import LeftSidebarUser from "../../components/LeftSidebarUser";
import { Phone, CheckCircle, PhoneCall, ExternalLink } from "lucide-react";

const Support: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    content: ""
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.title.trim() || !formData.content.trim()) {
      setStatus("error");
      setMessage("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    setLoading(true);
    setStatus("idle");

    try {
      await api.post("/auth/support", formData);
      setStatus("success");
      setMessage("Gửi thành công! Chúng tôi sẽ phản hồi sớm nhất.");
      setFormData({ name: "", title: "", content: "" });
      
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err: any) {
      setStatus("error");
      setMessage(err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <LeftSidebarUser customHeight="h-auto w-64" />
      
      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8 lg:p-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <FaEnvelope className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                  Hỗ trợ & Liên hệ
                </h1>
                <p className="text-gray-500 mt-1">Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7</p>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Gửi thắc mắc hoặc báo lỗi cho chúng tôi. Đội ngũ hỗ trợ sẽ phản hồi mail của bạn trong vòng 24h!
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <FaPaperPlane className="text-blue-500" />
                  Gửi tin nhắn
                </h2>

                {/* Status Messages */}
                {status === "success" && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 animate-fadeIn">
                    <CheckCircle className="text-green-500 text-xl flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-green-800 font-medium">Thành công!</p>
                      <p className="text-green-600 text-sm">{message}</p>
                    </div>
                  </div>
                )}

                {status === "error" && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-fadeIn">
                    <CheckCircle className="text-red-500 text-xl flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-800 font-medium">Lỗi!</p>
                      <p className="text-red-600 text-sm">{message}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên của bạn: <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      maxLength={50}
                      placeholder="Nhập tên của bạn"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.name.length}/50 ký tự
                    </p>
                  </div>

                  {/* Title Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tiêu đề: <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      maxLength={50}
                      placeholder="Tóm tắt vấn đề của bạn"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.title.length}/50 ký tự
                    </p>
                  </div>

                  {/* Content Textarea */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nội dung: <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      maxLength={1000}
                      placeholder="Mô tả chi tiết vấn đề hoặc câu hỏi của bạn..."
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.content.length}/1000 ký tự
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:ring-4 focus:ring-blue-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        Gửi tin nhắn
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Quick Contact Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-7 hover:shadow-2xl transition-shadow duration-300">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="w-2 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></span>
                  Liên hệ nhanh
                </h3>

                <div className="space-y-5">
                  {/* Email */}
                  <div className="group flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-sky-50 rounded-2xl hover:from-blue-100 hover:to-sky-100 transition-all duration-300">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                      <FaEnvelope className="text-white text-lg" />
                    </div>
                    <div className="flex-1 min-w-0"> {/* ← Quan trọng: min-w-0 để cho phép truncate */}
                      <p className="text-sm font-medium text-gray-600">Email hỗ trợ</p>
                      <a 
                        href="mailto:support@toeicmaster.com" 
                        className="text-base font-semibold text-blue-700 hover:text-blue-900 transition-colors flex items-center gap-1 truncate block"
                      >
                        <span className="truncate">support@toeicmaster.com</span>
                        <ExternalLink className="text-xs opacity-70 flex-shrink-0" />
                      </a>
                    </div>
                  </div>

                  {/* Hotline */}
                  <div className="group flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl hover:from-emerald-100 hover:to-green-100 transition-all duration-300">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                      <Phone className="text-white text-lg" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">Hotline (24/7)</p>
                      <a 
                        href="tel:0123456789" 
                        className="text-base font-semibold text-emerald-700 hover:text-emerald-900 transition-colors flex items-center gap-1"
                      >
                        0123-456-789
                        <PhoneCall className="text-xs opacity-70" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips Card */}
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-2xl p-7 text-white overflow-hidden relative">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-pink-300 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                    <span className="text-2xl">Hỗ trợ nhanh</span>
                  </h3>
                  <ul className="space-y-3 text-base">
                    <li className="flex items-start gap-3">
                      <span className="text-2xl mt-0.5">✓</span>
                      <span>Mô tả chi tiết vấn đề bạn gặp phải</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-2xl mt-0.5">✓</span>
                      <span>Đính kèm ảnh chụp màn hình (nếu có)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-2xl mt-0.5">✓</span>
                      <span>Cung cấp thông tin thiết bị & phiên bản app</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-2xl mt-0.5">✓</span>
                      <span>Vui lòng kiểm tra mail để nhận phản hồi trong vòng <strong className="text-yellow-300">24h</strong></span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;