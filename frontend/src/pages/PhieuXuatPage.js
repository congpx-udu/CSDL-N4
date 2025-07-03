import React, { useState, useEffect } from 'react';
import { phieuXuatAPI, khoHangAPI } from '../services/api';

const PhieuXuatPage = () => {
  const [phieuxuat, setPhieuXuat] = useState([]);
  const [khoList, setKhoList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    MaPX: '',
    NgayXuat: '',
    TongTien: '',
    MaKho: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pxData, khoData] = await Promise.all([
        phieuXuatAPI.getAll(),
        khoHangAPI.getAll()
      ]);
      setPhieuXuat(pxData);
      setKhoList(khoData);
    } catch (error) {
      alert('Lỗi kết nối API');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await phieuXuatAPI.create(formData);
      alert('Thêm phiếu xuất thành công!');
      setShowForm(false);
      setFormData({ MaPX: '', NgayXuat: '', TongTien: '', MaKho: '' });
      loadData();
    } catch (error) {
      alert('Lỗi khi thêm phiếu xuất');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa?')) {
      try {
        await phieuXuatAPI.delete(id);
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
      <h2>Quản lý Phiếu Xuất</h2>
      {!showForm ? (
        <button className="btn-add" onClick={() => setShowForm(true)}>
          + Thêm phiếu xuất mới
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
            <label>Ngày xuất:</label>
            <input
              type="date"
              name="NgayXuat"
              value={formData.NgayXuat}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Tổng tiền:</label>
            <input
              type="number"
              name="TongTien"
              value={formData.TongTien}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Mã kho:</label>
            <select
              name="MaKho"
              value={formData.MaKho}
              onChange={handleInputChange}
              required
            >
              <option value="">Chọn kho</option>
              {khoList.map(kho => (
                <option key={kho.MaKho} value={kho.MaKho}>{kho.MaKho} - {kho.TenKho}</option>
              ))}
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
              <th>Mã PX</th>
              <th>Ngày xuất</th>
              <th>Tổng tiền</th>
              <th>Mã kho</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {phieuxuat.map((px) => (
              <tr key={px.MaPX}>
                <td>{px.MaPX}</td>
                <td>{px.NgayXuat}</td>
                <td>{px.TongTien?.toLocaleString()}đ</td>
                <td>{px.MaKho}</td>
                <td>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(px.MaPX)}
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

export default PhieuXuatPage; 