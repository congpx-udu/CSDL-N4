import React, { useState, useEffect } from 'react';
import { khachHangAPI } from '../services/api';

const KhachHangPage = () => {
  const [khachhang, setKhachhang] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    MaKH: '',
    TenKH: '',
    DiaChi: '',
    Email: '',
    SoDienThoai: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await khachHangAPI.getAll();
      setKhachhang(data);
    } catch (error) {
      alert('Lỗi kết nối API');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await khachHangAPI.create(formData);
      alert('Thêm khách hàng thành công!');
      setFormData({ MaKH: '', TenKH: '', DiaChi: '', Email: '', SoDienThoai: '' });
      setShowForm(false);
      loadData();
    } catch (error) {
      alert('Lỗi khi thêm khách hàng');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa?')) {
      try {
        await khachHangAPI.delete(id);
        alert('Xóa thành công!');
        loadData();
      } catch (error) {
        alert('Lỗi khi xóa');
      }
    }
  };

  return (
    <div className="content">
      <h2>Quản lý Khách hàng</h2>
      
      {!showForm ? (
        <button className="btn-add" onClick={() => setShowForm(true)}>
          + Thêm khách hàng mới
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="add-form">
          <h3>Thêm khách hàng mới</h3>
          <input
            type="text"
            placeholder="Mã khách hàng"
            value={formData.MaKH}
            onChange={(e) => setFormData({...formData, MaKH: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Tên khách hàng"
            value={formData.TenKH}
            onChange={(e) => setFormData({...formData, TenKH: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Địa chỉ"
            value={formData.DiaChi}
            onChange={(e) => setFormData({...formData, DiaChi: e.target.value})}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.Email}
            onChange={(e) => setFormData({...formData, Email: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Số điện thoại"
            value={formData.SoDienThoai}
            onChange={(e) => setFormData({...formData, SoDienThoai: e.target.value})}
            required
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn-add">Thêm khách hàng</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-cancel">
              Hủy
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="loading">Đang tải dữ liệu...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã KH</th>
              <th>Tên khách hàng</th>
              <th>Địa chỉ</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {khachhang.map((kh) => (
              <tr key={kh.MaKH}>
                <td>{kh.MaKH}</td>
                <td>{kh.TenKH}</td>
                <td>{kh.DiaChi}</td>
                <td>{kh.Email}</td>
                <td>{kh.SoDienThoai}</td>
                <td>
                  <button className="btn-edit">Sửa</button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(kh.MaKH)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default KhachHangPage; 