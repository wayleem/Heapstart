import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createProduct, updateProduct, getProduct } from "../api/adminApi";

interface ProductFormProps {
	product?: Product | null;
	onClose: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product: initialProduct, onClose }) => {
	const [formData, setFormData] = useState<Product>({
		_id: "",
		name: "",
		description: "",
		price: 0,
		supplier_id: "",
		supplier_cost: 0,
		supplier_link: "",
		category: "",
		images: [],
		isActive: true,
	});

	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	useEffect(() => {
		if (id) {
			fetchProduct(id);
		} else if (initialProduct) {
			setFormData(initialProduct);
		}
	}, [id, initialProduct]);

	const fetchProduct = async (productId: string) => {
		try {
			const response = await getProduct(productId);
			setFormData(response.data);
		} catch (error) {
			console.error("Failed to fetch product:", error);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			if (id) {
				await updateProduct(id, formData);
			} else {
				await createProduct(formData);
			}
			onClose();
			navigate("/");
		} catch (error) {
			console.error("Failed to save product:", error);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<h2 className="text-2xl font-semibold mb-4">{id ? "Edit Product" : "Add Product"}</h2>
			<div>
				<label htmlFor="name" className="block text-sm font-medium text-gray-700">
					Name
				</label>
				<input
					type="text"
					id="name"
					name="name"
					value={formData.name}
					onChange={handleChange}
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
					required
				/>
			</div>
			<div>
				<label htmlFor="description" className="block text-sm font-medium text-gray-700">
					Description
				</label>
				<textarea
					id="description"
					name="description"
					value={formData.description}
					onChange={handleChange}
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
				/>
			</div>
			<div>
				<label htmlFor="price" className="block text-sm font-medium text-gray-700">
					Price
				</label>
				<input
					type="number"
					id="price"
					name="price"
					value={formData.price}
					onChange={handleChange}
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
					required
				/>
			</div>
			<div>
				<label htmlFor="supplier_id" className="block text-sm font-medium text-gray-700">
					Supplier ID
				</label>
				<input
					type="text"
					id="supplier_id"
					name="supplier_id"
					value={formData.supplier_id}
					onChange={handleChange}
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
					required
				/>
			</div>
			<div>
				<label htmlFor="supplier_cost" className="block text-sm font-medium text-gray-700">
					Supplier Cost
				</label>
				<input
					type="number"
					id="supplier_cost"
					name="supplier_cost"
					value={formData.supplier_cost}
					onChange={handleChange}
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
					required
				/>
			</div>
			<div>
				<label htmlFor="supplier_link" className="block text-sm font-medium text-gray-700">
					Supplier Link
				</label>
				<input
					type="url"
					id="supplier_link"
					name="supplier_link"
					value={formData.supplier_link}
					onChange={handleChange}
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
					required
				/>
			</div>
			<div>
				<label htmlFor="category" className="block text-sm font-medium text-gray-700">
					Category
				</label>
				<input
					type="text"
					id="category"
					name="category"
					value={formData.category}
					onChange={handleChange}
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
				/>
			</div>
			<button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
				{id ? "Update Product" : "Add Product"}
			</button>
		</form>
	);
};

export default ProductForm;
