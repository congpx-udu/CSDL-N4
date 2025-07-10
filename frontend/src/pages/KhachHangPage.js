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
  const [editDetailMode, setEditDetailMode] = useState(null); // 'caNhan' | 'doanhNghiep' | null
  const [addDetailMode, setAddDetailMode] = useState(null); // 'caNhan' | 'doanhNghiep' | null
  const [tempCaNhan, setTempCaNhan] = useState({ MaCaNhan: '', Ten: '' });
  const [tempDoanhNghiep, setTempDoanhNghiep] = useState({ MaDoanhNghiep: '', LoaiHinhKinhDoanh: '', Ten: '', QuyMo: '' });

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

  const handleEdit = async (kh) => {
    setEditingKH(kh);
    setFormData({
      MaKH: kh.MaKH,
      TenKH: kh.TenKH,
      DiaChi: kh.DiaChi,
      Email: kh.Email
    });
    await loadDetailData(kh.MaKH);
    if (detailData.caNhan) {
      setEditDetailMode('caNhan');
      setTempCaNhan({
        MaCaNhan: detailData.caNhan.MaCaNhan || '',
        Ten: detailData.caNhan.Ten || ''
      });
    } else if (detailData.doanhNghiep) {
      setEditDetailMode('doanhNghiep');
      setTempDoanhNghiep({
        MaDoanhNghiep: detailData.doanhNghiep.MaDoanhNghiep || '',
        LoaiHinhKinhDoanh: detailData.doanhNghiep.LoaiHinhKinhDoanh || '',
        Ten: detailData.doanhNghiep.Ten || '',
        QuyMo: detailData.doanhNghiep.QuyMo || ''
      });
    } else {
      setEditDetailMode(null);
      setTempCaNhan({ MaCaNhan: '', Ten: '' });
      setTempDoanhNghiep({ MaDoanhNghiep: '', LoaiHinhKinhDoanh: '', Ten: '', QuyMo: '' });
    }
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingKH) {
        // Kiểm tra thay đổi
        const isChanged = (
          formData.TenKH !== editingKH.TenKH ||
          formData.DiaChi !== editingKH.DiaChi ||
          formData.Email !== editingKH.Email
        );
        if (!isChanged) {
          alert('Bạn chưa thay đổi thông tin nào!');
          return;
        }
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

  const handleDeleteDetail = async (type) => {
    if (!selectedKH) return;
    if (!window.confirm('Bạn có chắc muốn xóa thông tin chi tiết này?')) return;
    try {
      if (type === 'caNhan') {
        await caNhanAPI.delete(selectedKH.MaKH);
      } else {
        await doanhNghiepAPI.delete(selectedKH.MaKH);
      }
      await loadDetailData(selectedKH.MaKH);
      alert('Đã xóa thông tin chi tiết!');
    } catch (error) {
      alert('Lỗi khi xóa thông tin chi tiết!');
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
      
      {showForm ? (
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
      ) : (
        <button className="btn-add" onClick={() => setShowForm(true)}>
          + Thêm khách hàng mới
        </button>
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
              {/* Nếu có cá nhân */}
              {detailData.caNhan && !editDetailMode && (
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
                  <button onClick={() => { setEditDetailMode('caNhan'); setTempCaNhan({ MaCaNhan: detailData.caNhan.MaCaNhan, Ten: detailData.caNhan.Ten }); }}>Sửa</button>
                  <button onClick={() => handleDeleteDetail('caNhan')}>Xóa</button>
                  <button onClick={async () => {
                    if (window.confirm('Chuyển sang doanh nghiệp? Thao tác này sẽ xóa thông tin cá nhân!')) {
                      await handleDeleteDetail('caNhan');
                      setAddDetailMode('doanhNghiep');
                    }
                  }}>Chuyển sang doanh nghiệp</button>
                </div>
              )}
              {/* Nếu đang sửa cá nhân */}
              {editDetailMode === 'caNhan' && (
                <div className="detail-section">
                  <h4>Sửa thông tin cá nhân</h4>
                  <input type="text" placeholder="Mã cá nhân" value={tempCaNhan.MaCaNhan} onChange={e => setTempCaNhan({ ...tempCaNhan, MaCaNhan: e.target.value })} />
                  <input type="text" placeholder="Tên cá nhân" value={tempCaNhan.Ten} onChange={e => setTempCaNhan({ ...tempCaNhan, Ten: e.target.value })} />
                  <button onClick={async () => {
                    await caNhanAPI.update(selectedKH.MaKH, { ...tempCaNhan, MaKH: selectedKH.MaKH });
                    await loadDetailData(selectedKH.MaKH);
                    setEditDetailMode(null);
                  }}>Lưu</button>
                  <button onClick={() => setEditDetailMode(null)}>Hủy</button>
                </div>
              )}
              {/* Nếu có doanh nghiệp */}
              {detailData.doanhNghiep && !editDetailMode && (
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
                  <button onClick={() => { setEditDetailMode('doanhNghiep'); setTempDoanhNghiep({
                    MaDoanhNghiep: detailData.doanhNghiep.MaDoanhNghiep,
                    LoaiHinhKinhDoanh: detailData.doanhNghiep.LoaiHinhKinhDoanh,
                    Ten: detailData.doanhNghiep.Ten,
                    QuyMo: detailData.doanhNghiep.QuyMo
                  }); }}>Sửa</button>
                  <button onClick={() => handleDeleteDetail('doanhNghiep')}>Xóa</button>
                  <button onClick={async () => {
                    if (window.confirm('Chuyển sang cá nhân? Thao tác này sẽ xóa thông tin doanh nghiệp!')) {
                      await handleDeleteDetail('doanhNghiep');
                      setAddDetailMode('caNhan');
                    }
                  }}>Chuyển sang cá nhân</button>
                </div>
              )}
              {/* Nếu đang sửa doanh nghiệp */}
              {editDetailMode === 'doanhNghiep' && (
                <div className="detail-section">
                  <h4>Sửa thông tin doanh nghiệp</h4>
                  <input type="text" placeholder="Mã doanh nghiệp" value={tempDoanhNghiep.MaDoanhNghiep} onChange={e => setTempDoanhNghiep({ ...tempDoanhNghiep, MaDoanhNghiep: e.target.value })} />
                  <input type="text" placeholder="Loại hình kinh doanh" value={tempDoanhNghiep.LoaiHinhKinhDoanh} onChange={e => setTempDoanhNghiep({ ...tempDoanhNghiep, LoaiHinhKinhDoanh: e.target.value })} />
                  <input type="text" placeholder="Tên doanh nghiệp" value={tempDoanhNghiep.Ten} onChange={e => setTempDoanhNghiep({ ...tempDoanhNghiep, Ten: e.target.value })} />
                  <input type="text" placeholder="Quy mô" value={tempDoanhNghiep.QuyMo} onChange={e => setTempDoanhNghiep({ ...tempDoanhNghiep, QuyMo: e.target.value })} />
                  <button onClick={async () => {
                    await doanhNghiepAPI.update(selectedKH.MaKH, { ...tempDoanhNghiep, MaKH: selectedKH.MaKH });
                    await loadDetailData(selectedKH.MaKH);
                    setEditDetailMode(null);
                  }}>Lưu</button>
                  <button onClick={() => setEditDetailMode(null)}>Hủy</button>
                </div>
              )}
              {/* Nếu chưa có chi tiết, cho phép chọn loại và thêm mới */}
              {!detailData.caNhan && !detailData.doanhNghiep && !addDetailMode && (
                <div className="detail-section">
                  <h4>Khách hàng này chưa có thông tin chi tiết</h4>
                  <button onClick={() => setAddDetailMode('caNhan')}>Thêm cá nhân</button>
                  <button onClick={() => setAddDetailMode('doanhNghiep')}>Thêm doanh nghiệp</button>
                </div>
              )}
              {/* Form thêm cá nhân */}
              {addDetailMode === 'caNhan' && (
                <div className="detail-section">
                  <h4>Thêm thông tin cá nhân</h4>
                  <input type="text" placeholder="Mã cá nhân" value={tempCaNhan.MaCaNhan} onChange={e => setTempCaNhan({ ...tempCaNhan, MaCaNhan: e.target.value })} />
                  <input type="text" placeholder="Tên cá nhân" value={tempCaNhan.Ten} onChange={e => setTempCaNhan({ ...tempCaNhan, Ten: e.target.value })} />
                  <button onClick={async () => {
                    await caNhanAPI.create({ ...tempCaNhan, MaKH: selectedKH.MaKH });
                    await loadDetailData(selectedKH.MaKH);
                    setAddDetailMode(null);
                    setTempCaNhan({ MaCaNhan: '', Ten: '' });
                  }}>Lưu</button>
                  <button onClick={() => { setAddDetailMode(null); setTempCaNhan({ MaCaNhan: '', Ten: '' }); }}>Hủy</button>
                </div>
              )}
              {/* Form thêm doanh nghiệp */}
              {addDetailMode === 'doanhNghiep' && (
                <div className="detail-section">
                  <h4>Thêm thông tin doanh nghiệp</h4>
                  <input type="text" placeholder="Mã doanh nghiệp" value={tempDoanhNghiep.MaDoanhNghiep} onChange={e => setTempDoanhNghiep({ ...tempDoanhNghiep, MaDoanhNghiep: e.target.value })} />
                  <input type="text" placeholder="Loại hình kinh doanh" value={tempDoanhNghiep.LoaiHinhKinhDoanh} onChange={e => setTempDoanhNghiep({ ...tempDoanhNghiep, LoaiHinhKinhDoanh: e.target.value })} />
                  <input type="text" placeholder="Tên doanh nghiệp" value={tempDoanhNghiep.Ten} onChange={e => setTempDoanhNghiep({ ...tempDoanhNghiep, Ten: e.target.value })} />
                  <input type="text" placeholder="Quy mô" value={tempDoanhNghiep.QuyMo} onChange={e => setTempDoanhNghiep({ ...tempDoanhNghiep, QuyMo: e.target.value })} />
                  <button onClick={async () => {
                    await doanhNghiepAPI.create({ ...tempDoanhNghiep, MaKH: selectedKH.MaKH });
                    await loadDetailData(selectedKH.MaKH);
                    setAddDetailMode(null);
                    setTempDoanhNghiep({ MaDoanhNghiep: '', LoaiHinhKinhDoanh: '', Ten: '', QuyMo: '' });
                  }}>Lưu</button>
                  <button onClick={() => { setAddDetailMode(null); setTempDoanhNghiep({ MaDoanhNghiep: '', LoaiHinhKinhDoanh: '', Ten: '', QuyMo: '' }); }}>Hủy</button>
                </div>
              )}

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