import React, { useState, useEffect } from 'react';
import { thuocVeAPI } from '../services/api';

const ThuocVePage = () => {
  const [thuocve, setThuocVe] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    MaSP: '',
    MaKho: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await thuocVeAPI.getAll();
      setThuocVe(data);
    } catch (error) {
      alert('Lỗi kết nối API');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await thuocVeAPI.create(formData);
      alert('Thêm thuộc về thành công!');
      setShowForm(false);
      setFormData({ MaSP: '', MaKho: '' });
      loadData();
    } catch (error) {
      alert('Lỗi khi thêm thuộc về');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa?')) {
      try {
        await thuocVeAPI.delete(id);
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
      <h2>Quản lý Thuộc Về</h2>
      
      {!showForm ? (
        <button className="btn-add" onClick={() => setShowForm(true)}>
          + Thêm thuộc về mới
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="form">
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
            <label>Mã kho:</label>
            <input
              type="text"
              name="MaKho"
              value={formData.MaKho}
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
              <th>Mã SP</th>
              <th>Mã kho</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {thuocve.map((tv) => (
              <tr key={`${tv.MaSP}-${tv.MaKho}`}>
                <td>{tv.MaSP}</td>
                <td>{tv.MaKho}</td>
                <td>
                  <button className="btn-edit">Sửa</button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(`${tv.MaSP}-${tv.MaKho}`)}
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

export default ThuocVePage; 