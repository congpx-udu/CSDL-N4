from fastapi import APIRouter, HTTPException
from db import get_connection

router = APIRouter(prefix="/canhan", tags=["CaNhan"])

@router.get("/")
def get_all_canhan():
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("SELECT * FROM CaNhan")
        result = cursor.fetchall()
    conn.close()
    return result

@router.get("/{makh}")
def get_canhan(makh: str):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("SELECT * FROM CaNhan WHERE MaKH = %s", (makh,))
        result = cursor.fetchone()
    conn.close()
    if not result:
        raise HTTPException(status_code=404, detail="Không tìm thấy khách hàng cá nhân")
    return result

@router.post("/")
def create_canhan(data: dict):
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute("""
                INSERT INTO CaNhan (MaKH, MaCaNhan, Ten)
                VALUES (%s, %s, %s)
            """, (data["MaKH"], data["MaCaNhan"], data["Ten"]))
            conn.commit()
        conn.close()
        return {"message": "Đã thêm khách hàng cá nhân"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{makh}")
def delete_canhan(makh: str):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("DELETE FROM CaNhan WHERE MaKH = %s", (makh,))
        conn.commit()
    conn.close()
    return {"message": "Đã xoá khách hàng cá nhân"}
