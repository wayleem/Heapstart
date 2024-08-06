import React, { useState, useEffect, useCallback } from "react";
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

	const [imageFiles, setImageFiles] = useState<File[]>([]);
	const [imagePreviews, setImagePreviews] = useState<string[]>([]);

	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	useEffect(() => {
		if (id) {
			fetchProduct(id);
		} else if (initialProduct) {
			setFormData(initialProduct);
			setImagePreviews(initialProduct.images);
		}
	}, [id, initialProduct]);

	const fetchProduct = async (productId: string) => {
		try {
			const response = await getProduct(productId);
			setFormData(response.data);
			setImagePreviews(response.data.images);
		} catch (error) {
			console.error("Failed to fetch product:", error);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const files = Array.from(e.target.files);
			setImageFiles(files);

			const previews = files.map((file) => URL.createObjectURL(file));
			setImagePreviews(previews);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const productData = new FormData();
			Object.entries(formData).forEach(([key, value]) => {
				if (key !== "images" && key !== "_id") {
					productData.append(key, value.toString());
				}
			});
			imageFiles.forEach((file) => {
				productData.append("images", file);
			});
			if (id) {
				await updateProduct(id, productData);
			} else {
				await createProduct(productData);
			}
			onClose();
			navigate("/");
		} catch (error) {
			console.error("Failed to save product:", error.response?.data || error.message);
		}
	};

	const removeImage = useCallback((index: number) => {
		setImagePreviews((prev) => prev.filter((_, i) => i !== index));
		setImageFiles((prev) => prev.filter((_, i) => i !== index));
	}, []);

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
			<div>
				<label htmlFor="images" className="block text-sm font-medium text-gray-700">
					Images
				</label>
				<input
					type="file"
					id="images"
					name="images"
					onChange={handleImageChange}
					multiple
					accept="image/*"
					className="mt-1 block w-full"
				/>
			</div>

			<div className="flex flex-wrap gap-2 mt-2">
				{imagePreviews.map((preview, index) => (
					<div key={index} className="relative">
						<img src={preview} alt={`Preview ${index}`} className="w-24 h-24 object-cover rounded" />
						<button
							type="button"
							onClick={() => removeImage(index)}
							className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
						>
							&times;
						</button>
					</div>
				))}
			</div>

			<button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
				{id ? "Update Product" : "Add Product"}
			</button>
		</form>
	);
};

export default ProductForm;
