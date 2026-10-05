import { api } from "./axiosInstance.js";

export const getAllClients = () => api.get("/clients");
export const getClientByName = (name) => api.get(`/clients/${encodeURIComponent(name)}`);
export const getImagesByCategory = (category) => api.get(`/images/category/${category}`);

export const uploadImages = (formData) =>
  api.post("/clients/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });

export const deleteImage = (clientName, imageId) =>
  api.delete(`/clients/${encodeURIComponent(clientName)}/images/${imageId}`);

export const deleteClient = (clientName) =>
  api.delete(`/clients/${encodeURIComponent(clientName)}`);

export const renameClient = (clientName, newName) =>
  api.put(`/clients/${encodeURIComponent(clientName)}`, { newName });

export const getStorageSummary = () => api.get("/storage");
