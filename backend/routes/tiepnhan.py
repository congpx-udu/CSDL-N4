from fastapi import APIRouter, HTTPException
from db import get_connection

router = APIRouter(prefix="/tiepnhan", tags=["TiepNhan"])

# 1. Lấy tất cả dòng từ TiepNhan
@router.get("/")
def get_all_tiepnhan():
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("SELECT * FROM TiepNhan")
        result = cursor.fetchall()
    conn.close()
    return result

# 2. Lấy theo mã lô và mã sản phẩm
@router.get("/{malo}/{masp}")
def get_tiepnhan(malo: str, masp: str):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute(
            "SELECT * FROM TiepNhan WHERE MaLo = %s AND MaSP = %s",
            (malo, masp)
        )
        result = cursor.fetchone()
    conn.close()
    if not result:
        raise HTTPException(status_code=404, detail="Không tìm thấy dòng liên kết này")
    return result

# 3. Thêm dòng vào TiepNhan
@router.post("/")
def create_tiepnhan(data: dict):
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            sql = "INSERT INTO TiepNhan (MaLo, MaSP) VALUES (%s, %s)"
            cursor.execute(sql, (data["MaLo"], data["MaSP"]))
            conn.commit()
        conn.close()
        return {"message": "Thêm liên kết thành công"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 4. Xoá dòng khỏi TiepNhan
@router.delete("/{malo}/{masp}")
def delete_tiepnhan(malo: str, masp: str):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute(
            "DELETE FROM TiepNhan WHERE MaLo = %s AND MaSP = %s",
            (malo, masp)
        )
        conn.commit()
    conn.close()
    return {"message": "Xoá liên kết thành công"}
