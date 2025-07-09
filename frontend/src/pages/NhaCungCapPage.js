import React, { useState, useEffect } from 'react';
import { nhaCungCapAPI, nhaCungCapSDTAPI } from '../services/api';

const NhaCungCapPage = () => {
  const [nhacungcap, setNhaCungCap] = useState([]);
  const [filteredNhacungcap, setFilteredNhacungcap] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedNCC, setSelectedNCC] = useState(null);
  const [editingNCC, setEditingNCC] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [detailData, setDetailData] = useState({
    soDienThoai: []
  });
  const [formData, setFormData] = useState({
    MaNCC: '',
    TenNCC: '',
    DiaChi: '',
    Email: ''
  });
  const [phoneForm, setPhoneForm] = useState({ SoDienThoai: '', editingIndex: null });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await nhaCungCapAPI.getAll();
      setNhaCungCap(data);
      setFilteredNhacungcap(data);
    } catch (error) {
      alert('Lỗi kết nối API');
    } finally {
      setLoading(false);
    }
  };

  // Hàm lọc theo MaNCC (khóa chính)
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredNhacungcap(nhacungcap);
    } else {
      const filtered = nhacungcap.filter(ncc => 
        ncc.MaNCC.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredNhacungcap(filtered);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setFilteredNhacungcap(nhacungcap);
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

  const handlePhoneInputChange = (e) => {
    setPhoneForm({ ...phoneForm, SoDienThoai: e.target.value });
  };

  const isValidPhoneNumber = (phone) => {
    return /^0\d{9,10}$/.test(phone);
  };

  const handleAddOrEditPhone = async () => {
    if (!phoneForm.SoDienThoai.trim()) return;
    if (!isValidPhoneNumber(phoneForm.SoDienThoai)) {
      alert('Vui lòng nhập đúng số điện thoại');
      return;
    }
    try {
      if (phoneForm.editingIndex !== null) {
        // Sửa số điện thoại: xóa số cũ, thêm số mới
        const oldSDT = detailData.soDienThoai[phoneForm.editingIndex];
        await nhaCungCapSDTAPI.delete(`${selectedNCC.MaNCC}/${oldSDT.SoDienThoai}`);
        await nhaCungCapSDTAPI.create({ MaNCC: selectedNCC.MaNCC, SoDienThoai: phoneForm.SoDienThoai });
      } else {
        // Thêm mới
        await nhaCungCapSDTAPI.create({ MaNCC: selectedNCC.MaNCC, SoDienThoai: phoneForm.SoDienThoai });
      }
      setPhoneForm({ SoDienThoai: '', editingIndex: null });
      await loadDetailData(selectedNCC.MaNCC);
    } catch (error) {
      alert('Lỗi khi thêm/sửa số điện thoại');
    }
  };

  const handleEditPhone = (index) => {
    setPhoneForm({ SoDienThoai: detailData.soDienThoai[index].SoDienThoai, editingIndex: index });
  };

  const handleDeletePhone = async (index) => {
    if (!window.confirm('Bạn có chắc muốn xóa số điện thoại này?')) return;
    try {
      const sdt = detailData.soDienThoai[index];
      await nhaCungCapSDTAPI.delete(`${selectedNCC.MaNCC}/${sdt.SoDienThoai}`);
      await loadDetailData(selectedNCC.MaNCC);
      if (phoneForm.editingIndex === index) setPhoneForm({ SoDienThoai: '', editingIndex: null });
    } catch (error) {
      alert('Lỗi khi xóa số điện thoại');
    }
  };

  return (
    <div className="content">
      <h2>Quản lý Nhà Cung Cấp</h2>
      
      {/* Input lọc theo MaNCC */}
      <div style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Nhập mã nhà cung cấp (MaNCC) để tìm..."
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
            {filteredNhacungcap.map((ncc) => (
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
                <h4>Thông tin nhà cung cấp</h4>
                <p><strong>Mã NCC:</strong> {selectedNCC.MaNCC}</p>
                <p><strong>Tên NCC:</strong> {selectedNCC.TenNCC}</p>
                <p><strong>Địa chỉ:</strong> {selectedNCC.DiaChi}</p>
                <p><strong>Email:</strong> {selectedNCC.Email}</p>
              </div>

              {detailData.soDienThoai.length > 0 && (
                <div className="detail-section">
                  <h4>Số điện thoại ({detailData.soDienThoai.length})</h4>
                  <ul>
                    {detailData.soDienThoai.map((sdt, index) => (
                      <li key={index} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {sdt.SoDienThoai}
                        <button style={{marginLeft: 8}} onClick={() => handleEditPhone(index)}>Sửa</button>
                        <button style={{marginLeft: 4}} onClick={() => handleDeletePhone(index)}>Xóa</button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="detail-section">
                <h4>{phoneForm.editingIndex !== null ? 'Sửa số điện thoại' : 'Thêm số điện thoại mới'}</h4>
                <input
                  type="tel"
                  value={phoneForm.SoDienThoai}
                  onChange={handlePhoneInputChange}
                  placeholder="Nhập số điện thoại"
                  style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc', marginRight: 8 }}
                />
                <button onClick={handleAddOrEditPhone} style={{ padding: '6px 16px' }}>
                  {phoneForm.editingIndex !== null ? 'Cập nhật' : 'Thêm'}
                </button>
                {phoneForm.editingIndex !== null && (
                  <button onClick={() => setPhoneForm({ SoDienThoai: '', editingIndex: null })} style={{ marginLeft: 8 }}>
                    Hủy
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NhaCungCapPage; 