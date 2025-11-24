import axios from "axios";

const API_BASE =
  import.meta.env.REACT_APP_API_URL ||
  "https://tinylink-backend-1.onrender.com";

export const api = {
  createLink: (data) => axios.post(`${API_BASE}/api/links`, data),
  getLinks: () => axios.get(`${API_BASE}/api/links`),
  getLink: (code) => axios.get(`${API_BASE}/api/links/${code}`),
  deleteLink: (code) => axios.delete(`${API_BASE}/api/links/${code}`),
  healthCheck: () => axios.get(`${API_BASE}/healthz`),
};

export const getShortUrl = (code) => {
  return `${API_BASE}/${code}`;
};
