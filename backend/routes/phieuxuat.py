from fastapi import APIRouter, HTTPException
from db import get_connection

router = APIRouter(prefix="/phieuxuat", tags=["PhieuXuat"])

# 1. Lấy toàn bộ phiếu xuất
@router.get("/")
def get_all_phieuxuat():
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("SELECT * FROM PhieuXuat")
        result = cursor.fetchall()
    conn.close()
    return result

# 2. Lấy phiếu xuất theo mã
@router.get("/{mapx}")
def get_phieuxuat(mapx: str):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("SELECT * FROM PhieuXuat WHERE MaPX = %s", (mapx,))
        result = cursor.fetchone()
    conn.close()
    if not result:
        raise HTTPException(status_code=404, detail="Không tìm thấy phiếu xuất")
    return result

# 3. Thêm phiếu xuất
@router.post("/")
def create_phieuxuat(p: dict):
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            sql = """
                INSERT INTO PhieuXuat (MaPX, NgayXuat, TongTien, MaKho)
                VALUES (%s, %s, %s, %s)
            """
            cursor.execute(sql, (
                p["MaPX"],
                p["NgayXuat"],
                p["TongTien"],
                p["MaKho"]
            ))
            conn.commit()
        conn.close()
        return {"message": "Thêm phiếu xuất thành công"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 4. Xoá phiếu xuất
@router.delete("/{mapx}")
def delete_phieuxuat(mapx: str):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("DELETE FROM PhieuXuat WHERE MaPX = %s", (mapx,))
        conn.commit()
    conn.close()
    return {"message": "Đã xoá phiếu xuất"}
