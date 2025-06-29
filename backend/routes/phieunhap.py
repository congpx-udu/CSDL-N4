from fastapi import APIRouter, HTTPException
from db import get_connection

router = APIRouter(prefix="/phieunhap", tags=["PhieuNhap"])

# 1. Lấy tất cả phiếu nhập
@router.get("/")
def get_all_phieunhap():
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("SELECT * FROM PhieuNhap")
        result = cursor.fetchall()
    conn.close()
    return result

# 2. Lấy phiếu nhập theo mã
@router.get("/{mapn}")
def get_phieunhap(mapn: str):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("SELECT * FROM PhieuNhap WHERE MaPN = %s", (mapn,))
        result = cursor.fetchone()
    conn.close()
    if not result:
        raise HTTPException(status_code=404, detail="Không tìm thấy phiếu nhập")
    return result

# 3. Thêm phiếu nhập mới
@router.post("/")
def create_phieunhap(pn: dict):
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            sql = """
                INSERT INTO PhieuNhap (MaPN, NgayNhap, TongTien, MaKho)
                VALUES (%s, %s, %s, %s)
            """
            cursor.execute(sql, (
                pn["MaPN"],
                pn["NgayNhap"],
                pn["TongTien"],
                pn["MaKho"]
            ))
            conn.commit()
        conn.close()
        return {"message": "Thêm phiếu nhập thành công"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 4. Xoá phiếu nhập
@router.delete("/{mapn}")
def delete_phieunhap(mapn: str):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("DELETE FROM PhieuNhap WHERE MaPN = %s", (mapn,))
        conn.commit()
    conn.close()
    return {"message": "Đã xoá phiếu nhập"}
