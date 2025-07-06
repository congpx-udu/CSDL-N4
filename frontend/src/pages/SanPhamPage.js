import React, { useState, useEffect } from 'react';
import { sanPhamAPI, khoHangAPI } from '../services/api';

const SanPhamPage = () => {
  const [sanpham, setSanpham] = useState([]);
  const [filteredSanpham, setFilteredSanpham] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedSP, setSelectedSP] = useState(null);
  const [editingSP, setEditingSP] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    MaSP: '',
    TenSP: '',
    MoTa: '',
    LoaiSP: '',
    GiaBan: '',
    DonViTinh: '',
    MaKho: ''
  });
  const [khoHangList, setKhoHangList] = useState([]);

  useEffect(() => {
    loadData();
    loadKhoHang();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await sanPhamAPI.getAll();
      setSanpham(data);
      setFilteredSanpham(data);
    } catch (error) {
      alert('Lỗi kết nối API');
    } finally {
      setLoading(false);
    }
  };

  const loadKhoHang = async () => {
    try {
      const data = await khoHangAPI.getAll();
      setKhoHangList(data);
    } catch (error) {
      console.error('Error loading kho hang:', error);
    }
  };

  // Hàm lọc theo MaSP (khóa chính)
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredSanpham(sanpham);
    } else {
      const filtered = sanpham.filter(sp => 
        sp.MaSP.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSanpham(filtered);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setFilteredSanpham(sanpham);
  };

  const handleViewDetail = (sp) => {
    setSelectedSP(sp);
    setShowDetail(true);
  };

  const handleEdit = (sp) => {
    setEditingSP(sp);
    setShowForm(true);
  };

  useEffect(() => {
    if (editingSP) {
      setFormData({
        MaSP: editingSP.MaSP || '',
        TenSP: editingSP.TenSP || '',
        MoTa: editingSP.MoTa || '',
        LoaiSP: editingSP.LoaiSP || '',
        GiaBan: editingSP.GiaBan || '',
        DonViTinh: editingSP.DonViTinh || '',
        MaKho: editingSP.MaKho || ''
      });
    } else {
      setFormData({
        MaSP: '',
        TenSP: '',
        MoTa: '',
        LoaiSP: '',
        GiaBan: '',
        DonViTinh: '',
        MaKho: ''
      });
    }
  }, [editingSP, showForm]);

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSP) {
        await sanPhamAPI.update(editingSP.MaSP, formData);
        alert('Cập nhật sản phẩm thành công!');
      } else {
        await sanPhamAPI.create(formData);
        alert('Thêm sản phẩm thành công!');
      }
      setShowForm(false);
      setEditingSP(null);
      loadData();
    } catch (error) {
      alert('Lỗi khi thao tác với sản phẩm');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSP(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa?')) {
      try {
        await sanPhamAPI.delete(id);
        alert('Xóa thành công!');
        loadData();
      } catch (error) {
        alert('Lỗi khi xóa');
      }
    }
  };

  return (
    <div className="content">
      <h2>Quản lý Sản phẩm</h2>
      
      {/* Input lọc theo MaSP */}
      <div style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Nhập mã sản phẩm (MaSP) để tìm..."
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
          + Thêm sản phẩm mới
        </button>
      ) : (
        <form onSubmit={handleFormSubmit} className="form">
          <h3>{editingSP ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
          <div className="form-group">
            <label>Mã sản phẩm:</label>
            <input
              type="text"
              name="MaSP"
              placeholder="Mã sản phẩm"
              value={formData.MaSP}
              onChange={handleFormChange}
              required
              disabled={editingSP}
            />
          </div>
          <div className="form-group">
            <label>Tên sản phẩm:</label>
            <input
              type="text"
              name="TenSP"
              placeholder="Tên sản phẩm"
              value={formData.TenSP}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Mô tả:</label>
            <textarea
              name="MoTa"
              placeholder="Mô tả"
              value={formData.MoTa}
              onChange={handleFormChange}
            />
          </div>
          <div className="form-group">
            <label>Loại sản phẩm:</label>
            <input
              type="text"
              name="LoaiSP"
              placeholder="Loại sản phẩm"
              value={formData.LoaiSP}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Giá bán:</label>
            <input
              type="number"
              name="GiaBan"
              placeholder="Giá bán"
              value={formData.GiaBan}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Đơn vị tính:</label>
            <input
              type="text"
              name="DonViTinh"
              placeholder="Đơn vị tính"
              value={formData.DonViTinh}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Kho hàng:</label>
            <select
              name="MaKho"
              value={formData.MaKho}
              onChange={handleFormChange}
              required
            >
              <option value="">Chọn kho hàng</option>
              {khoHangList.map((kho) => (
                <option key={kho.MaKho} value={kho.MaKho}>
                  {kho.MaKho} - {kho.TenKho}
                </option>
              ))}
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-save">
              {editingSP ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
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
              <th>Mã SP</th>
              <th>Tên sản phẩm</th>
              <th>Loại</th>
              <th>Giá bán</th>
              <th>Đơn vị</th>
              <th>Mã kho</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredSanpham.map((sp) => (
              <tr key={sp.MaSP}>
                <td>{sp.MaSP}</td>
                <td>{sp.TenSP}</td>
                <td>{sp.LoaiSP}</td>
                <td>{sp.GiaBan?.toLocaleString()}đ</td>
                <td>{sp.DonViTinh}</td>
                <td>{sp.MaKho}</td>
                <td>
                  <button className="btn-view" onClick={() => handleViewDetail(sp)}>
                    Chi tiết
                  </button>
                  <button 
                    className="btn-edit"
                    onClick={() => handleEdit(sp)}
                  >
                    Sửa
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(sp.MaSP)}
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
      {showDetail && selectedSP && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Chi tiết sản phẩm: {selectedSP.TenSP}</h3>
              <button className="modal-close" onClick={() => setShowDetail(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h4>Thông tin sản phẩm</h4>
                <p><strong>Mã SP:</strong> {selectedSP.MaSP}</p>
                <p><strong>Tên sản phẩm:</strong> {selectedSP.TenSP}</p>
                <p><strong>Mô tả:</strong> {selectedSP.MoTa || 'Chưa có mô tả'}</p>
                <p><strong>Loại:</strong> {selectedSP.LoaiSP}</p>
                <p><strong>Giá bán:</strong> {selectedSP.GiaBan?.toLocaleString()}đ</p>
                <p><strong>Đơn vị:</strong> {selectedSP.DonViTinh}</p>
                <p><strong>Mã kho:</strong> {selectedSP.MaKho}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SanPhamPage;