from fastapi import APIRouter, HTTPException
from db import get_connection

router = APIRouter(prefix="/doanhnghiep", tags=["DoanhNghiep"])

@router.get("/")
def get_all_doanhnghiep():
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("SELECT * FROM DoanhNghiep")
        result = cursor.fetchall()
    conn.close()
    return result

@router.get("/{makh}")
def get_doanhnghiep(makh: str):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("SELECT * FROM DoanhNghiep WHERE MaKH = %s", (makh,))
        result = cursor.fetchone()
    conn.close()
    if not result:
        raise HTTPException(status_code=404, detail="Không tìm thấy doanh nghiệp")
    return result

@router.post("/")
def create_doanhnghiep(data: dict):
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute("""
                INSERT INTO DoanhNghiep (MaKH, MaDoanhNghiep, LoaiHinhKinhDoanh, Ten, QuyMo)
                VALUES (%s, %s, %s, %s, %s)
            """, (
                data["MaKH"], data["MaDoanhNghiep"],
                data["LoaiHinhKinhDoanh"], data["Ten"], data["QuyMo"]
            ))
            conn.commit()
        conn.close()
        return {"message": "Đã thêm doanh nghiệp"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{makh}")
def delete_doanhnghiep(makh: str):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("DELETE FROM DoanhNghiep WHERE MaKH = %s", (makh,))
        conn.commit()
    conn.close()
    return {"message": "Đã xoá doanh nghiệp"}
