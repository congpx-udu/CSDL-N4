import React, { useState, useEffect } from 'react';
import { donHangAPI } from '../services/api';

const DonHangPage = () => {
  const [dondathang, setDondathang] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    MaDon: '',
    MaKH: '',
    NgayDatHang: '',
    TongTien: '',
    TrangThai: 'Chờ xử lý'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await donHangAPI.getAll();
      setDondathang(data);
    } catch (error) {
      alert('Lỗi kết nối API');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await donHangAPI.create(formData);
      alert('Tạo đơn hàng thành công!');
      setFormData({ MaDon: '', MaKH: '', NgayDatHang: '', TongTien: '', TrangThai: 'Chờ xử lý' });
      setShowForm(false);
      loadData();
    } catch (error) {
      alert('Lỗi khi tạo đơn hàng');
    }
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

  return (
    <div className="content">
      <h2>Quản lý Đơn hàng</h2>
      
      {!showForm ? (
        <button className="btn-add" onClick={() => setShowForm(true)}>
          + Tạo đơn hàng mới
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="add-form">
          <h3>Tạo đơn hàng mới</h3>
          <input
            type="text"
            placeholder="Mã đơn hàng"
            value={formData.MaDon}
            onChange={(e) => setFormData({...formData, MaDon: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Mã khách hàng"
            value={formData.MaKH}
            onChange={(e) => setFormData({...formData, MaKH: e.target.value})}
            required
          />
          <input
            type="date"
            placeholder="Ngày đặt hàng"
            value={formData.NgayDatHang}
            onChange={(e) => setFormData({...formData, NgayDatHang: e.target.value})}
            required
          />
          <input
            type="number"
            placeholder="Tổng tiền"
            value={formData.TongTien}
            onChange={(e) => setFormData({...formData, TongTien: e.target.value})}
            required
          />
          <select
            value={formData.TrangThai}
            onChange={(e) => setFormData({...formData, TrangThai: e.target.value})}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '15px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          >
            <option value="Chờ xử lý">Chờ xử lý</option>
            <option value="Đang xử lý">Đang xử lý</option>
            <option value="Đã giao">Đã giao</option>
            <option value="Đã hủy">Đã hủy</option>
          </select>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn-add">Tạo đơn hàng</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-cancel">
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
              <th>Khách hàng</th>
              <th>Ngày đặt</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {dondathang.map((don) => (
              <tr key={don.MaDon}>
                <td>{don.MaDon}</td>
                <td>{don.MaKH}</td>
                <td>{don.NgayDatHang}</td>
                <td>{don.TongTien?.toLocaleString()}đ</td>
                <td>{don.TrangThai}</td>
                <td>
                  <button className="btn-edit">Sửa</button>
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
    </div>
  );
};

export default DonHangPage; 