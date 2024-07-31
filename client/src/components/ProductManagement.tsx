import React, { useState, useEffect } from "react";
import ProductForm from "./ProductForm";
import ProductList from "./ProductList";
import { api } from "../hooks/ApiHooks";

const ProductManagement: React.FC = () => {
	const [products, setProducts] = useState<Product[]>([]);
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

	useEffect(() => {
		fetchProducts();
	}, []);

	const fetchProducts = async () => {
		try {
			const response = await api.get<Product[]>("/api/products");
			setProducts(response.data);
		} catch (error) {
			console.error("Error fetching products:", error);
			setProducts([]);
		}
	};

	const handleProductSubmit = async (productData: ProductData, images: File[]) => {
		try {
			const formData = new FormData();
			Object.keys(productData).forEach((key) => {
				formData.append(key, productData[key as keyof ProductData].toString());
			});
			images.forEach((image) => {
				formData.append("images", image);
			});

			if (selectedProduct) {
				await api.put(`/api/products/${selectedProduct._id}`, formData, {
					headers: { "Content-Type": "multipart/form-data" },
				});
			} else {
				await api.post("/api/products", formData, {
					headers: { "Content-Type": "multipart/form-data" },
				});
			}
			fetchProducts();
			setSelectedProduct(null);
		} catch (error) {
			console.error("Error submitting product:", error);
		}
	};

	const handleProductEdit = (product: Product) => {
		setSelectedProduct(product);
	};

	const handleProductDeactivate = async (productId: string) => {
		try {
			await api.delete(`/api/products/${productId}`);
			fetchProducts();
		} catch (error) {
			console.error("Error deactivating product:", error);
		}
	};

	return (
		<div>
			<h2 className="text-2xl font-bold mb-4">Product Management</h2>
			<ProductForm onSubmit={handleProductSubmit} product={selectedProduct} />
			{products.length > 0 ? (
				<ProductList products={products} onEdit={handleProductEdit} onDeactivate={handleProductDeactivate} />
			) : (
				<p>No products available.</p>
			)}
		</div>
	);
};

export default ProductManagement;
