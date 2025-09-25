import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import LeftSidebarUser from "../../components/LeftSidebarUser";

const Settings: React.FC = () => {
	const [fullname, setFullname] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");

	useEffect(() => {
		setFullname(localStorage.getItem("fullname") || "");
		setEmail(localStorage.getItem("email") || "");
		setPhone(localStorage.getItem("phone") || "");
	}, []);

	return (
		<div className="min-h-screen flex">
			{/* Left Sidebar */}
			<LeftSidebarUser customHeight="h-auto w-64" />
			{/* Form Cài đặt */}
			<div className="flex-1 bg-gray-50 flex justify-center pt-5 pb-96">
				<div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg">
					<h1 className="text-2xl font-semibold text-blue-600 mb-6 text-center">
						Thông tin tài khoản
					</h1>
					<form className="space-y-4">
						{/* Username */}
						<div>
							<label className="block text-gray-700 font-semibold mb-2">
								Fullname
							</label>
							<input
								type="text"
								value={fullname}
								className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 cursor-not-allowed"
								readOnly
							/>
						</div>

						{/* Email */}
						<div>
							<label className="block text-gray-700 font-semibold mb-2"> Email </label>
							<input type="email" value={email} className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 cursor-not-allowed" readOnly/>
						</div>

						{/* Số điện thoại */}
						<div>
							<label className="block text-gray-700 font-semibold mb-2">
								Số điện thoại
							</label>
							<input
								type="tel"
								value={phone}
								className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 cursor-not-allowed"
								readOnly
							/>
						</div>

						{/* Nút Lưu*/}
						<div className="text-right pt-10">
							<Link
								to="/settings/edit-info"
								className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition duration-300 inline-block text-center">
								Chỉnh sửa
							</Link>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Settings;
