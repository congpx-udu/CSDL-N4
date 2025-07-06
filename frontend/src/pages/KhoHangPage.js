import React, { useState, useEffect } from 'react';
import { khoHangAPI } from '../services/api';

const KhoHangPage = () => {
  const [khohang, setKhoHang] = useState([]);
  const [filteredKhohang, setFilteredKhohang] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedKho, setSelectedKho] = useState(null);
  const [editingKho, setEditingKho] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    MaKho: '',
    TenKho: '',
    NguoiQuanLy: '',
    DiaChiKho: '',
    SucChua: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await khoHangAPI.getAll();
      setKhoHang(data);
      setFilteredKhohang(data);
    } catch (error) {
      alert('Lỗi kết nối API');
    } finally {
      setLoading(false);
    }
  };

  // Hàm lọc theo MaKho (khóa chính)
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredKhohang(khohang);
    } else {
      const filtered = khohang.filter(kho => 
        kho.MaKho.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredKhohang(filtered);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setFilteredKhohang(khohang);
  };

  const handleViewDetail = (kho) => {
    setSelectedKho(kho);
    setShowDetail(true);
  };

  const handleEdit = (kho) => {
    setEditingKho(kho);
    setFormData({
      MaKho: kho.MaKho,
      TenKho: kho.TenKho,
      NguoiQuanLy: kho.NguoiQuanLy,
      DiaChiKho: kho.DiaChiKho,
      SucChua: kho.SucChua
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingKho) {
        await khoHangAPI.update(editingKho.MaKho, formData);
        alert('Cập nhật kho hàng thành công!');
      } else {
        await khoHangAPI.create(formData);
        alert('Thêm kho hàng thành công!');
      }
      setShowForm(false);
      setEditingKho(null);
      setFormData({ MaKho: '', TenKho: '', NguoiQuanLy: '', DiaChiKho: '', SucChua: '' });
      loadData();
    } catch (error) {
      alert('Lỗi khi thao tác với kho hàng');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingKho(null);
    setFormData({ MaKho: '', TenKho: '', NguoiQuanLy: '', DiaChiKho: '', SucChua: '' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa?')) {
      try {
        await khoHangAPI.delete(id);
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
      <h2>Quản lý Kho Hàng</h2>
      
      {/* Input lọc theo MaKho */}
      <div style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Nhập mã kho (MaKho) để tìm..."
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
          + Thêm kho hàng mới
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="form">
          <h3>{editingKho ? 'Chỉnh sửa kho hàng' : 'Thêm kho hàng mới'}</h3>
          <div className="form-group">
            <label>Mã kho:</label>
            <input
              type="text"
              name="MaKho"
              placeholder="Mã kho"
              value={formData.MaKho}
              onChange={handleInputChange}
              required
              disabled={editingKho}
            />
          </div>
          <div className="form-group">
            <label>Tên kho:</label>
            <input
              type="text"
              name="TenKho"
              placeholder="Tên kho"
              value={formData.TenKho}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Người quản lý:</label>
            <input
              type="text"
              name="NguoiQuanLy"
              placeholder="Người quản lý"
              value={formData.NguoiQuanLy}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Địa chỉ:</label>
            <input
              type="text"
              name="DiaChiKho"
              placeholder="Địa chỉ"
              value={formData.DiaChiKho}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Sức chứa:</label>
            <input
              type="number"
              name="SucChua"
              placeholder="Sức chứa"
              value={formData.SucChua}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-save">
              {editingKho ? 'Cập nhật kho' : 'Thêm kho'}
            </button>
            <button type="button" onClick={handleCancel} className="btn-cancel">
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
              <th>Mã kho</th>
              <th>Tên kho</th>
              <th>Người quản lý</th>
              <th>Địa chỉ</th>
              <th>Sức chứa</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredKhohang.map((kho) => (
              <tr key={kho.MaKho}>
                <td>{kho.MaKho}</td>
                <td>{kho.TenKho}</td>
                <td>{kho.NguoiQuanLy}</td>
                <td>{kho.DiaChiKho}</td>
                <td>{kho.SucChua}</td>
                <td>
                  <button className="btn-view" onClick={() => handleViewDetail(kho)}>
                    Chi tiết
                  </button>
                  <button 
                    className="btn-edit"
                    onClick={() => handleEdit(kho)}
                  >
                    Sửa
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(kho.MaKho)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal Chi tiết */}
      {showDetail && selectedKho && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Chi tiết kho hàng: {selectedKho.TenKho}</h3>
              <button className="modal-close" onClick={() => setShowDetail(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h4>Thông tin kho hàng</h4>
                <p><strong>Mã kho:</strong> {selectedKho.MaKho}</p>
                <p><strong>Tên kho:</strong> {selectedKho.TenKho}</p>
                <p><strong>Người quản lý:</strong> {selectedKho.NguoiQuanLy}</p>
                <p><strong>Địa chỉ:</strong> {selectedKho.DiaChiKho}</p>
                <p><strong>Sức chứa:</strong> {selectedKho.SucChua}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KhoHangPage; 