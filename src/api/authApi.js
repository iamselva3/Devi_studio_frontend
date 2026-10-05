import { api } from "./axiosInstance.js";

export const login = (data) => api.post("/auth/login", data);
export const changePassword = (data) => api.put("/auth/change-password", data);
