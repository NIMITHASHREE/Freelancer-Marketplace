import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
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
  search:     (q)         => API.get(`/projects/search?q=${q}`),
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
