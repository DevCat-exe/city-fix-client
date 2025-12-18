import api from './axios';

// Auth
export const verifyToken = (token) => {
  if (token) {
    return api.post('/auth/verify', { token }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
  return api.post('/auth/verify', { token });
};
export const getCurrentUser = () => api.get('/users/me');

// Users
export const getAllUsers = (params) => api.get('/users', { params });
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const toggleBlockUser = (id) => api.put(`/users/${id}/block`);
export const createStaff = (data) => api.post('/users/staff', data);
export const deleteStaff = (id) => api.delete(`/users/staff/${id}`);

// Issues
export const getAllIssues = (params) => api.get('/issues', { params });
export const getIssueById = (id) => api.get(`/issues/${id}`);
export const createIssue = (data) => api.post('/issues', data);
export const updateIssue = (id, data) => api.put(`/issues/${id}`, data);
export const deleteIssue = (id) => api.delete(`/issues/${id}`);
export const assignStaff = (id, staffId) => api.put(`/issues/${id}/assign`, { staffId });
export const changeStatus = (id, status, note) => api.put(`/issues/${id}/status`, { status, note });
export const boostIssue = (id) => api.put(`/issues/${id}/boost`);
export const getTimeline = (id) => api.get(`/issues/${id}/timeline`);

// Votes
export const upvoteIssue = (id) => api.post(`/issues/${id}/upvote`);
export const getVotes = (id) => api.get(`/issues/${id}/votes`);

// Payments
export const createCheckoutSession = (data) => api.post('/payments/create-checkout-session', data);
export const createPaymentIntent = (data) => api.post('/payments/create-intent', data);
export const processPaymentSuccess = (data) => api.post('/payments/confirm-payment', data);
export const getAllPayments = (params) => api.get('/payments', { params });
export const getInvoice = (id) => api.get(`/payments/${id}/invoice`, { responseType: 'blob' });
export const getMyPayments = () => api.get('/payments/my');

// Upload
export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return api.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const uploadMultipleImages = (files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('images', file));
  return api.post('/upload/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
