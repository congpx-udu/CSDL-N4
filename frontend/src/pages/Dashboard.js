import React, { useState, useEffect } from 'react';
import { khoHangAPI, sanPhamAPI, khachHangAPI, donHangAPI } from '../services/api';

const Dashboard = () => {
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

  return (
    <div className="content">
      <h2>Dashboard</h2>
      <div className="stats">
        <div className="stat-card">
          <h3>{stats.khohang}</h3>
          <p>Kho hàng</p>
        </div>
        <div className="stat-card">
          <h3>{stats.sanpham}</h3>
          <p>Sản phẩm</p>
        </div>
        <div className="stat-card">
          <h3>{stats.khachhang}</h3>
          <p>Khách hàng</p>
        </div>
        <div className="stat-card">
          <h3>{stats.dondathang}</h3>
          <p>Đơn hàng</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 