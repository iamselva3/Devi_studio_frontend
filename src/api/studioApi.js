import { api } from "./axiosInstance.js";

export const getSettings = () => api.get("/settings");
export const updateSettings = (data) => api.put("/settings", data);
export const uploadHeroImage = (formData) =>
  api.post("/settings/hero", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const uploadSettingsImage = (formData) =>
  api.post("/settings/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const deleteSettingsImage = (key) => api.delete("/settings/image", { data: { key } });
export const deleteHeroImage = (imageId) => api.delete(`/settings/hero/${imageId}`);

export const getTestimonials = () => api.get("/testimonials");
export const getAllTestimonialsAdmin = () => api.get("/testimonials/all");
export const createTestimonial = (data) => api.post("/testimonials", data);
export const updateTestimonial = (id, data) => api.put(`/testimonials/${id}`, data);
export const deleteTestimonial = (id) => api.delete(`/testimonials/${id}`);
