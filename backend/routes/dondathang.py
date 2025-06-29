from fastapi import APIRouter, HTTPException
from db import get_connection

router = APIRouter(prefix="/dondathang", tags=["DonDatHang"])

# 1. Lấy tất cả đơn đặt hàng
@router.get("/")
def get_all_dondathang():
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("SELECT * FROM DonDatHang")
        result = cursor.fetchall()
    conn.close()
    return result

# 2. Lấy đơn đặt hàng theo mã
@router.get("/{madon}")
def get_dondathang(madon: str):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("SELECT * FROM DonDatHang WHERE MaDon = %s", (madon,))
        result = cursor.fetchone()
    conn.close()
    if not result:
        raise HTTPException(status_code=404, detail="Không tìm thấy đơn đặt hàng")
    return result

# 3. Thêm đơn đặt hàng
@router.post("/")
def create_dondathang(don: dict):
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            sql = """
                INSERT INTO DonDatHang (MaDon, TrangThai, NgayDatHang, TongTien, MaKH)
                VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(sql, (
                don["MaDon"],
                don["TrangThai"],
                don["NgayDatHang"],
                don["TongTien"],
                don["MaKH"]
            ))
            conn.commit()
        conn.close()
        return {"message": "Thêm đơn đặt hàng thành công"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 4. Xoá đơn đặt hàng
@router.delete("/{madon}")
def delete_dondathang(madon: str):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("DELETE FROM DonDatHang WHERE MaDon = %s", (madon,))
        conn.commit()
    conn.close()
    return {"message": "Đã xoá đơn đặt hàng"}
