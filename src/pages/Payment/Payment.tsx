import api, { isLoggedIn } from "../../config/axios.js";
import { GiBrain } from "react-icons/gi";
import { FaComments } from "react-icons/fa";
import { IoPlayForward } from "react-icons/io5";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginModal from "../../layouts/common/LoginModal";

interface Package {
  _id: string;
  name: string;
  durationMonths: number;
  originalPrice: number;
  discountedPrice: number;
  description?: string;
  type: "basic" | "advanced" | "premium";
}

const PaymentPage: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await api.get("/vip");
        setPackages(res.data.data);
      } catch (err) {
        console.error("Error fetching packages", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const handleBuy = async (pkgId: string) => {
    if (!isLoggedIn()) {
      setShowLoginModal(true);
      return;
    }
    try {
      const res = await api.post("/payment/create", { packageId: pkgId });
      if (res.data.paymentUrl) {
        window.location.href = res.data.paymentUrl; // redirect sang VNPay
      }
    } catch (err: any) {
      console.error("Payment error", err);
      const message =
        err.response?.data?.message || "Lỗi khi tạo đơn thanh toán";
      setPopupMessage(message);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code === "00") {
      navigate("/payment/success");
    } else if (code) {
      navigate("/payment/fail");
    }
  }, [navigate]);

  const getDiscountPercent = (original: number, discounted: number) => {
    if (original <= discounted) return null;
    return Math.round(((original - discounted) / original) * 100);
  };

  return (
    <>
    <div className="min-h-screen flex flex-col items-center pt-5">
      <div className="max-w-5xl w-full mt-10 bg-white shadow-lg rounded-lg p-6">
        {/* Header */}
        <div className="text-center pb-10">
          <span className="text-[#1c1c1c] text-[40px] font-bold font-josefin-sans">
            Trải nghiệm học tập không giới hạn cùng gói{" "}
          </span>
          <span className="text-[#3364e1] text-[40px] font-bold font-josefin-sans">
            Premium
          </span>
        </div>

        {/* Payment Options */}
        {loading ? (
          <p className="text-center">Đang tải gói dịch vụ...</p>
        ) : (
          <div className="grid grid-cols-3 gap-6 mb-6 pb-6">
            {packages.map((pkg) => {
              const discountPercent = getDiscountPercent(
                pkg.originalPrice,
                pkg.discountedPrice
              );
              return (
                <div key={pkg._id}
                  className={`
                    p-6 flex flex-col justify-between rounded-lg transition-all duration-300 transform
                    ${ pkg.durationMonths === 2
                        ? "bg-blue-50 border border-blue-500 shadow-md hover:shadow-xl hover:-translate-y-2 hover:bg-blue-100"
                        : "bg-gray-100 border border-gray-400 hover:shadow-lg hover:-translate-y-1 hover:bg-gray-200"
                    }
                  `}>
                  {/* Package Info */}
                  <div className="mb-4 text-center">
                    <h3 className="text-xl font-semibold text-red-600">
                      {pkg.durationMonths} tháng
                    </h3>
                    <p className="text-lg text-gray-700 line-through">
                      {pkg.originalPrice.toLocaleString()}đ/tháng
                    </p>
                    <p className="text-xl font-semibold text-blue-600">
                      {pkg.discountedPrice.toLocaleString()}đ/tháng
                    </p>
                    {discountPercent && (
                      <span className="bg-green-100 text-green-700 text-sm font-semibold px-2 py-1 rounded-md">
                        -{discountPercent}%
                      </span>
                    )}
                    {pkg.description && (
                      <p className="text-sm text-gray-600 mt-2 italic">
                        {pkg.description}
                      </p>
                    )}
                  </div>

                  {/* Button */}
                  <button onClick={() => handleBuy(pkg._id)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md w-full text-center mt-auto
                               hover:bg-blue-700 hover:scale-105 transition-transform duration-300">
                    Đăng ký ngay
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Static Feature Section */}
        <div className="p-6 rounded-lg shadow-md max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Học tập hiệu quả hơn
          </h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <IoPlayForward className="text-green-500 text-2xl" />
              <div>
                <p className="font-medium text-gray-800">
                  Truy cập toàn bộ bài học
                </p>
                <p className="text-sm text-gray-600">
                  Học mọi lúc, mọi nơi với kho bài học đầy đủ.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <GiBrain className="text-pink-500 text-2xl" />
              <div>
                <p className="font-medium text-gray-800">
                  Công cụ luyện tập toàn diện
                </p>
                <p className="text-sm text-gray-600">
                  Luyện tập hiệu quả với các bài tập được cá nhân hóa.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <FaComments className="text-blue-500 text-2xl" />
              <div>
                <p className="font-medium text-gray-800">
                  Nhận phản hồi nhanh chóng
                </p>
                <p className="text-sm text-gray-600">
                  Học hiệu quả và cải thiện kỹ năng nhanh chóng.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup Message */}
      {popupMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-auto shadow-lg text-center">
            <p className="text-gray-800 mb-4">{popupMessage}</p>
            <button onClick={() => setPopupMessage(null)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 hover:scale-105 transition-transform duration-300">
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
    <LoginModal
      isOpen={showLoginModal}
      onClose={() => setShowLoginModal(false)}
      onSuccess={() => window.location.reload()}
    />
    </>
  );
};

export default PaymentPage;
