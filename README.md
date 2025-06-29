project/
backend/
├── main.py # Chạy FastAPI app
├── db.py # Kết nối MySQL
├── routes/
│ ├── **init**.py
│ ├── sanpham.py # API bảng SanPham
│ └── ... # Các bảng khác

├── frontend/ # React frontend (sẽ xây)
│ ├── public/
│ ├── src/
│ │ ├── components/ # Các component chung
│ │ ├── pages/ # Mỗi bảng là một page riêng
│ │ └── App.jsx
│ └── package.json

├── README.md
