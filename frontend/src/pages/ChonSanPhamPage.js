import React, { useState, useEffect } from 'react';
import { chonAPI, khachHangAPI, sanPhamAPI } from '../services/api';

const ChonSanPhamPage = () => {
  const [chonList, setChonList] = useState([]);
  const [khachhang, setKhachHang] = useState([]);
  const [sanpham, setSanPham] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    MaKH: '',
    MaSP: ''
  });
  const [filterMaKH, setFilterMaKH] = useState('');
  const [filterMaSP, setFilterMaSP] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [chonData, khData, spData] = await Promise.all([
        chonAPI.getAll(),
        khachHangAPI.getAll(),
        sanPhamAPI.getAll()
      ]);
      setChonList(chonData);
      setKhachHang(khData);
      setSanPham(spData);
    } catch (error) {
      alert('Lỗi kết nối API');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        // Cập nhật lựa chọn hiện tại
        await chonAPI.update(`${editingItem.MaKH}-${editingItem.MaSP}`, formData);
        alert('Cập nhật lựa chọn sản phẩm thành công!');
      } else {
        // Thêm lựa chọn mới
        await chonAPI.create(formData);
        alert('Thêm lựa chọn sản phẩm thành công!');
      }
      setShowForm(false);
      setEditingItem(null);
      setFormData({ MaKH: '', MaSP: '' });
      loadData();
    } catch (error) {
      alert('Lỗi khi thao tác với lựa chọn sản phẩm');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      MaKH: item.MaKH,
      MaSP: item.MaSP
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData({ MaKH: '', MaSP: '' });
  };

  const handleDelete = async (maKH, maSP) => {
    if (window.confirm('Bạn có chắc muốn xóa lựa chọn này?')) {
      try {
        await chonAPI.delete(`${maKH}-${maSP}`);
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

  const getSanPhamName = (maSP) => {
    const sp = sanpham.find(s => s.MaSP === maSP);
    return sp ? sp.TenSP : maSP;
  };

  return (
    <div className="content">
      <h2>Quản lý Lựa Chọn Sản Phẩm</h2>
      <p className="description">
        Quản lý việc khách hàng chọn sản phẩm.
      </p>
      
      {!showForm ? (
        <button className="btn-add" onClick={() => setShowForm(true)}>
          + Thêm lựa chọn sản phẩm mới
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="form">
          <h3>{editingItem ? 'Chỉnh sửa lựa chọn sản phẩm' : 'Thêm lựa chọn sản phẩm'}</h3>
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
          <div className="form-group">
            <label>Sản phẩm:</label>
            <select
              name="MaSP"
              value={formData.MaSP}
              onChange={handleInputChange}
              required
            >
              <option value="">Chọn sản phẩm</option>
              {sanpham.map((sp) => (
                <option key={sp.MaSP} value={sp.MaSP}>
                  {sp.MaSP} - {sp.TenSP}
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
        <>
          <div className="filter-group">
            <select value={filterMaKH} onChange={e => setFilterMaKH(e.target.value)}>
              <option value="">Tất cả khách hàng</option>
              {khachhang.map(kh => (
                <option key={kh.MaKH} value={kh.MaKH}>{kh.MaKH} - {kh.TenKH}</option>
              ))}
            </select>
            <select value={filterMaSP} onChange={e => setFilterMaSP(e.target.value)}>
              <option value="">Tất cả sản phẩm</option>
              {sanpham.map(sp => (
                <option key={sp.MaSP} value={sp.MaSP}>{sp.MaSP} - {sp.TenSP}</option>
              ))}
            </select>
          </div>

          {(() => {
            const filteredList = chonList.filter(item =>
              (filterMaKH === '' || item.MaKH === filterMaKH) &&
              (filterMaSP === '' || item.MaSP === filterMaSP)
            );
            return (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Mã KH</th>
                    <th>Tên Khách Hàng</th>
                    <th>Mã SP</th>
                    <th>Tên Sản Phẩm</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.map((chon, index) => (
                    <tr key={`${chon.MaKH}-${chon.MaSP}`}>
                      <td>{index + 1}</td>
                      <td>{chon.MaKH}</td>
                      <td>{getKhachHangName(chon.MaKH)}</td>
                      <td>{chon.MaSP}</td>
                      <td>{getSanPhamName(chon.MaSP)}</td>
                      <td>
                        <button 
                          className="btn-edit"
                          onClick={() => handleEdit(chon)}
                        >
                          Sửa
                        </button>
                        <button 
                          className="btn-delete"
                          onClick={() => handleDelete(chon.MaKH, chon.MaSP)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          })()}
        </>
      )}
    </div>
  );
};

export default ChonSanPhamPage; 