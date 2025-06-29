from fastapi import APIRouter, HTTPException
from db import get_connection

router = APIRouter(prefix="/chon", tags=["Chon"])

# 1. Lấy tất cả bản ghi
@router.get("/")
def get_all_chon():
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("SELECT * FROM Chon")
        result = cursor.fetchall()
    conn.close()
    return result

# 2. Lấy bản ghi theo MaKH và MaSP
@router.get("/{makh}/{masp}")
def get_chon(makh: str, masp: str):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("SELECT * FROM Chon WHERE MaKH = %s AND MaSP = %s", (makh, masp))
        result = cursor.fetchone()
    conn.close()
    if not result:
        raise HTTPException(status_code=404, detail="Không tìm thấy lựa chọn này")
    return result

# 3. Thêm mới một lựa chọn
@router.post("/")
def create_chon(data: dict):
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute(
                "INSERT INTO Chon (MaKH, MaSP) VALUES (%s, %s)",
                (data["MaKH"], data["MaSP"])
            )
            conn.commit()
        conn.close()
        return {"message": "Đã thêm lựa chọn thành công"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 4. Xoá lựa chọn
@router.delete("/{makh}/{masp}")
def delete_chon(makh: str, masp: str):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("DELETE FROM Chon WHERE MaKH = %s AND MaSP = %s", (makh, masp))
        conn.commit()
    conn.close()
    return {"message": "Đã xoá lựa chọn"}
