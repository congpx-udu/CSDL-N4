from fastapi import APIRouter, HTTPException
from db import get_connection

router = APIRouter(prefix="/nhacungcap", tags=["NhaCungCap"])

# 1. Lấy tất cả nhà cung cấp
@router.get("/")
def get_all_ncc():
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("SELECT * FROM NhaCungCap")
        result = cursor.fetchall()
    conn.close()
    return result

# 2. Lấy 1 nhà cung cấp theo mã
@router.get("/{mancc}")
def get_ncc(mancc: str):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("SELECT * FROM NhaCungCap WHERE MaNCC = %s", (mancc,))
        result = cursor.fetchone()
    conn.close()
    if not result:
        raise HTTPException(status_code=404, detail="Không tìm thấy nhà cung cấp")
    return result

# 3. Thêm nhà cung cấp mới
@router.post("/")
def create_ncc(ncc: dict):
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            sql = """
                INSERT INTO NhaCungCap (MaNCC, TenNCC, DiaChi, Email)
                VALUES (%s, %s, %s, %s)
            """
            cursor.execute(sql, (
                ncc["MaNCC"],
                ncc["TenNCC"],
                ncc["DiaChi"],
                ncc["Email"]
            ))
            conn.commit()
        conn.close()
        return {"message": "Thêm nhà cung cấp thành công"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 4. Xoá nhà cung cấp
@router.delete("/{mancc}")
def delete_ncc(mancc: str):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("DELETE FROM NhaCungCap WHERE MaNCC = %s", (mancc,))
        conn.commit()
    conn.close()
    return {"message": "Xoá nhà cung cấp thành công"}
