import React, { useState, useEffect } from 'react';
import { donHangAPI, thuocVeAPI, khachHangAPI } from '../services/api';

const DonHangPage = () => {
  const [dondathang, setDonDatHang] = useState([]);
  const [khachhang, setKhachHang] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedDon, setSelectedDon] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
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
      setKhachHang(khData);
    } catch (error) {
      alert('Lỗi kết nối API');
    } finally {
      setLoading(false);
    }
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
            {dondathang.map((don) => (
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

              <div className="detail-section">
                <h4>Sản phẩm trong đơn (Thuộc Về)</h4>
                {detailData.thuocVe.length > 0 ? (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Mã SP</th>
                        <th>Mã PX</th>
                        <th>Số lượng</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailData.thuocVe.map((tv, index) => (
                        <tr key={index}>
                          <td>{tv.MaSP}</td>
                          <td>{tv.MaPX}</td>
                          <td>{tv.SoLuongSanPham}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>Chưa có sản phẩm nào trong đơn hàng này</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonHangPage; 