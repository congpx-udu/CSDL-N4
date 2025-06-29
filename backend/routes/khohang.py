from fastapi import APIRouter, HTTPException
from db import get_connection

router = APIRouter(prefix="/khohang", tags=["KhoHang"])

# 1. Lấy toàn bộ kho
@router.get("/")
def get_all_khohang():
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("SELECT * FROM KhoHang")
        result = cursor.fetchall()
    conn.close()
    return result

# 2. Lấy 1 kho theo mã
@router.get("/{makho}")
def get_kho(makho: str):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("SELECT * FROM KhoHang WHERE MaKho = %s", (makho,))
        result = cursor.fetchone()
    conn.close()
    if not result:
        raise HTTPException(status_code=404, detail="Kho không tồn tại")
    return result

# 3. Tạo mới một kho
@router.post("/")
def create_khohang(kho: dict):
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            sql = """
                INSERT INTO KhoHang (MaKho, TenKho, NguoiQuanLy, DiaChiKho, SucChua)
                VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(sql, (
                kho["MaKho"],
                kho["TenKho"],
                kho["NguoiQuanLy"],
                kho["DiaChiKho"],
                kho["SucChua"]
            ))
            conn.commit()
        conn.close()
        return {"message": "Thêm kho thành công"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 4. Xoá kho
@router.delete("/{makho}")
def delete_khohang(makho: str):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("DELETE FROM KhoHang WHERE MaKho = %s", (makho,))
        conn.commit()
    conn.close()
    return {"message": "Xoá kho thành công"}
