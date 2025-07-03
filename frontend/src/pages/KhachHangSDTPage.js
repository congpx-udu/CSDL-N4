import React, { useState, useEffect } from 'react';
import { khachHangSDTAPI } from '../services/api';

const KhachHangSDTPage = () => {
  const [khachhangsdt, setKhachHangSDT] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    MaKH: '',
    SoDienThoai: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await khachHangSDTAPI.getAll();
      setKhachHangSDT(data);
    } catch (error) {
      alert('Lỗi kết nối API');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await khachHangSDTAPI.create(formData);
      alert('Thêm số điện thoại khách hàng thành công!');
      setShowForm(false);
      setFormData({ MaKH: '', SoDienThoai: '' });
      loadData();
    } catch (error) {
      alert('Lỗi khi thêm số điện thoại khách hàng');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa?')) {
      try {
        await khachHangSDTAPI.delete(id);
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
      <h2>Quản lý Số Điện Thoại Khách Hàng</h2>
      
      {!showForm ? (
        <button className="btn-add" onClick={() => setShowForm(true)}>
          + Thêm số điện thoại mới
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
              <th>Mã KH</th>
              <th>Số điện thoại</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {khachhangsdt.map((khsdt) => (
              <tr key={`${khsdt.MaKH}-${khsdt.SoDienThoai}`}>
                <td>{khsdt.MaKH}</td>
                <td>{khsdt.SoDienThoai}</td>
                <td>
                  <button className="btn-edit">Sửa</button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(`${khsdt.MaKH}-${khsdt.SoDienThoai}`)}
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

export default KhachHangSDTPage; 