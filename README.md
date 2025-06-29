project/
backend/
├── main.py # Chạy FastAPI app
├── db.py # Kết nối MySQL
├── routes/
│ ├── **init**.py
│ ├── sanpham.py # API bảng SanPham
│ └── ... # Các bảng khác

├── frontend/
│ ├── public/ # Static files (favicon, index.html)
│ ├── src/
│ │ ├── components/ # Các component dùng lại
│ │ ├── pages/ # Các trang chính (Home, CRUD...)
│ │ ├── services/ # API services kết nối FastAPI
│ │ ├── App.jsx # Thành phần gốc React
│ │ └── main.jsx # Điểm bắt đầu frontend
│ ├── package.json # Thông tin project React
│ └── vite.config.js # Cấu hình Vite hoặc Webpack

├── README.md
