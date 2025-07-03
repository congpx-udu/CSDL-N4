import React, { useState, useEffect } from 'react';
import { tiepNhanAPI } from '../services/api';

const TiepNhanPage = () => {
  const [tiepnhan, setTiepNhan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    MaPN: '',
    MaSP: '',
    SoLuong: '',
    DonGia: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await tiepNhanAPI.getAll();
      setTiepNhan(data);
    } catch (error) {
      alert('Lỗi kết nối API');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await tiepNhanAPI.create(formData);
      alert('Thêm tiếp nhận thành công!');
      setShowForm(false);
      setFormData({ MaPN: '', MaSP: '', SoLuong: '', DonGia: '' });
      loadData();
    } catch (error) {
      alert('Lỗi khi thêm tiếp nhận');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa?')) {
      try {
        await tiepNhanAPI.delete(id);
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
      <h2>Quản lý Tiếp Nhận</h2>
      
      {!showForm ? (
        <button className="btn-add" onClick={() => setShowForm(true)}>
          + Thêm tiếp nhận mới
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Mã phiếu nhập:</label>
            <input
              type="text"
              name="MaPN"
              value={formData.MaPN}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Mã sản phẩm:</label>
            <input
              type="text"
              name="MaSP"
              value={formData.MaSP}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Số lượng:</label>
            <input
              type="number"
              name="SoLuong"
              value={formData.SoLuong}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Đơn giá:</label>
            <input
              type="number"
              name="DonGia"
              value={formData.DonGia}
              onChange={handleInputChange}
              required
            />
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
              <th>Mã PN</th>
              <th>Mã SP</th>
              <th>Số lượng</th>
              <th>Đơn giá</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {tiepnhan.map((tn) => (
              <tr key={`${tn.MaPN}-${tn.MaSP}`}>
                <td>{tn.MaPN}</td>
                <td>{tn.MaSP}</td>
                <td>{tn.SoLuong}</td>
                <td>{tn.DonGia?.toLocaleString()}đ</td>
                <td>
                  <button className="btn-edit">Sửa</button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(`${tn.MaPN}-${tn.MaSP}`)}
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

export default TiepNhanPage; 