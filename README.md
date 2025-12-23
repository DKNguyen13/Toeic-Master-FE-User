# TOEIC MASTER – Frontend User

## 📌 Giới thiệu
**Toeic Master Frontend User** là giao diện dành cho **người học TOEIC**, cho phép người dùng đăng ký tài khoản, học tập, luyện thi TOEIC trực tuyến và theo dõi kết quả học tập.

Frontend User giao tiếp với **Toeic Master Backend API** để xử lý dữ liệu, xác thực và lưu trữ kết quả học tập.

---

## 👨‍🎓 Nhóm sinh viên thực hiện
- **Dương Khánh Nguyên** – 22110383  
- **Nguyễn Nhật Nguyên** – 22110384  

---

## 📝 Ghi chú
Dự án được xây dựng phục vụ mục đích học tập và báo cáo môn học.

---

## 🌐 Link deploy
🔗 https://toeic-master.onrender.com

---

## 🛠️ Công nghệ sử dụng
- **React 18**
- **Vite**
- **React Router DOM**
- **Axios**
- **Tailwind CSS**
- **Socket.IO Client**
- **Chart.js**
- **Framer Motion**
- **Google OAuth**
- **Google reCAPTCHA**

---

## 📦 Thư viện chính
- react, react-dom
- react-router-dom
- axios
- tailwindcss
- socket.io-client
- chart.js, react-chartjs-2
- framer-motion
- lucide-react, react-icons
- react-chatbot-kit
- react-toastify
- react-google-recaptcha
- react-markdown, katex

---

## 📈 Chức năng chính

### 👤 Quản lý tài khoản người dùng
- Đăng ký, đăng nhập, đăng xuất
- Quên mật khẩu, đổi mật khẩu
- Xem thông tin cá nhân
- Cập nhật thông tin cá nhân

### 📚 Học tập và ôn luyện TOEIC
- Xem danh sách và tìm kiếm bài học
- Xem chi tiết nội dung bài học
- Luyện nghe và điền từ còn thiếu
- Hệ thống flashcard hỗ trợ ghi nhớ từ vựng
- Tích hợp Laban Dictionary để hỗ trợ tra cứu từ vựng cho người học
- Cho phép người học tạo ghi chú trong quá trình học

### 📝 Luyện thi TOEIC trực tuyến
- Làm bài thi TOEIC online
- Xem kết quả và đáp án bài thi
- Theo dõi tiến độ học tập

### 🤖 Hỗ trợ học tập bằng AI
- Gợi ý và nhận xét kết quả học tập từ AI
- Chatbot hỗ trợ học tiếng Anh

### 💬 Tương tác và hỗ trợ người dùng
- Thêm, chỉnh sửa, xóa bình luận dưới bài thi
- Gửi yêu cầu hỗ trợ và liên hệ

---

## 🔐 Biến môi trường (.env)

Tạo file `.env` trong thư mục gốc và cấu hình các biến môi trường sau:
```env
VITE_GOOGLE_CLIENT_ID=

# Local Development
VITE_API_BASE_URL=http://localhost:8080
```
---

## 🚀 Cách chạy Frontend User (Local)

### 1️⃣ Clone project
```bash
git clone https://github.com/DKNguyen13/Toeic-Master-FE-User.git
cd Toeic-Master-FE-User
```
### 2️⃣ Cài đặt dependencies
```bash
npm install
```
### 3️⃣ Tạo file `.env`
Tạo file `.env` trong thư mục gốc và cấu hình các biến môi trường theo mẫu bên dưới.

### 4️⃣ Chạy server
```bash
npm run dev
```
Sau khi chạy thành công, truy cập:
👉 http://localhost:3000
