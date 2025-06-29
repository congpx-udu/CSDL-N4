import React, { useState } from 'react';
import './App.css';
import Dashboard from './pages/Dashboard';
import KhoHangPage from './pages/KhoHangPage';
import SanPhamPage from './pages/SanPhamPage';
import KhachHangPage from './pages/KhachHangPage';
import DonHangPage from './pages/DonHangPage';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'khohang':
        return <KhoHangPage />;
      case 'sanpham':
        return <SanPhamPage />;
      case 'khachhang':
        return <KhachHangPage />;
      case 'dondathang':
        return <DonHangPage />;
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
            Dashboard
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
        </nav>
      </div>
      <div className="main-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
