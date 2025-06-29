from fastapi import APIRouter, HTTPException
from db import get_connection

router = APIRouter(prefix="/sanpham", tags=["SanPham"])

# 1. Lấy toàn bộ sản phẩm
@router.get("/")
def get_all_sanpham():
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("SELECT * FROM SanPham")
        result = cursor.fetchall()
    conn.close()
    return result

# 2. Lấy sản phẩm theo mã
@router.get("/{masp}")
def get_sanpham(masp: str):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("SELECT * FROM SanPham WHERE MaSP = %s", (masp,))
        result = cursor.fetchone()
    conn.close()
    if not result:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")
    return result

# 3. Thêm sản phẩm
@router.post("/")
def create_sanpham(sp: dict):
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            sql = """
                INSERT INTO SanPham (MaSP, TenSP, MoTa, LoaiSP, GiaBan, DonViTinh, MaKho)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(sql, (
                sp["MaSP"],
                sp["TenSP"],
                sp["MoTa"],
                sp["LoaiSP"],
                sp["GiaBan"],
                sp["DonViTinh"],
                sp["MaKho"]
            ))
            conn.commit()
        conn.close()
        return {"message": "Thêm sản phẩm thành công"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 4. Cập nhật sản phẩm
@router.put("/{masp}")
def update_sanpham(masp: str, sp: dict):
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            sql = """
                UPDATE SanPham 
                SET TenSP = %s, MoTa = %s, LoaiSP = %s, GiaBan = %s, DonViTinh = %s, MaKho = %s
                WHERE MaSP = %s
            """
            cursor.execute(sql, (
                sp["TenSP"],
                sp["MoTa"],
                sp["LoaiSP"],
                sp["GiaBan"],
                sp["DonViTinh"],
                sp["MaKho"],
                masp
            ))
            conn.commit()
        conn.close()
        return {"message": "Cập nhật sản phẩm thành công"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 5. Xoá sản phẩm
@router.delete("/{masp}")
def delete_sanpham(masp: str):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("DELETE FROM SanPham WHERE MaSP = %s", (masp,))
        conn.commit()
    conn.close()
    return {"message": "Xoá sản phẩm thành công"}
