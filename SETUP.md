# Setup Dự án Quản lý Kho hàng

## Cài đặt

### 1. Tạo môi trường ảo
```bash
python -m venv venv
```

### 2. Kích hoạt môi trường
**Windows:**
```bash
venv\Scripts\activate
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

### 3. Cài dependencies
```bash
pip install -r backend/requirements.txt
```

## Chạy ứng dụng

```bash
cd backend
uvicorn main:app --reload
```

Truy cập: http://localhost:8000

## API Docs
- Swagger: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Database
Cập nhật thông tin kết nối trong `backend/db.py`:
```python
host="localhost"
user="root" 
password="your_password"
database="QLKho"

Lưu ý tìm đúng file và ghi đúng thông tin !
```

## Cấu trúc dự án

```
CSDL-N4/
├── backend/                 # FastAPI + MySQL
│   ├── main.py             # Chạy server
│   ├── db.py               # Kết nối database
│   ├── routes/             # API endpoints
│   │   ├── sanpham.py      # Quản lý sản phẩm
│   │   ├── khohang.py      # Quản lý kho
│   │   ├── khachhang.py    # Quản lý khách hàng
│   │   └── dondathang.py   # Quản lý đơn hàng
│   └── requirements.txt
├── frontend/               # React
│   ├── src/
│   │   ├── components/     # Components chung
│   │   ├── services/       # Gọi API
│   │   └── App.js
│   └── package.json
└── README.md
```

## Lưu ý cho nhóm

1. **Luôn kích hoạt môi trường ảo trước khi làm việc**
2. **Không commit file venv/ vào git**
3. **Cập nhật requirements.txt khi thêm package mới**
4. **Backup database thường xuyên**
5. **Test API trước khi commit**

## Troubleshooting

### Lỗi kết nối database
- Kiểm tra MySQL service đã chạy chưa
- Kiểm tra thông tin kết nối trong db.py
- Đảm bảo database QLKho đã được tạo

### Lỗi import module
- Đảm bảo môi trường ảo đã được kích hoạt
- Chạy lại `pip install -r backend/requirements.txt`

### Lỗi port đã được sử dụng
- Thay đổi port: `uvicorn main:app --reload --port 8001`
- Hoặc tắt process đang sử dụng port 8000 