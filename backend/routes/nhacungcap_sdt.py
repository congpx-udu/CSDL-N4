from fastapi import APIRouter, HTTPException
from db import get_connection

router = APIRouter(prefix="/nhacungcap_sdt", tags=["NhaCungCap_SoDienThoai"])

# Lấy tất cả số điện thoại của tất cả nhà cung cấp
@router.get("/")
def get_all_sdt():
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("SELECT * FROM NhaCungCap_SoDienThoai")
        result = cursor.fetchall()
    conn.close()
    return result

# Lấy số điện thoại theo mã nhà cung cấp
@router.get("/{mancc}")
def get_sdt_by_ncc(mancc: str):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("SELECT * FROM NhaCungCap_SoDienThoai WHERE MaNCC = %s", (mancc,))
        result = cursor.fetchall()
    conn.close()
    return result

# Thêm số điện thoại mới
@router.post("/")
def create_sdt(data: dict):
    import re
    phone = data.get("SoDienThoai", "")
    if not re.fullmatch(r"0\d{9,10}", phone):
        raise HTTPException(status_code=400, detail="Số điện thoại phải bắt đầu bằng 0, chỉ chứa số và có 10 hoặc 11 chữ số!")
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute("""
                INSERT INTO NhaCungCap_SoDienThoai (MaNCC, SoDienThoai)
                VALUES (%s, %s)
            """, (data["MaNCC"], data["SoDienThoai"]))
            conn.commit()
        conn.close()
        return {"message": "Đã thêm số điện thoại nhà cung cấp"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Xoá số điện thoại theo mã NCC và số
@router.delete("/{mancc}/{sdt}")
def delete_sdt(mancc: str, sdt: str):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("""
            DELETE FROM NhaCungCap_SoDienThoai
            WHERE MaNCC = %s AND SoDienThoai = %s
        """, (mancc, sdt))
        conn.commit()
    conn.close()
    return {"message": "Đã xoá số điện thoại nhà cung cấp"}
