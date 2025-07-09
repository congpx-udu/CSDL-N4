import React, { useState, useEffect } from 'react';
import { khachHangAPI, caNhanAPI, doanhNghiepAPI, khachHangSDTAPI, chonAPI, sanPhamAPI } from '../services/api';

const KhachHangPage = () => {
  const [khachhang, setKhachhang] = useState([]);
  const [filteredKhachhang, setFilteredKhachhang] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedKH, setSelectedKH] = useState(null);
  const [editingKH, setEditingKH] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [detailData, setDetailData] = useState({
    caNhan: null,
    doanhNghiep: null,
    soDienThoai: [],
    sanPhamDaChon: [],
    sanPhamList: []
  });
  const [formData, setFormData] = useState({
    MaKH: '',
    TenKH: '',
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
      const data = await khachHangAPI.getAll();
      setKhachhang(data);
      setFilteredKhachhang(data);
    } catch (error) {
      alert('Lỗi kết nối API');
    } finally {
      setLoading(false);
    }
  };

  // Hàm lọc theo MaKH (khóa chính)
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredKhachhang(khachhang);
    } else {
      const filtered = khachhang.filter(kh => 
        kh.MaKH.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredKhachhang(filtered);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setFilteredKhachhang(khachhang);
  };

  const loadDetailData = async (maKH) => {
    try {
      console.log('Loading detail for MaKH:', maKH);
      
      const [caNhanData, doanhNghiepData, sdtData, chonData, sanPhamData] = await Promise.all([
        caNhanAPI.getById(maKH).catch((error) => {
          console.log('CaNhan API error:', error);
          return null;
        }),
        doanhNghiepAPI.getById(maKH).catch((error) => {
          console.log('DoanhNghiep API error:', error);
          return null;
        }),
        khachHangSDTAPI.getAll().then(data => {
          console.log('maKH truyền vào lấy SDT:', maKH);
          return data.filter(item => item.MaKH && item.MaKH.trim().toUpperCase() === maKH.trim().toUpperCase());
        }),
        chonAPI.getAll().then(data => data.filter(item => item.MaKH === maKH)),
        sanPhamAPI.getAll()
      ]);

      console.log('Debug - Doanh nghiep data:', doanhNghiepData);
      console.log('Debug - Ca nhan data:', caNhanData);
      console.log('Debug - SDT data:', sdtData);
      console.log('Debug - Chon data:', chonData);

      setDetailData({
        caNhan: caNhanData,
        doanhNghiep: doanhNghiepData,
        soDienThoai: sdtData,
        sanPhamDaChon: chonData,
        sanPhamList: sanPhamData
      });
    } catch (error) {
      console.error('Lỗi khi tải chi tiết:', error);
      alert('Có lỗi khi tải thông tin chi tiết: ' + error.message);
    }
  };

  const handleViewDetail = async (kh) => {
    setSelectedKH(kh);
    await loadDetailData(kh.MaKH);
    setShowDetail(true);
  };

  const handleEdit = (kh) => {
    setEditingKH(kh);
    setFormData({
      MaKH: kh.MaKH,
      TenKH: kh.TenKH,
      DiaChi: kh.DiaChi,
      Email: kh.Email
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingKH) {
        await khachHangAPI.update(editingKH.MaKH, formData);
        alert('Cập nhật khách hàng thành công!');
      } else {
        await khachHangAPI.create(formData);
        alert('Thêm khách hàng thành công!');
      }
      setFormData({ MaKH: '', TenKH: '', DiaChi: '', Email: '' });
      setShowForm(false);
      setEditingKH(null);
      loadData();
    } catch (error) {
      alert('Lỗi khi thao tác với khách hàng');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingKH(null);
    setFormData({ MaKH: '', TenKH: '', DiaChi: '', Email: '' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa?')) {
      try {
        await khachHangAPI.delete(id);
        alert('Xóa thành công!');
        loadData();
      } catch (error) {
        alert('Lỗi khi xóa');
      }
    }
  };

  const getSanPhamName = (maSP) => {
    const sp = detailData.sanPhamList.find(s => s.MaSP === maSP);
    return sp ? sp.TenSP : maSP;
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
        await khachHangSDTAPI.delete(`${selectedKH.MaKH}/${oldSDT.SoDienThoai}`);
        await khachHangSDTAPI.create({ MaKH: selectedKH.MaKH, SoDienThoai: phoneForm.SoDienThoai });
      } else {
        // Thêm mới
        await khachHangSDTAPI.create({ MaKH: selectedKH.MaKH, SoDienThoai: phoneForm.SoDienThoai });
      }
      setPhoneForm({ SoDienThoai: '', editingIndex: null });
      await loadDetailData(selectedKH.MaKH);
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
      await khachHangSDTAPI.delete(`${selectedKH.MaKH}/${sdt.SoDienThoai}`);
      await loadDetailData(selectedKH.MaKH);
      if (phoneForm.editingIndex === index) setPhoneForm({ SoDienThoai: '', editingIndex: null });
    } catch (error) {
      alert('Lỗi khi xóa số điện thoại');
    }
  };

  return (
    <div className="content">
      <h2>Quản lý Khách hàng</h2>
      
      {/* Input lọc theo MaKH */}
      <div style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Nhập mã khách hàng (MaKH) để tìm..."
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
          + Thêm khách hàng mới
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="form">
          <h3>{editingKH ? 'Chỉnh sửa khách hàng' : 'Thêm khách hàng mới'}</h3>
          <div className="form-group">
            <label>Mã khách hàng:</label>
            <input
              type="text"
              value={formData.MaKH}
              onChange={(e) => setFormData({...formData, MaKH: e.target.value})}
              required
              disabled={editingKH}
            />
          </div>
          <div className="form-group">
            <label>Tên khách hàng:</label>
            <input
              type="text"
              value={formData.TenKH}
              onChange={(e) => setFormData({...formData, TenKH: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Địa chỉ:</label>
            <input
              type="text"
              value={formData.DiaChi}
              onChange={(e) => setFormData({...formData, DiaChi: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={formData.Email}
              onChange={(e) => setFormData({...formData, Email: e.target.value})}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-save">
              {editingKH ? 'Cập nhật' : 'Lưu'}
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
              <th>Mã KH</th>
              <th>Tên khách hàng</th>
              <th>Địa chỉ</th>
              <th>Email</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredKhachhang.map((kh) => (
              <tr key={kh.MaKH}>
                <td>{kh.MaKH}</td>
                <td>{kh.TenKH}</td>
                <td>{kh.DiaChi}</td>
                <td>{kh.Email}</td>
                <td>
                  <button className="btn-view" onClick={() => handleViewDetail(kh)}>
                    Chi tiết
                  </button>
                  <button 
                    className="btn-edit"
                    onClick={() => handleEdit(kh)}
                  >
                    Sửa
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(kh.MaKH)}
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
      {showDetail && selectedKH && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Chi tiết khách hàng: {selectedKH.TenKH}</h3>
              <button className="modal-close" onClick={() => setShowDetail(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h4>Thông tin cơ bản</h4>
                <p><strong>Mã KH:</strong> {selectedKH.MaKH}</p>
                <p><strong>Tên:</strong> {selectedKH.TenKH}</p>
                <p><strong>Địa chỉ:</strong> {selectedKH.DiaChi}</p>
                <p><strong>Email:</strong> {selectedKH.Email}</p>
              </div>

              {detailData.caNhan ? (
                <div className="detail-section">
                  <h4>Thông tin cá nhân</h4>
                  <table className="detail-table">
                    <tbody>
                      <tr>
                        <td><strong>Mã khách hàng:</strong></td>
                        <td>{detailData.caNhan.MaKH}</td>
                      </tr>
                      <tr>
                        <td><strong>Mã cá nhân:</strong></td>
                        <td>{detailData.caNhan.MaCaNhan}</td>
                      </tr>
                      <tr>
                        <td><strong>Tên cá nhân:</strong></td>
                        <td>{detailData.caNhan.Ten}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : null}

              {!detailData.caNhan && !detailData.doanhNghiep && (
                <div className="detail-section">
                  <h4>Thông tin chi tiết</h4>
                  <p style={{ color: '#666', fontStyle: 'italic' }}>
                    Khách hàng này chưa có thông tin chi tiết (cá nhân hoặc doanh nghiệp)
                  </p>
                  <p style={{ color: '#999', fontSize: '12px' }}>
                    Debug: CaNhan = {detailData.caNhan ? 'Có dữ liệu' : 'Không có dữ liệu'}, 
                    DoanhNghiep = {detailData.doanhNghiep ? 'Có dữ liệu' : 'Không có dữ liệu'}
                  </p>
                </div>
              )}

              {detailData.doanhNghiep ? (
                <div className="detail-section">
                  <h4>Thông tin doanh nghiệp</h4>
                  <table className="detail-table">
                    <tbody>
                      <tr>
                        <td><strong>Mã khách hàng:</strong></td>
                        <td>{detailData.doanhNghiep.MaKH}</td>
                      </tr>
                      <tr>
                        <td><strong>Mã doanh nghiệp:</strong></td>
                        <td>{detailData.doanhNghiep.MaDoanhNghiep}</td>
                      </tr>
                      <tr>
                        <td><strong>Loại hình kinh doanh:</strong></td>
                        <td>{detailData.doanhNghiep.LoaiHinhKinhDoanh}</td>
                      </tr>
                      <tr>
                        <td><strong>Tên doanh nghiệp:</strong></td>
                        <td>{detailData.doanhNghiep.Ten}</td>
                      </tr>
                      <tr>
                        <td><strong>Quy mô:</strong></td>
                        <td>{detailData.doanhNghiep.QuyMo}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : null}

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

              {detailData.sanPhamDaChon.length > 0 && (
                <div className="detail-section">
                  <h4>Sản phẩm đã chọn ({detailData.sanPhamDaChon.length})</h4>
                  <table className="detail-table">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Mã SP</th>
                        <th>Tên sản phẩm</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailData.sanPhamDaChon.map((chon, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{chon.MaSP}</td>
                          <td>{getSanPhamName(chon.MaSP)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KhachHangPage; 