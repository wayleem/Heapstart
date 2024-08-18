import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN;

const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
		"Admin-Token": ADMIN_TOKEN,
	},
});

const multipartApi = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "multipart/form-data",
		"Admin-Token": ADMIN_TOKEN,
	},
});

export const loginAdmin = (credentials: { username: string; password: string }) =>
	api.post("/api/auth/admin/login", credentials);

export const logoutAdmin = () => api.post("/api/auth/admin/logout");

export const getAllProducts = () => api.get("/api/products");

export const getProductById = (id: string) => api.get(`/api/products/${id}`);

export const createNewProduct = (productData: FormData) => multipartApi.post("/api/products", productData);

export const updateExistingProduct = (id: string, productData: FormData) =>
	multipartApi.put(`/api/products/${id}`, productData);

export const deleteProduct = (id: string) => api.delete(`/api/products/${id}`);

export default api;
