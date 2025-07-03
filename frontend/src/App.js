import React, { useState } from 'react';
import './App.css';
import Dashboard from './pages/Dashboard';
import KhoHangPage from './pages/KhoHangPage';
import SanPhamPage from './pages/SanPhamPage';
import KhachHangPage from './pages/KhachHangPage';
import DonHangPage from './pages/DonHangPage';
import NhaCungCapPage from './pages/NhaCungCapPage';
import LoSanPhamPage from './pages/LoSanPhamPage';
import PhieuNhapPage from './pages/PhieuNhapPage';
import PhieuXuatPage from './pages/PhieuXuatPage';
import ChonSanPhamPage from './pages/ChonSanPhamPage';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveTab} />;
      case 'khohang':
        return <KhoHangPage />;
      case 'sanpham':
        return <SanPhamPage />;
      case 'khachhang':
        return <KhachHangPage />;
      case 'dondathang':
        return <DonHangPage />;
      case 'nhacungcap':
        return <NhaCungCapPage />;
      case 'losanpham':
        return <LoSanPhamPage />;
      case 'phieunhap':
        return <PhieuNhapPage />;
      case 'phieuxuat':
        return <PhieuXuatPage />;
      case 'chonsanpham':
        return <ChonSanPhamPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="App">
      <div className="sidebar">
        <h2>Quản Lý Kho</h2>
        <nav>
          <button 
            className={activeTab === 'dashboard' ? 'active' : ''} 
            onClick={() => setActiveTab('dashboard')}
          >
            Trang chủ
          </button>
          <button 
            className={activeTab === 'khohang' ? 'active' : ''} 
            onClick={() => setActiveTab('khohang')}
          >
            Kho Hàng
          </button>
          <button 
            className={activeTab === 'sanpham' ? 'active' : ''} 
            onClick={() => setActiveTab('sanpham')}
          >
            Sản Phẩm
          </button>
          <button 
            className={activeTab === 'khachhang' ? 'active' : ''} 
            onClick={() => setActiveTab('khachhang')}
          >
            Khách Hàng
          </button>
          <button 
            className={activeTab === 'dondathang' ? 'active' : ''} 
            onClick={() => setActiveTab('dondathang')}
          >
            Đơn Hàng
          </button>
          <button 
            className={activeTab === 'nhacungcap' ? 'active' : ''} 
            onClick={() => setActiveTab('nhacungcap')}
          >
            Nhà Cung Cấp
          </button>
          <button 
            className={activeTab === 'losanpham' ? 'active' : ''} 
            onClick={() => setActiveTab('losanpham')}
          >
            Lô Sản Phẩm
          </button>
          <button 
            className={activeTab === 'phieunhap' ? 'active' : ''} 
            onClick={() => setActiveTab('phieunhap')}
          >
            Phiếu Nhập
          </button>
          <button 
            className={activeTab === 'phieuxuat' ? 'active' : ''} 
            onClick={() => setActiveTab('phieuxuat')}
          >
            Phiếu Xuất
          </button>
          <button 
            className={activeTab === 'chonsanpham' ? 'active' : ''} 
            onClick={() => setActiveTab('chonsanpham')}
          >
            Chọn Sản Phẩm
          </button>
        </nav>
      </div>
      <div className="main-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
