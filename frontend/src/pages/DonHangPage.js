import React, { useState, useEffect } from 'react';
import { donHangAPI, thuocVeAPI, khachHangAPI } from '../services/api';

const DonHangPage = () => {
  const [dondathang, setDonDatHang] = useState([]);
  const [filteredDondathang, setFilteredDondathang] = useState([]);
  const [khachhang, setKhachHang] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedDon, setSelectedDon] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [detailData, setDetailData] = useState({
    thuocVe: []
  });
  const [formData, setFormData] = useState({
    MaDon: '',
    TrangThai: '',
    NgayDatHang: '',
    TongTien: '',
    MaKH: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [donData, khData] = await Promise.all([
        donHangAPI.getAll(),
        khachHangAPI.getAll()
      ]);
      setDonDatHang(donData);
      setFilteredDondathang(donData);
      setKhachHang(khData);
    } catch (error) {
      alert('Lỗi kết nối API');
    } finally {
      setLoading(false);
    }
  };

  // Hàm lọc theo MaDon (khóa chính)
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredDondathang(dondathang);
    } else {
      const filtered = dondathang.filter(don => 
        don.MaDon.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDondathang(filtered);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setFilteredDondathang(dondathang);
  };

  const loadDetailData = async (maDon) => {
    try {
      const thuocVeData = await thuocVeAPI.getAll().then(data => 
        data.filter(item => item.MaDon === maDon)
      );

      setDetailData({
        thuocVe: thuocVeData
      });
    } catch (error) {
      console.error('Lỗi khi tải chi tiết:', error);
    }
  };

  const handleViewDetail = async (don) => {
    setSelectedDon(don);
    await loadDetailData(don.MaDon);
    setShowDetail(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        // Cập nhật đơn hàng hiện tại
        await donHangAPI.update(editingItem.MaDon, formData);
        alert('Cập nhật đơn hàng thành công!');
      } else {
        // Thêm đơn hàng mới
        await donHangAPI.create(formData);
        alert('Thêm đơn hàng thành công!');
      }
      setShowForm(false);
      setEditingItem(null);
      setFormData({ MaDon: '', TrangThai: '', NgayDatHang: '', TongTien: '', MaKH: '' });
      loadData();
    } catch (error) {
      alert('Lỗi khi thao tác với đơn hàng');
    }
  };

  const handleEdit = (don) => {
    setEditingItem(don);
    setFormData({
      MaDon: don.MaDon,
      TrangThai: don.TrangThai,
      NgayDatHang: don.NgayDatHang,
      TongTien: don.TongTien,
      MaKH: don.MaKH
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData({ MaDon: '', TrangThai: '', NgayDatHang: '', TongTien: '', MaKH: '' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa?')) {
      try {
        await donHangAPI.delete(id);
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

  const getKhachHangName = (maKH) => {
    const kh = khachhang.find(k => k.MaKH === maKH);
    return kh ? kh.TenKH : maKH;
  };

  return (
    <div className="content">
      <h2>Quản lý Đơn Hàng</h2>
      
      {/* Input lọc theo MaDon */}
      <div style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Nhập mã đơn hàng (MaDon) để tìm..."
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
          + Thêm đơn hàng mới
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="form">
          <h3>{editingItem ? 'Chỉnh sửa đơn hàng' : 'Thêm đơn hàng mới'}</h3>
          <div className="form-group">
            <label>Mã đơn:</label>
            <input
              type="text"
              name="MaDon"
              value={formData.MaDon}
              onChange={handleInputChange}
              required
              disabled={editingItem}
            />
          </div>
          <div className="form-group">
            <label>Trạng thái:</label>
            <select
              name="TrangThai"
              value={formData.TrangThai}
              onChange={handleInputChange}
              required
            >
              <option value="">Chọn trạng thái</option>
              <option value="Đang xử lý">Đang xử lý</option>
              <option value="Đã hoàn thành">Đã hoàn thành</option>
              <option value="Đã hủy">Đã hủy</option>
            </select>
          </div>
          <div className="form-group">
            <label>Ngày đặt hàng:</label>
            <input
              type="date"
              name="NgayDatHang"
              value={formData.NgayDatHang}
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
            <label>Khách hàng:</label>
            <select
              name="MaKH"
              value={formData.MaKH}
              onChange={handleInputChange}
              required
            >
              <option value="">Chọn khách hàng</option>
              {khachhang.map((kh) => (
                <option key={kh.MaKH} value={kh.MaKH}>
                  {kh.MaKH} - {kh.TenKH}
                </option>
              ))}
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-save">
              {editingItem ? 'Cập nhật' : 'Lưu'}
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
              <th>Mã đơn</th>
              <th>Trạng thái</th>
              <th>Ngày đặt</th>
              <th>Tổng tiền</th>
              <th>Mã KH</th>
              <th>Tên KH</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredDondathang.map((don) => (
              <tr key={don.MaDon}>
                <td>{don.MaDon}</td>
                <td>{don.TrangThai}</td>
                <td>{don.NgayDatHang}</td>
                <td>{don.TongTien?.toLocaleString()}đ</td>
                <td>{don.MaKH}</td>
                <td>{getKhachHangName(don.MaKH)}</td>
                <td>
                  <button className="btn-view" onClick={() => handleViewDetail(don)}>
                    Chi tiết
                  </button>
                  <button 
                    className="btn-edit"
                    onClick={() => handleEdit(don)}
                  >
                    Sửa
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(don.MaDon)}
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
      {showDetail && selectedDon && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Chi tiết đơn hàng: {selectedDon.MaDon}</h3>
              <button className="modal-close" onClick={() => setShowDetail(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h4>Thông tin đơn hàng</h4>
                <p><strong>Mã đơn:</strong> {selectedDon.MaDon}</p>
                <p><strong>Trạng thái:</strong> {selectedDon.TrangThai}</p>
                <p><strong>Ngày đặt hàng:</strong> {selectedDon.NgayDatHang}</p>
                <p><strong>Tổng tiền:</strong> {selectedDon.TongTien?.toLocaleString()}đ</p>
                <p><strong>Mã khách hàng:</strong> {selectedDon.MaKH}</p>
              </div>

              {detailData.thuocVe.length > 0 && (
                <div className="detail-section">
                  <h4>Chi tiết sản phẩm</h4>
                  <table className="detail-table">
                    <thead>
                      <tr>
                        <th>Mã sản phẩm</th>
                        <th>Số lượng</th>
                        <th>Đơn giá</th>
                        <th>Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailData.thuocVe.map((item, index) => (
                        <tr key={index}>
                          <td>{item.MaSP}</td>
                          <td>{item.SoLuong}</td>
                          <td>{item.DonGia?.toLocaleString()}đ</td>
                          <td>{item.ThanhTien?.toLocaleString()}đ</td>
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

export default DonHangPage; 