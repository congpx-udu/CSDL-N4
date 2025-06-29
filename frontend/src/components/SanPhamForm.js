import React, { useState, useEffect } from 'react';
import { khoHangAPI } from '../services/api';

const SanPhamForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    MaSP: '',
    TenSP: '',
    MoTa: '',
    LoaiSP: '',
    GiaBan: '',
    DonViTinh: '',
    MaKho: ''
  });
  
  const [khoHangList, setKhoHangList] = useState([]);

  useEffect(() => {
    // Load danh sách kho hàng để chọn
    const loadKhoHang = async () => {
      try {
        const data = await khoHangAPI.getAll();
        setKhoHangList(data);
      } catch (error) {
        console.error('Error loading kho hang:', error);
      }
    };
    loadKhoHang();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      setFormData({
        MaSP: '',
        TenSP: '',
        MoTa: '',
        LoaiSP: '',
        GiaBan: '',
        DonViTinh: '',
        MaKho: ''
      });
    } catch (error) {
      alert('Lỗi khi thêm sản phẩm');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-form">
      <h3>Thêm sản phẩm mới</h3>
      
      <input
        type="text"
        placeholder="Mã sản phẩm"
        value={formData.MaSP}
        onChange={(e) => setFormData({...formData, MaSP: e.target.value})}
        required
      />
      
      <input
        type="text"
        placeholder="Tên sản phẩm"
        value={formData.TenSP}
        onChange={(e) => setFormData({...formData, TenSP: e.target.value})}
        required
      />
      
      <textarea
        placeholder="Mô tả"
        value={formData.MoTa}
        onChange={(e) => setFormData({...formData, MoTa: e.target.value})}
        style={{
          width: '100%',
          padding: '12px',
          marginBottom: '15px',
          border: '1px solid #ddd',
          borderRadius: '6px',
          fontSize: '14px',
          minHeight: '80px',
          resize: 'vertical'
        }}
      />
      
      <input
        type="text"
        placeholder="Loại sản phẩm"
        value={formData.LoaiSP}
        onChange={(e) => setFormData({...formData, LoaiSP: e.target.value})}
        required
      />
      
      <input
        type="number"
        placeholder="Giá bán"
        value={formData.GiaBan}
        onChange={(e) => setFormData({...formData, GiaBan: e.target.value})}
        required
      />
      
      <input
        type="text"
        placeholder="Đơn vị tính"
        value={formData.DonViTinh}
        onChange={(e) => setFormData({...formData, DonViTinh: e.target.value})}
        required
      />
      
      <select
        value={formData.MaKho}
        onChange={(e) => setFormData({...formData, MaKho: e.target.value})}
        required
        style={{
          width: '100%',
          padding: '12px',
          marginBottom: '15px',
          border: '1px solid #ddd',
          borderRadius: '6px',
          fontSize: '14px'
        }}
      >
        <option value="">Chọn kho hàng</option>
        {khoHangList.map((kho) => (
          <option key={kho.MaKho} value={kho.MaKho}>
            {kho.MaKho} - {kho.TenKho}
          </option>
        ))}
      </select>
      
      <div style={{ display: 'flex', gap: '10px' }}>
        <button type="submit" className="btn-add">Thêm sản phẩm</button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-cancel">
            Hủy
          </button>
        )}
      </div>
    </form>
  );
};

export default SanPhamForm; 