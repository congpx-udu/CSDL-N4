import React, { useState, useEffect } from 'react';
import { phieuXuatAPI, khoHangAPI } from '../services/api';

const PhieuXuatPage = () => {
  const [phieuxuat, setPhieuXuat] = useState([]);
  const [filteredPhieuxuat, setFilteredPhieuxuat] = useState([]);
  const [khoList, setKhoList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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
      setFilteredPhieuxuat(pxData);
      setKhoList(khoData);
    } catch (error) {
      alert('Lỗi kết nối API');
    } finally {
      setLoading(false);
    }
  };

  // Hàm lọc theo MaPX (khóa chính)
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredPhieuxuat(phieuxuat);
    } else {
      const filtered = phieuxuat.filter(px => 
        px.MaPX.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPhieuxuat(filtered);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setFilteredPhieuxuat(phieuxuat);
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
      
      {/* Input lọc theo MaPX */}
      <div style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Nhập mã phiếu xuất (MaPX) để tìm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              flex: 1, 
              padding: '10px', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
          <button 
            onClick={handleSearch}
            style={{
              padding: '10px 20px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Tìm kiếm
          </button>
          <button 
            onClick={handleClear}
            style={{
              padding: '10px 20px',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Xóa
          </button>
        </div>
      </div>
      
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
              <th>Mã phiếu xuất</th>
              <th>Ngày xuất</th>
              <th>Tổng tiền</th>
              <th>Mã kho</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredPhieuxuat.map((px) => (
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