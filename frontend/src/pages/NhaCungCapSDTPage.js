import React, { useState, useEffect } from 'react';
import { nhaCungCapSDTAPI } from '../services/api';

const NhaCungCapSDTPage = () => {
  const [nhacungcapsdt, setNhaCungCapSDT] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    MaNCC: '',
    SoDienThoai: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await nhaCungCapSDTAPI.getAll();
      setNhaCungCapSDT(data);
    } catch (error) {
      alert('Lỗi kết nối API');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await nhaCungCapSDTAPI.create(formData);
      alert('Thêm số điện thoại nhà cung cấp thành công!');
      setShowForm(false);
      setFormData({ MaNCC: '', SoDienThoai: '' });
      loadData();
    } catch (error) {
      alert('Lỗi khi thêm số điện thoại nhà cung cấp');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa?')) {
      try {
        await nhaCungCapSDTAPI.delete(id);
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
      <h2>Quản lý Số Điện Thoại Nhà Cung Cấp</h2>
      
      {!showForm ? (
        <button className="btn-add" onClick={() => setShowForm(true)}>
          + Thêm số điện thoại mới
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Mã nhà cung cấp:</label>
            <input
              type="text"
              name="MaNCC"
              value={formData.MaNCC}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Số điện thoại:</label>
            <input
              type="tel"
              name="SoDienThoai"
              value={formData.SoDienThoai}
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
              <th>Mã NCC</th>
              <th>Số điện thoại</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {nhacungcapsdt.map((nccsdt) => (
              <tr key={`${nccsdt.MaNCC}-${nccsdt.SoDienThoai}`}>
                <td>{nccsdt.MaNCC}</td>
                <td>{nccsdt.SoDienThoai}</td>
                <td>
                  <button className="btn-edit">Sửa</button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(`${nccsdt.MaNCC}-${nccsdt.SoDienThoai}`)}
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

export default NhaCungCapSDTPage; 