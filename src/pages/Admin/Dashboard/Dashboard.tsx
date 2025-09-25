import React from "react";
import { FaUsers, FaFileAlt, FaChartLine } from "react-icons/fa";
import { MdOutlineCloudDone } from "react-icons/md";
import { Line } from "react-chartjs-2"; // Biểu đồ (có thể sử dụng chart.js)
import LeftSidebarAdmin from "../../../components/LeftSidebarAdmin";

// Dữ liệu mẫu cho biểu đồ
const data = {
	labels: [
		"5k",
		"10k",
		"15k",
		"20k",
		"25k",
		"30k",
		"35k",
		"40k",
		"45k",
		"50k",
		"55k",
		"60k",
	],
	datasets: [
		{
			label: "Doanh thu",
			data: [50, 55, 60, 63, 64, 50, 52, 56, 58, 54, 59, 60],
			borderColor: "#4A90E2",
			fill: false,
			tension: 0.1,
		},
	],
};

const options = {
	responsive: true,
	scales: {
		x: {
			title: {
				display: true,
				text: "Người dùng", // Đặt tên cho trục X
			},
			ticks: {
				autoSkip: true,
				maxTicksLimit: 6, // Giới hạn số lượng nhãn trên trục X
			},
		},
		y: {
			title: {
				display: true,
				text: "Doanh thu (%)", // Đặt tên cho trục Y
			},
			beginAtZero: true, // Đảm bảo trục Y bắt đầu từ 0
		},
	},
};

const DashboardPage: React.FC = () => {
	return (
		<div className="min-h-screen flex bg-gray-50">
			{/* Left Sidebar */}
			<LeftSidebarAdmin customHeight="h-auto w-64" />

			{/* Main Content */}
			<div className="flex-1 p-8">
				<h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

				{/* Tổng quan */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					{/* Card 1 - Số người dùng */}
					<div className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
						<div>
							<h2 className="text-xl font-semibold text-gray-700">
								Tổng số người dùng
							</h2>
							<p className="text-2xl font-bold text-gray-800">40,689</p>
							<p className="text-green-600">+8.5% so với Hôm qua</p>
						</div>
						<FaUsers className="text-blue-600 text-4xl" />
					</div>

					{/* Card 2 - Số bài thi */}
					<div className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
						<div>
							<h2 className="text-xl font-semibold text-gray-700">
								Tổng số bài thi đã làm
							</h2>
							<p className="text-2xl font-bold text-gray-800">10,293</p>
							<p className="text-green-600">+1.3% so với Tuần trước</p>
						</div>
						<FaFileAlt className="text-orange-600 text-4xl" />
					</div>

					{/* Card 3 - Doanh thu */}
					<div className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
						<div>
							<h2 className="text-xl font-semibold text-gray-700">
								Tổng doanh thu
							</h2>
							<p className="text-2xl font-bold text-gray-800">
								89,000,000
							</p>
							<p className="text-green-600">+4.3% So với Hôm qua</p>
						</div>
						<FaChartLine className="text-green-600 text-4xl" />
					</div>

					{/* Card 4 - Tỷ lệ hoàn thành bài */}
					<div className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
						<div>
							<h2 className="text-xl font-semibold text-gray-700">
								Tỷ lệ hoàn thành bài
							</h2>
							<p className="text-2xl font-bold text-gray-800">80%</p>
							<p className="text-green-600">+1.8% So với Hôm qua</p>
						</div>
						<MdOutlineCloudDone className="text-red-600 text-4xl" />
					</div>
				</div>

				{/* Biểu đồ doanh thu */}
				<div className="bg-white p-6 rounded-lg shadow mb-8">
					<h2 className="text-xl font-semibold text-gray-800 mb-4">
						Chi tiết doanh thu
					</h2>
					<Line data={data} options={options} />
				</div>
			</div>
		</div>
	);
};

export default DashboardPage;
