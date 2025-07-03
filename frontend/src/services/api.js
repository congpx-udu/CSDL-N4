const API_BASE = 'http://localhost:8000';

// Generic API functions
export const api = {
  // GET all items
  getAll: async (endpoint) => {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  },

  // GET item by ID
  getById: async (endpoint, id) => {
    try {
      const response = await fetch(`${API_BASE}${endpoint}${id}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error fetching item:', error);
      throw error;
    }
  },

  create: async (endpoint, data) => {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error creating item:', error);
      throw error;
    }
  },

  update: async (endpoint, id, data) => {
    try {
      const response = await fetch(`${API_BASE}${endpoint}${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  },

  delete: async (endpoint, id) => {
    try {
      const response = await fetch(`${API_BASE}${endpoint}${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  },
};

export const khoHangAPI = {
  getAll: () => api.getAll('/khohang/'),
  getById: (id) => api.getById('/khohang/', id),
  create: (data) => api.create('/khohang/', data),
  update: (id, data) => api.update('/khohang/', id, data),
  delete: (id) => api.delete('/khohang/', id),
};

export const sanPhamAPI = {
  getAll: () => api.getAll('/sanpham/'),
  getById: (id) => api.getById('/sanpham/', id),
  create: (data) => api.create('/sanpham/', data),
  update: (id, data) => api.update('/sanpham/', id, data),
  delete: (id) => api.delete('/sanpham/', id),
};

export const khachHangAPI = {
  getAll: () => api.getAll('/khachhang/'),
  getById: (id) => api.getById('/khachhang/', id),
  create: (data) => api.create('/khachhang/', data),
  update: (id, data) => api.update('/khachhang/', id, data),
  delete: (id) => api.delete('/khachhang/', id),
};

export const donHangAPI = {
  getAll: () => api.getAll('/dondathang/'),
  getById: (id) => api.getById('/dondathang/', id),
  create: (data) => api.create('/dondathang/', data),
  update: (id, data) => api.update('/dondathang/', id, data),
  delete: (id) => api.delete('/dondathang/', id),
};

export const nhaCungCapAPI = {
  getAll: () => api.getAll('/nhacungcap/'),
  getById: (id) => api.getById('/nhacungcap/', id),
  create: (data) => api.create('/nhacungcap/', data),
  update: (id, data) => api.update('/nhacungcap/', id, data),
  delete: (id) => api.delete('/nhacungcap/', id),
};

export const loSanPhamAPI = {
  getAll: () => api.getAll('/losanpham/'),
  getById: (id) => api.getById('/losanpham/', id),
  create: (data) => api.create('/losanpham/', data),
  update: (id, data) => api.update('/losanpham/', id, data),
  delete: (id) => api.delete('/losanpham/', id),
};

export const phieuNhapAPI = {
  getAll: () => api.getAll('/phieunhap/'),
  getById: (id) => api.getById('/phieunhap/', id),
  create: (data) => api.create('/phieunhap/', data),
  update: (id, data) => api.update('/phieunhap/', id, data),
  delete: (id) => api.delete('/phieunhap/', id),
};

export const phieuXuatAPI = {
  getAll: () => api.getAll('/phieuxuat/'),
  getById: (id) => api.getById('/phieuxuat/', id),
  create: (data) => api.create('/phieuxuat/', data),
  update: (id, data) => api.update('/phieuxuat/', id, data),
  delete: (id) => api.delete('/phieuxuat/', id),
};

export const tiepNhanAPI = {
  getAll: () => api.getAll('/tiepnhan/'),
  getById: (id) => api.getById('/tiepnhan/', id),
  create: (data) => api.create('/tiepnhan/', data),
  update: (id, data) => api.update('/tiepnhan/', id, data),
  delete: (id) => api.delete('/tiepnhan/', id),
};

export const chonAPI = {
  getAll: () => api.getAll('/chon/'),
  getById: (id) => api.getById('/chon/', id),
  create: (data) => api.create('/chon/', data),
  update: (id, data) => api.update('/chon/', id, data),
  delete: (id) => api.delete('/chon/', id),
};

export const thuocVeAPI = {
  getAll: () => api.getAll('/thuocve/'),
  getById: (id) => api.getById('/thuocve/', id),
  create: (data) => api.create('/thuocve/', data),
  update: (id, data) => api.update('/thuocve/', id, data),
  delete: (id) => api.delete('/thuocve/', id),
};

export const caNhanAPI = {
  getAll: () => api.getAll('/canhan/'),
  getById: (id) => api.getById('/canhan/', id),
  create: (data) => api.create('/canhan/', data),
  update: (id, data) => api.update('/canhan/', id, data),
  delete: (id) => api.delete('/canhan/', id),
};

export const doanhNghiepAPI = {
  getAll: () => api.getAll('/doanhnghiep/'),
  getById: (id) => api.getById('/doanhnghiep/', id),
  create: (data) => api.create('/doanhnghiep/', data),
  update: (id, data) => api.update('/doanhnghiep/', id, data),
  delete: (id) => api.delete('/doanhnghiep/', id),
};

export const khachHangSDTAPI = {
  getAll: () => api.getAll('/khachhang_sdt/'),
  getById: (id) => api.getById('/khachhang_sdt/', id),
  create: (data) => api.create('/khachhang_sdt/', data),
  update: (id, data) => api.update('/khachhang_sdt/', id, data),
  delete: (id) => api.delete('/khachhang_sdt/', id),
};

export const nhaCungCapSDTAPI = {
  getAll: () => api.getAll('/nhacungcap_sdt/'),
  getById: (id) => api.getById('/nhacungcap_sdt/', id),
  create: (data) => api.create('/nhacungcap_sdt/', data),
  update: (id, data) => api.update('/nhacungcap_sdt/', id, data),
  delete: (id) => api.delete('/nhacungcap_sdt/', id),
}; 