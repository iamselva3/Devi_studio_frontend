import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const TENANT_SLUG = import.meta.env.VITE_TENANT_SLUG || "devi-studio";

export const api = axios.create({
  baseURL: `${API_URL}/api/studio/${TENANT_SLUG}`,
  headers: { "Content-Type": "application/json" },
});

export const superAdminApi = axios.create({
  baseURL: `${API_URL}/api/superadmin`,
  headers: { "Content-Type": "application/json" },
});

// Inject JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

superAdminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("superadmin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_info");
    }
    return Promise.reject(err);
  }
);

export const TENANT_SLUG_VALUE = TENANT_SLUG;
export const API_BASE = API_URL;
