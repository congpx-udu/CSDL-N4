import React, { useState, useEffect } from 'react';
import { khoHangAPI, sanPhamAPI, khachHangAPI, donHangAPI } from '../services/api';

const Dashboard = ({ onNavigate }) => {
  const [stats, setStats] = useState({
    khohang: 0,
    sanpham: 0,
    khachhang: 0,
    dondathang: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [khohang, sanpham, khachhang, dondathang] = await Promise.all([
          khoHangAPI.getAll(),
          sanPhamAPI.getAll(),
          khachHangAPI.getAll(),
          donHangAPI.getAll()
        ]);

        setStats({
          khohang: khohang.length,
          sanpham: sanpham.length,
          khachhang: khachhang.length,
          dondathang: dondathang.length
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };

    loadStats();
  }, []);

  const cards = [
    { label: 'Kho hàng', value: stats.khohang, tab: 'khohang' },
    { label: 'Sản phẩm', value: stats.sanpham, tab: 'sanpham' },
    { label: 'Khách hàng', value: stats.khachhang, tab: 'khachhang' },
    { label: 'Đơn hàng', value: stats.dondathang, tab: 'dondathang' }
  ];

  return (
    <div className="content">
      <h2 style={{marginBottom: 32}}>Trang chủ</h2>
      <div className="dashboard-grid">
        {cards.map((card) => (
          <div
            className="dashboard-card"
            key={card.label}
            onClick={() => onNavigate(card.tab)}
            tabIndex={0}
            style={{cursor: 'pointer'}}
          >
            <div className="dashboard-value">{card.value}</div>
            <div className="dashboard-label">{card.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard; 