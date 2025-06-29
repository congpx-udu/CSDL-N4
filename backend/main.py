from fastapi import FastAPI
from routes import (
    khohang, sanpham, losanpham, nhacungcap,
    phieunhap, phieuxuat, khachhang, dondathang,
    tiepnhan, chon, thuocve, canhan, doanhnghiep,
    khachhang_sdt, nhacungcap_sdt
)
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.include_router(khohang.router)
app.include_router(sanpham.router)
app.include_router(losanpham.router)
app.include_router(nhacungcap.router)
app.include_router(nhacungcap_sdt.router)
app.include_router(phieunhap.router)
app.include_router(phieuxuat.router)
app.include_router(khachhang.router)
app.include_router(khachhang_sdt.router)
app.include_router(dondathang.router)
app.include_router(tiepnhan.router)
app.include_router(chon.router)
app.include_router(thuocve.router)
app.include_router(canhan.router)
app.include_router(doanhnghiep.router)


# Cho phép frontend truy cập (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
