import React, { useState, useEffect } from 'react';
import { khoHangAPI } from '../services/api';

const KhoHangPage = () => {
  const [khohang, setKhohang] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    MaKho: '',
    TenKho: '',
    NguoiQuanLy: '',
    DiaChiKho: '',
    SucChua: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await khoHangAPI.getAll();
      setKhohang(data);
    } catch (error) {
      alert('Lỗi kết nối API');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await khoHangAPI.create(formData);
      alert('Thêm kho thành công!');
      setFormData({ MaKho: '', TenKho: '', NguoiQuanLy: '', DiaChiKho: '', SucChua: '' });
      setShowForm(false);
      loadData();
    } catch (error) {
      alert('Lỗi khi thêm kho');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa?')) {
      try {
        await khoHangAPI.delete(id);
        alert('Xóa thành công!');
        loadData();
      } catch (error) {
        alert('Lỗi khi xóa');
      }
    }
  };

  return (
    <div className="content">
      <h2>Quản lý Kho hàng</h2>
      
      {!showForm ? (
        <button className="btn-add" onClick={() => setShowForm(true)}>
          + Thêm kho mới
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="add-form">
          <h3>Thêm kho mới</h3>
          <input
            type="text"
            placeholder="Mã kho"
            value={formData.MaKho}
            onChange={(e) => setFormData({...formData, MaKho: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Tên kho"
            value={formData.TenKho}
            onChange={(e) => setFormData({...formData, TenKho: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Người quản lý"
            value={formData.NguoiQuanLy}
            onChange={(e) => setFormData({...formData, NguoiQuanLy: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Địa chỉ"
            value={formData.DiaChiKho}
            onChange={(e) => setFormData({...formData, DiaChiKho: e.target.value})}
            required
          />
          <input
            type="number"
            placeholder="Sức chứa"
            value={formData.SucChua}
            onChange={(e) => setFormData({...formData, SucChua: e.target.value})}
            required
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn-add">Thêm kho</button>
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
              <th>Mã kho</th>
              <th>Tên kho</th>
              <th>Người quản lý</th>
              <th>Địa chỉ</th>
              <th>Sức chứa</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {khohang.map((kho) => (
              <tr key={kho.MaKho}>
                <td>{kho.MaKho}</td>
                <td>{kho.TenKho}</td>
                <td>{kho.NguoiQuanLy}</td>
                <td>{kho.DiaChiKho}</td>
                <td>{kho.SucChua}</td>
                <td>
                  <button className="btn-edit">Sửa</button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(kho.MaKho)}
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

export default KhoHangPage; 