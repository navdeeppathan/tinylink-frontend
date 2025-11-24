import axios from "axios";

const API_BASE = import.meta.env.REACT_APP_API_URL || "http://localhost:5000";

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
