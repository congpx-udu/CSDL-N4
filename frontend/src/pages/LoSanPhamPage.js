import React, { useState, useEffect } from 'react';
import { loSanPhamAPI, tiepNhanAPI, sanPhamAPI, nhaCungCapAPI } from '../services/api';

const LoSanPhamPage = () => {
  const [losanpham, setLoSanPham] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedLo, setSelectedLo] = useState(null);
  const [detailData, setDetailData] = useState({
    sanPhamsInLo: []
  });
  const [formData, setFormData] = useState({
    MaLo: '',
    NgaySanXuat: '',
    HanSuDung: '',
    SoLuong: '',
    MaPN: '',
    MaNCC: ''
  });
  const [nhaCungCapList, setNhaCungCapList] = useState([]);

  useEffect(() => {
    loadData();
    loadNhaCungCap();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await loSanPhamAPI.getAll();
      setLoSanPham(data);
    } catch (error) {
      alert('Lỗi kết nối API');
    } finally {
      setLoading(false);
    }
  };

  const loadNhaCungCap = async () => {
    try {
      const data = await nhaCungCapAPI.getAll();
      setNhaCungCapList(data);
    } catch (error) {
      setNhaCungCapList([]);
    }
  };

  const loadDetailData = async (maLo) => {
    try {
      // Get all products and create a map for easy lookup
      const allSanPhams = await sanPhamAPI.getAll();
      const sanPhamMap = allSanPhams.reduce((map, sp) => {
        map[sp.MaSP] = sp;
        return map;
      }, {});

      // Get products in the current batch
      const tiepNhanData = await tiepNhanAPI.getAll().then(data => 
        data.filter(item => item.MaLo === maLo)
      );

      // Combine product info
      const sanPhamsInLo = tiepNhanData.map(tn => sanPhamMap[tn.MaSP]).filter(Boolean); // filter(Boolean) removes undefined/null if a product is not found

      setDetailData({
        sanPhamsInLo: sanPhamsInLo
      });
    } catch (error) {
      console.error('Lỗi khi tải chi tiết:', error);
    }
  };

  const handleViewDetail = async (lo) => {
    setSelectedLo(lo);
    await loadDetailData(lo.MaLo);
    setShowDetail(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loSanPhamAPI.create(formData);
      alert('Thêm lô sản phẩm thành công!');
      setShowForm(false);
      setFormData({ MaLo: '', NgaySanXuat: '', HanSuDung: '', SoLuong: '', MaPN: '', MaNCC: '' });
      loadData();
    } catch (error) {
      alert('Lỗi khi thêm lô sản phẩm');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa?')) {
      try {
        await loSanPhamAPI.delete(id);
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
      <h2>Quản lý Lô Sản Phẩm</h2>
      
      {!showForm ? (
        <button className="btn-add" onClick={() => setShowForm(true)}>
          + Thêm lô sản phẩm mới
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Mã lô:</label>
            <input
              type="text"
              name="MaLo"
              value={formData.MaLo}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Ngày sản xuất:</label>
            <input
              type="date"
              name="NgaySanXuat"
              value={formData.NgaySanXuat}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Hạn sử dụng:</label>
            <input
              type="date"
              name="HanSuDung"
              value={formData.HanSuDung}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Số lượng:</label>
            <input
              type="number"
              name="SoLuong"
              value={formData.SoLuong}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Mã phiếu nhập:</label>
            <input
              type="text"
              name="MaPN"
              value={formData.MaPN}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Mã nhà cung cấp:</label>
            <select
              name="MaNCC"
              value={formData.MaNCC}
              onChange={e => setFormData({ ...formData, MaNCC: e.target.value })}
              required
            >
              <option value="">Chọn nhà cung cấp</option>
              {nhaCungCapList.map(ncc => (
                <option key={ncc.MaNCC} value={ncc.MaNCC}>{ncc.MaNCC} - {ncc.TenNCC}</option>
              ))}
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-save">Lưu</button>
            <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>
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
              <th>Mã lô</th>
              <th>Ngày SX</th>
              <th>Hạn SD</th>
              <th>Số lượng</th>
              <th>Mã PN</th>
              <th>Mã NCC</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {losanpham.map((lo) => (
              <tr key={lo.MaLo}>
                <td>{lo.MaLo}</td>
                <td>{lo.NgaySanXuat}</td>
                <td>{lo.HanSuDung}</td>
                <td>{lo.SoLuong}</td>
                <td>{lo.MaPN}</td>
                <td>{lo.MaNCC}</td>
                <td>
                  <button className="btn-view" onClick={() => handleViewDetail(lo)}>
                    Chi tiết
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(lo.MaLo)}
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
      {showDetail && selectedLo && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Chi tiết lô sản phẩm: {selectedLo.MaLo}</h3>
              <button className="modal-close" onClick={() => setShowDetail(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h4>Thông tin lô</h4>
                <p><strong>Mã lô:</strong> {selectedLo.MaLo}</p>
                <p><strong>Ngày sản xuất:</strong> {selectedLo.NgaySanXuat}</p>
                <p><strong>Hạn sử dụng:</strong> {selectedLo.HanSuDung}</p>
                <p><strong>Số lượng:</strong> {selectedLo.SoLuong}</p>
                <p><strong>Mã phiếu nhập:</strong> {selectedLo.MaPN}</p>
              </div>

              <div className="detail-section">
                <h4>Sản phẩm trong lô (Tiếp Nhận)</h4>
                {detailData.sanPhamsInLo.length > 0 ? (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Mã SP</th>
                        <th>Tên Sản Phẩm</th>
                        <th>Đơn Vị Tính</th>
                        <th>Mô Tả</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailData.sanPhamsInLo.map((sp, index) => (
                        <tr key={index}>
                          <td>{sp.MaSP}</td>
                          <td>{sp.TenSP}</td>
                          <td>{sp.DonViTinh}</td>
                          <td>{sp.MoTa}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>Chưa có sản phẩm nào trong lô này</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoSanPhamPage; 