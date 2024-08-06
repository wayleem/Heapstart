import axios, { AxiosResponse } from "axios";

const adminApi = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	headers: {
		"Admin-Token": import.meta.env.VITE_ADMIN_TOKEN,
	},
	withCredentials: true,
});

adminApi.defaults.withCredentials = true;

export const loginAdmin = (username: string, password: string) =>
	adminApi.post("/api/auth/admin/login", { username, password });

export const getProducts = (): Promise<AxiosResponse<Product[]>> => adminApi.get<Product[]>("/api/products");
export const getProduct = (id: string): Promise<AxiosResponse<Product>> => adminApi.get<Product>(`/api/products/${id}`);
export const createProduct = (productData: FormData) =>
	adminApi.post<Product>("/api/products", productData, {
		headers: { "Content-Type": "multipart/form-data" },
	});

export const updateProduct = (id: string, productData: FormData) =>
	adminApi.put<Product>(`/api/products/${id}`, productData, {
		headers: { "Content-Type": "multipart/form-data" },
	});
export const deleteProduct = (id: string): Promise<AxiosResponse<void>> => adminApi.delete(`/api/products/${id}`);

export default adminApi;
