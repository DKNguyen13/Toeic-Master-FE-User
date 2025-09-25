import React from "react";
import { IoPlayForward } from "react-icons/io5";
import { GiBrain } from "react-icons/gi";
import { Link } from "react-router-dom";
import { FaComments } from "react-icons/fa";

const PaymentPage: React.FC = () => {
	return (
		<div className="min-h-screen flex flex-col items-center pt-5">
			{/* Content */}
			<div className="max-w-4xl w-full mt-10 bg-white shadow-lg rounded-lg p-6">
				<div className="text-center justify-start pb-10">
					<span className="text-[#1c1c1c] text-[40px] font-bold font-josefin-sans">
						Trải nghiệm học tập không giới hạn cùng gói{" "}
					</span>
					<span className="text-[#3364e1] text-[40px] font-bold font-josefin-sans">
						Premium
					</span>
				</div>

				{/* Payment Options */}
				<div className="grid grid-cols-3 gap-6 mb-6 pb-6">
					{/* 12 months plan */}
					<div className="p-6 bg-blue-50 border border-blue-500 rounded-lg text-center shadow-md">
						<div className="mb-4">
							<h3 className="text-xl font-semibold text-blue-600">
								12 tháng
							</h3>
							<p className="text-lg text-gray-700 line-through">
								299.000đ/tháng
							</p>
							<p className="text-xl font-semibold text-blue-600">
								249.000đ/tháng
							</p>
						</div>
						<Link
							to="/payment/paymentform"
							className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition duration-300 w-full"
						>
							Tiết kiệm 50%
						</Link>
					</div>
					{/* 6 months plan */}
					<div className="p-6 bg-gray-100 border border-gray-400 rounded-lg text-center">
						<div className="mb-4">
							<h3 className="text-xl font-semibold text-blue-600">
								6 tháng
							</h3>
							<p className="text-lg text-gray-700 line-through">
								299.000đ/tháng
							</p>
							<p className="text-xl font-semibold text-blue-600">
								249.000đ/tháng
							</p>
						</div>
						<Link
							to="/payment/paymentform"
							className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition duration-300 w-full"
						>
							Tiết kiệm 50%
						</Link>
					</div>
					{/* 1 month plan */}
					<div className="p-6 bg-gray-100 border border-gray-400 rounded-lg text-center">
						<div className="mb-4">
							<h3 className="text-xl font-semibold text-blue-600">
								1 tháng
							</h3>
							<p className="text-lg text-gray-700 line-through">
								299.000đ/tháng
							</p>
							<p className="text-xl font-semibold text-blue-600">
								249.000đ/tháng
							</p>
						</div>
						<Link
							to="/payment/paymentform"
							className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition duration-300 w-full"
						>
							Tiết kiệm 50%
						</Link>
					</div>
				</div>

				{/* Description Section */}
				<div className=" p-6 rounded-lg shadow-md max-w-md mx-auto">
					<h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
						Học tập hiệu quả hơn
					</h3>

					<div className="space-y-4">
						{/* Mục 1 */}
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

						{/* Mục 2 */}
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

						{/* Mục 3 */}
						<div className="flex items-start space-x-4">
							<FaComments className="text-blue-500 text-2xl" />
							<div>
								<p className="font-medium text-gray-800">
									Nhận phản hồi nhanh chóng & chính xác
								</p>
								<p className="text-sm text-gray-600">
									Học hiệu quả và cải thiện kỹ năng nhanh chóng.
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Sign-up Button */}
				<div className="text-center pt-10 pb-10">
					<Link
						to="/payment/paymentform"
						className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition duration-300"
					>
						Đăng ký
					</Link>
				</div>
			</div>
		</div>
	);
};

export default PaymentPage;
