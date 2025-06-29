import React, { useState, useEffect } from 'react';
import { sanPhamAPI } from '../services/api';
import SanPhamForm from '../components/SanPhamForm';

const SanPhamPage = () => {
  const [sanpham, setSanpham] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await sanPhamAPI.getAll();
      setSanpham(data);
    } catch (error) {
      alert('Lỗi kết nối API');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    try {
      await sanPhamAPI.create(data);
      alert('Thêm sản phẩm thành công!');
      setShowForm(false);
      loadData();
    } catch (error) {
      alert('Lỗi khi thêm sản phẩm');
    }
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
      
      {!showForm ? (
        <button className="btn-add" onClick={() => setShowForm(true)}>
          + Thêm sản phẩm mới
        </button>
      ) : (
        <SanPhamForm 
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
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
            {sanpham.map((sp) => (
              <tr key={sp.MaSP}>
                <td>{sp.MaSP}</td>
                <td>{sp.TenSP}</td>
                <td>{sp.LoaiSP}</td>
                <td>{sp.GiaBan?.toLocaleString()}đ</td>
                <td>{sp.DonViTinh}</td>
                <td>{sp.MaKho}</td>
                <td>
                  <button className="btn-edit">Sửa</button>
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
    </div>
  );
};

export default SanPhamPage; 