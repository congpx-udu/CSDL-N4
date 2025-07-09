from fastapi import APIRouter, HTTPException
from db import get_connection
import re

router = APIRouter(prefix="/khachhang_sdt", tags=["KhachHang_SoDienThoai"])

@router.get("/")
def get_all_sdt():
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("SELECT * FROM KhachHang_SoDienThoai")
        result = cursor.fetchall()
    conn.close()
    return result

@router.get("/{makh}")
def get_sdt_by_kh(makh: str):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("SELECT * FROM KhachHang_SoDienThoai WHERE MaKH = %s", (makh,))
        result = cursor.fetchall()
    conn.close()
    return result

@router.post("/")
def create_sdt(data: dict):
    phone = data.get("SoDienThoai", "")
    if not re.fullmatch(r"0\d{9,10}", phone):
        raise HTTPException(status_code=400, detail="Số điện thoại phải bắt đầu bằng 0, chỉ chứa số và có 10 hoặc 11 chữ số!")
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute("""
                INSERT INTO KhachHang_SoDienThoai (MaKH, SoDienThoai)
                VALUES (%s, %s)
            """, (data["MaKH"], data["SoDienThoai"]))
            conn.commit()
        conn.close()
        return {"message": "Đã thêm số điện thoại"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{makh}/{sdt}")
def delete_sdt(makh: str, sdt: str):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("""
            DELETE FROM KhachHang_SoDienThoai
            WHERE MaKH = %s AND SoDienThoai = %s
        """, (makh, sdt))
        conn.commit()
    conn.close()
    return {"message": "Đã xoá số điện thoại"}
