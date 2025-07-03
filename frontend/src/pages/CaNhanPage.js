import React, { useState, useEffect } from 'react';
import { caNhanAPI } from '../services/api';

const CaNhanPage = () => {
  const [canhan, setCaNhan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    MaKH: '',
    HoTen: '',
    NgaySinh: '',
    GioiTinh: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await caNhanAPI.getAll();
      setCaNhan(data);
    } catch (error) {
      alert('Lỗi kết nối API');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await caNhanAPI.create(formData);
      alert('Thêm cá nhân thành công!');
      setShowForm(false);
      setFormData({ MaKH: '', HoTen: '', NgaySinh: '', GioiTinh: '' });
      loadData();
    } catch (error) {
      alert('Lỗi khi thêm cá nhân');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa?')) {
      try {
        await caNhanAPI.delete(id);
        alert('Xóa thành công!');
        loadData();
      } catch (error) {
        alert('Lỗi khi xóa');
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="content">
      <h2>Quản lý Cá Nhân</h2>
      
      {!showForm ? (
        <button className="btn-add" onClick={() => setShowForm(true)}>
          + Thêm cá nhân mới
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Mã khách hàng:</label>
            <input
              type="text"
              name="MaKH"
              value={formData.MaKH}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Họ tên:</label>
            <input
              type="text"
              name="HoTen"
              value={formData.HoTen}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Ngày sinh:</label>
            <input
              type="date"
              name="NgaySinh"
              value={formData.NgaySinh}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Giới tính:</label>
            <select
              name="GioiTinh"
              value={formData.GioiTinh}
              onChange={handleInputChange}
              required
            >
              <option value="">Chọn giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-save">Lưu</button>
            <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>
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
              <th>Họ tên</th>
              <th>Ngày sinh</th>
              <th>Giới tính</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {canhan.map((cn) => (
              <tr key={cn.MaKH}>
                <td>{cn.MaKH}</td>
                <td>{cn.HoTen}</td>
                <td>{cn.NgaySinh}</td>
                <td>{cn.GioiTinh}</td>
                <td>
                  <button className="btn-edit">Sửa</button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(cn.MaKH)}
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

export default CaNhanPage; 