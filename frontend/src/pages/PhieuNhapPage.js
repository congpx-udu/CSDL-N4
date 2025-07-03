import React, { useState, useEffect } from 'react';
import { phieuNhapAPI, nhaCungCapAPI } from '../services/api';

const PhieuNhapPage = () => {
  const [phieunhap, setPhieuNhap] = useState([]);
  const [nhacungcap, setNhaCungCap] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    MaPN: '',
    NgayNhap: '',
    TongTien: '',
    MaKho: '',
    MaNCC: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pnData, nccData] = await Promise.all([
        phieuNhapAPI.getAll(),
        nhaCungCapAPI.getAll()
      ]);
      setPhieuNhap(pnData);
      setNhaCungCap(nccData);
    } catch (error) {
      alert('Lỗi kết nối API');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await phieuNhapAPI.create(formData);
      alert('Thêm phiếu nhập thành công!');
      setShowForm(false);
      setFormData({ MaPN: '', NgayNhap: '', TongTien: '', MaKho: '', MaNCC: '' });
      loadData();
    } catch (error) {
      alert('Lỗi khi thêm phiếu nhập');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa?')) {
      try {
        await phieuNhapAPI.delete(id);
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
      <h2>Quản lý Phiếu Nhập</h2>
      
      {!showForm ? (
        <button className="btn-add" onClick={() => setShowForm(true)}>
          + Thêm phiếu nhập mới
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
            <label>Ngày nhập:</label>
            <input
              type="date"
              name="NgayNhap"
              value={formData.NgayNhap}
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
            <input
              type="text"
              name="MaKho"
              value={formData.MaKho}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Mã nhà cung cấp:</label>
            <select
              name="MaNCC"
              value={formData.MaNCC}
              onChange={handleInputChange}
              required
            >
              <option value="">Chọn nhà cung cấp</option>
              {nhacungcap.map((ncc) => (
                <option key={ncc.MaNCC} value={ncc.MaNCC}>
                  {ncc.MaNCC} - {ncc.TenNCC}
                </option>
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
              <th>Mã PN</th>
              <th>Ngày nhập</th>
              <th>Tổng tiền</th>
              <th>Mã kho</th>
              <th>Mã NCC</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {phieunhap.map((pn) => (
              <tr key={pn.MaPN}>
                <td>{pn.MaPN}</td>
                <td>{pn.NgayNhap}</td>
                <td>{pn.TongTien?.toLocaleString()}đ</td>
                <td>{pn.MaKho}</td>
                <td>{pn.MaNCC}</td>
                <td>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(pn.MaPN)}
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

export default PhieuNhapPage; 