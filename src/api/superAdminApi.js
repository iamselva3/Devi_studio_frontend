import { superAdminApi } from "./axiosInstance.js";

export const superAdminLogin = (data) => superAdminApi.post("/login", data);
export const getStats = () => superAdminApi.get("/stats");
export const getAllTenants = () => superAdminApi.get("/tenants");
export const createTenant = (data) => superAdminApi.post("/tenants", data);
export const updateTenant = (id, data) => superAdminApi.put(`/tenants/${id}`, data);
export const deleteTenant = (id) => superAdminApi.delete(`/tenants/${id}`);
export const resetAdminPassword = (id, data) => superAdminApi.put(`/tenants/${id}/reset-password`, data);
