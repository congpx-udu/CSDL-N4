import React, { useState, useEffect } from 'react';
import { chonAPI } from '../services/api';

const ChonPage = () => {
  const [chon, setChon] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    MaPX: '',
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
      const data = await chonAPI.getAll();
      setChon(data);
    } catch (error) {
      alert('Lỗi kết nối API');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await chonAPI.create(formData);
      alert('Thêm chọn thành công!');
      setShowForm(false);
      setFormData({ MaPX: '', MaSP: '', SoLuong: '', DonGia: '' });
      loadData();
    } catch (error) {
      alert('Lỗi khi thêm chọn');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa?')) {
      try {
        await chonAPI.delete(id);
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
      <h2>Quản lý Chọn</h2>
      
      {!showForm ? (
        <button className="btn-add" onClick={() => setShowForm(true)}>
          + Thêm chọn mới
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Mã phiếu xuất:</label>
            <input
              type="text"
              name="MaPX"
              value={formData.MaPX}
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
              <th>Mã PX</th>
              <th>Mã SP</th>
              <th>Số lượng</th>
              <th>Đơn giá</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {chon.map((c) => (
              <tr key={`${c.MaPX}-${c.MaSP}`}>
                <td>{c.MaPX}</td>
                <td>{c.MaSP}</td>
                <td>{c.SoLuong}</td>
                <td>{c.DonGia?.toLocaleString()}đ</td>
                <td>
                  <button className="btn-edit">Sửa</button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(`${c.MaPX}-${c.MaSP}`)}
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

export default ChonPage; 