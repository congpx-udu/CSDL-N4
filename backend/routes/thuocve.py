from fastapi import APIRouter, HTTPException
from db import get_connection

router = APIRouter(prefix="/thuocve", tags=["ThuocVe"])

# 1. Lấy tất cả
@router.get("/")
def get_all_thuocve():
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("SELECT * FROM ThuocVe")
        result = cursor.fetchall()
    conn.close()
    return result

# 2. Lấy một dòng theo 3 khóa chính
@router.get("/{masp}/{madon}/{mapx}")
def get_thuocve(masp: str, madon: str, mapx: str):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("""
            SELECT * FROM ThuocVe
            WHERE MaSP = %s AND MaDon = %s AND MaPX = %s
        """, (masp, madon, mapx))
        result = cursor.fetchone()
    conn.close()
    if not result:
        raise HTTPException(status_code=404, detail="Không tìm thấy bản ghi")
    return result

# 3. Thêm mới
@router.post("/")
def create_thuocve(data: dict):
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute("""
                INSERT INTO ThuocVe (MaSP, MaDon, MaPX, SoLuongSanPham)
                VALUES (%s, %s, %s, %s)
            """, (
                data["MaSP"], data["MaDon"], data["MaPX"], data["SoLuongSanPham"]
            ))
            conn.commit()
        conn.close()
        return {"message": "Đã thêm thành công"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 4. Xoá
@router.delete("/{masp}/{madon}/{mapx}")
def delete_thuocve(masp: str, madon: str, mapx: str):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("""
            DELETE FROM ThuocVe
            WHERE MaSP = %s AND MaDon = %s AND MaPX = %s
        """, (masp, madon, mapx))
        conn.commit()
    conn.close()
    return {"message": "Đã xoá bản ghi"}
