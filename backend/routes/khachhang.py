from fastapi import APIRouter, HTTPException
from db import get_connection

router = APIRouter(prefix="/khachhang", tags=["KhachHang"])

# 1. Lấy tất cả khách hàng
@router.get("/")
def get_all_khachhang():
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("SELECT * FROM KhachHang")
        result = cursor.fetchall()
    conn.close()
    return result

# 2. Lấy 1 khách hàng theo mã
@router.get("/{makh}")
def get_khachhang(makh: str):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("SELECT * FROM KhachHang WHERE MaKH = %s", (makh,))
        result = cursor.fetchone()
    conn.close()
    if not result:
        raise HTTPException(status_code=404, detail="Không tìm thấy khách hàng")
    return result

# 3. Thêm khách hàng
@router.post("/")
def create_khachhang(kh: dict):
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            sql = """
                INSERT INTO KhachHang (MaKH, TenKH, DiaChi, Email)
                VALUES (%s, %s, %s, %s)
            """
            cursor.execute(sql, (
                kh["MaKH"],
                kh["TenKH"],
                kh["DiaChi"],
                kh["Email"]
            ))
            conn.commit()
        conn.close()
        return {"message": "Thêm khách hàng thành công"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 4. Xoá khách hàng
@router.delete("/{makh}")
def delete_khachhang(makh: str):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("DELETE FROM KhachHang WHERE MaKH = %s", (makh,))
        conn.commit()
    conn.close()
    return {"message": "Xoá khách hàng thành công"}
