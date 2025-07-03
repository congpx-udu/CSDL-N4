import React, { useState, useEffect } from 'react';
import { khoHangAPI } from '../services/api';

const KhoHangPage = () => {
  const [khohang, setKhohang] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingKho, setEditingKho] = useState(null);
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

  const handleEdit = (kho) => {
    setEditingKho(kho);
    setFormData({
      MaKho: kho.MaKho,
      TenKho: kho.TenKho,
      NguoiQuanLy: kho.NguoiQuanLy,
      DiaChiKho: kho.DiaChiKho,
      SucChua: kho.SucChua
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingKho) {
        await khoHangAPI.update(editingKho.MaKho, formData);
        alert('Cập nhật kho thành công!');
      } else {
        await khoHangAPI.create(formData);
        alert('Thêm kho thành công!');
      }
      setFormData({ MaKho: '', TenKho: '', NguoiQuanLy: '', DiaChiKho: '', SucChua: '' });
      setShowForm(false);
      setEditingKho(null);
      loadData();
    } catch (error) {
      alert('Lỗi khi thao tác với kho');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingKho(null);
    setFormData({ MaKho: '', TenKho: '', NguoiQuanLy: '', DiaChiKho: '', SucChua: '' });
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
        <form onSubmit={handleSubmit} className="form">
          <h3>{editingKho ? 'Chỉnh sửa kho' : 'Thêm kho mới'}</h3>
          <div className="form-group">
            <label>Mã kho:</label>
            <input
              type="text"
              placeholder="Mã kho"
              value={formData.MaKho}
              onChange={(e) => setFormData({...formData, MaKho: e.target.value})}
              required
              disabled={editingKho}
            />
          </div>
          <div className="form-group">
            <label>Tên kho:</label>
            <input
              type="text"
              placeholder="Tên kho"
              value={formData.TenKho}
              onChange={(e) => setFormData({...formData, TenKho: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Người quản lý:</label>
            <input
              type="text"
              placeholder="Người quản lý"
              value={formData.NguoiQuanLy}
              onChange={(e) => setFormData({...formData, NguoiQuanLy: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Địa chỉ:</label>
            <input
              type="text"
              placeholder="Địa chỉ"
              value={formData.DiaChiKho}
              onChange={(e) => setFormData({...formData, DiaChiKho: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Sức chứa:</label>
            <input
              type="number"
              placeholder="Sức chứa"
              value={formData.SucChua}
              onChange={(e) => setFormData({...formData, SucChua: e.target.value})}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-save">
              {editingKho ? 'Cập nhật kho' : 'Thêm kho'}
            </button>
            <button type="button" onClick={handleCancel} className="btn-cancel">
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
                  <button 
                    className="btn-edit"
                    onClick={() => handleEdit(kho)}
                  >
                    Sửa
                  </button>
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