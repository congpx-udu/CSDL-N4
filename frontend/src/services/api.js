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

  // GET single item
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

  // POST new item
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

  // PUT update item
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

  // DELETE item
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

// Specific API functions for each entity
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