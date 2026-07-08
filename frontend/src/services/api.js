import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If server returns 401, clear auth and redirect to login
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default API;

// Convenience methods grouped by feature
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login:    (data) => API.post('/auth/login', data),
};

export const projectAPI = {
  getOpen:    ()          => API.get('/projects/open'),
  search:     (q)         => API.get('/projects/search', { params: { q } }),
  getMy:      ()          => API.get('/projects/my'),
  getById:    (id)        => API.get(`/projects/${id}`),
  create:     (data)      => API.post('/projects', data),
};

export const bidAPI = {
  getBids:    (projectId) => API.get(`/projects/${projectId}/bids`),
  placeBid:   (projectId, data) => API.post(`/projects/${projectId}/bids`, data),
  getMyBids:  ()          => API.get('/bids/my'),
  acceptBid:  (bidId)     => API.put(`/bids/${bidId}/accept`),
};

export const milestoneAPI = {
  getAll:   (contractId)             => API.get(`/contracts/${contractId}/milestones`),
  create:   (contractId, data)       => API.post(`/contracts/${contractId}/milestones`, data),
  update:   (milestoneId, data)      => API.put(`/milestones/${milestoneId}`, data),
  submit:   (milestoneId)            => API.put(`/milestones/${milestoneId}/submit`),
  approve:  (milestoneId)            => API.put(`/milestones/${milestoneId}/approve`),
  reject:   (milestoneId)            => API.put(`/milestones/${milestoneId}/reject`),
  delete:   (milestoneId)            => API.delete(`/milestones/${milestoneId}`),
};

export const subReqAPI = {
  getCategories: ()                       => API.get('/categories'),
  getPublic:    ()                       => API.get('/sub-requirements/public'),
  getForContract: (contractId)           => API.get(`/contracts/${contractId}/sub-requirements`),
  create:       (contractId, data)       => API.post(`/contracts/${contractId}/sub-requirements`, data),
  approve:      (subReqId)              => API.put(`/sub-requirements/${subReqId}/approve`),
  getBids:      (subReqId)              => API.get(`/sub-requirements/${subReqId}/bids`),
  placeBid:     (subReqId, data)        => API.post(`/sub-requirements/${subReqId}/bids`, data),
  acceptBid:    (subBidId)             => API.put(`/sub-req-bids/${subBidId}/accept`),
};
