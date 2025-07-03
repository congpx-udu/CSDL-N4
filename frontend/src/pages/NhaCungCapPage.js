import React, { useState, useEffect } from 'react';
import { nhaCungCapAPI, nhaCungCapSDTAPI } from '../services/api';

const NhaCungCapPage = () => {
  const [nhacungcap, setNhaCungCap] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedNCC, setSelectedNCC] = useState(null);
  const [editingNCC, setEditingNCC] = useState(null);
  const [detailData, setDetailData] = useState({
    soDienThoai: []
  });
  const [formData, setFormData] = useState({
    MaNCC: '',
    TenNCC: '',
    DiaChi: '',
    Email: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await nhaCungCapAPI.getAll();
      setNhaCungCap(data);
    } catch (error) {
      alert('Lỗi kết nối API');
    } finally {
      setLoading(false);
    }
  };

  const loadDetailData = async (maNCC) => {
    try {
      const sdtData = await nhaCungCapSDTAPI.getAll().then(data => 
        data.filter(item => item.MaNCC === maNCC)
      );

      setDetailData({
        soDienThoai: sdtData
      });
    } catch (error) {
      console.error('Lỗi khi tải chi tiết:', error);
    }
  };

  const handleViewDetail = async (ncc) => {
    setSelectedNCC(ncc);
    await loadDetailData(ncc.MaNCC);
    setShowDetail(true);
  };

  const handleEdit = (ncc) => {
    setEditingNCC(ncc);
    setFormData({
      MaNCC: ncc.MaNCC,
      TenNCC: ncc.TenNCC,
      DiaChi: ncc.DiaChi,
      Email: ncc.Email
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingNCC) {
        await nhaCungCapAPI.update(editingNCC.MaNCC, formData);
        alert('Cập nhật nhà cung cấp thành công!');
      } else {
        await nhaCungCapAPI.create(formData);
        alert('Thêm nhà cung cấp thành công!');
      }
      setShowForm(false);
      setEditingNCC(null);
      setFormData({ MaNCC: '', TenNCC: '', DiaChi: '', Email: '' });
      loadData();
    } catch (error) {
      alert('Lỗi khi thao tác với nhà cung cấp');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingNCC(null);
    setFormData({ MaNCC: '', TenNCC: '', DiaChi: '', Email: '' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa?')) {
      try {
        await nhaCungCapAPI.delete(id);
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
      <h2>Quản lý Nhà Cung Cấp</h2>
      
      {!showForm ? (
        <button className="btn-add" onClick={() => setShowForm(true)}>
          + Thêm nhà cung cấp mới
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="form">
          <h3>{editingNCC ? 'Chỉnh sửa nhà cung cấp' : 'Thêm nhà cung cấp mới'}</h3>
          <div className="form-group">
            <label>Mã NCC:</label>
            <input
              type="text"
              name="MaNCC"
              value={formData.MaNCC}
              onChange={handleInputChange}
              required
              disabled={editingNCC}
            />
          </div>
          <div className="form-group">
            <label>Tên NCC:</label>
            <input
              type="text"
              name="TenNCC"
              value={formData.TenNCC}
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
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="Email"
              value={formData.Email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-save">
              {editingNCC ? 'Cập nhật' : 'Lưu'}
            </button>
            <button type="button" className="btn-cancel" onClick={handleCancel}>
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
              <th>Tên NCC</th>
              <th>Địa chỉ</th>
              <th>Email</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {nhacungcap.map((ncc) => (
              <tr key={ncc.MaNCC}>
                <td>{ncc.MaNCC}</td>
                <td>{ncc.TenNCC}</td>
                <td>{ncc.DiaChi}</td>
                <td>{ncc.Email}</td>
                <td>
                  <button className="btn-view" onClick={() => handleViewDetail(ncc)}>
                    Chi tiết
                  </button>
                  <button 
                    className="btn-edit"
                    onClick={() => handleEdit(ncc)}
                  >
                    Sửa
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(ncc.MaNCC)}
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
      {showDetail && selectedNCC && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Chi tiết nhà cung cấp: {selectedNCC.TenNCC}</h3>
              <button className="modal-close" onClick={() => setShowDetail(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h4>Thông tin cơ bản</h4>
                <p><strong>Mã NCC:</strong> {selectedNCC.MaNCC}</p>
                <p><strong>Tên:</strong> {selectedNCC.TenNCC}</p>
                <p><strong>Địa chỉ:</strong> {selectedNCC.DiaChi}</p>
                <p><strong>Email:</strong> {selectedNCC.Email}</p>
              </div>

              {detailData.soDienThoai.length > 0 && (
                <div className="detail-section">
                  <h4>Số điện thoại ({detailData.soDienThoai.length})</h4>
                  <ul>
                    {detailData.soDienThoai.map((sdt, index) => (
                      <li key={index}>{sdt.SoDienThoai}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NhaCungCapPage; 