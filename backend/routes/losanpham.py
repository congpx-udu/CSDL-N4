from fastapi import APIRouter, HTTPException
from db import get_connection

router = APIRouter(prefix="/losanpham", tags=["LoSanPham"])

# 1. Lấy tất cả lô sản phẩm
@router.get("/")
def get_all_losanpham():
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("SELECT * FROM LoSanPham")
        result = cursor.fetchall()
    conn.close()
    return result

# 2. Lấy 1 lô sản phẩm theo mã
@router.get("/{malo}")
def get_losanpham(malo: str):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("SELECT * FROM LoSanPham WHERE MaLo = %s", (malo,))
        result = cursor.fetchone()
    conn.close()
    if not result:
        raise HTTPException(status_code=404, detail="Không tìm thấy lô sản phẩm")
    return result

# 3. Tạo mới một lô sản phẩm
@router.post("/")
def create_losanpham(lo: dict):
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            sql = """
                INSERT INTO LoSanPham (MaLo, NgaySanXuat, HanSuDung, SoLuong, MaPN, MaNCC)
                VALUES (%s, %s, %s, %s, %s, %s)
            """
            cursor.execute(sql, (
                lo["MaLo"],
                lo["NgaySanXuat"],
                lo["HanSuDung"],
                lo["SoLuong"],
                lo["MaPN"],
                lo["MaNCC"]
            ))
            conn.commit()
        conn.close()
        return {"message": "Thêm lô sản phẩm thành công"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 4. Xoá một lô sản phẩm
@router.delete("/{malo}")
def delete_losanpham(malo: str):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("DELETE FROM LoSanPham WHERE MaLo = %s", (malo,))
        conn.commit()
    conn.close()
    return {"message": "Đã xoá lô sản phẩm"}
