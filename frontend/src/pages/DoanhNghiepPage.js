import React, { useState, useEffect } from 'react';
import { doanhNghiepAPI } from '../services/api';

const DoanhNghiepPage = () => {
  const [doanhnghiep, setDoanhNghiep] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    MaKH: '',
    TenDN: '',
    DiaChi: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await doanhNghiepAPI.getAll();
      setDoanhNghiep(data);
    } catch (error) {
      alert('Lỗi kết nối API');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await doanhNghiepAPI.create(formData);
      alert('Thêm doanh nghiệp thành công!');
      setShowForm(false);
      setFormData({ MaKH: '', TenDN: '', DiaChi: '' });
      loadData();
    } catch (error) {
      alert('Lỗi khi thêm doanh nghiệp');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa?')) {
      try {
        await doanhNghiepAPI.delete(id);
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
      <h2>Quản lý Doanh Nghiệp</h2>
      
      {!showForm ? (
        <button className="btn-add" onClick={() => setShowForm(true)}>
          + Thêm doanh nghiệp mới
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
            <label>Tên doanh nghiệp:</label>
            <input
              type="text"
              name="TenDN"
              value={formData.TenDN}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Địa chỉ:</label>
            <input
              type="text"
              name="DiaChi"
              value={formData.DiaChi}
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
              <th>Mã KH</th>
              <th>Tên DN</th>
              <th>Địa chỉ</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {doanhnghiep.map((dn) => (
              <tr key={dn.MaKH}>
                <td>{dn.MaKH}</td>
                <td>{dn.TenDN}</td>
                <td>{dn.DiaChi}</td>
                <td>
                  <button className="btn-edit">Sửa</button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(dn.MaKH)}
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

export default DoanhNghiepPage; 