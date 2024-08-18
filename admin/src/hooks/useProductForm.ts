import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProduct, createProduct, updateProduct } from "../store/thunks/productThunks";
import { useAppDispatch } from "../store";
import { Product, RootState } from "../types";

export const useProductForm = (id?: string) => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { selectedProduct, status, error } = useSelector((state: RootState) => state.product);

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

	useEffect(() => {
		if (id) {
			dispatch(fetchProduct(id));
		}
	}, [dispatch, id]);

	useEffect(() => {
		if (selectedProduct) {
			setFormData(selectedProduct);
			setImagePreviews(selectedProduct.images);
		}
	}, [selectedProduct]);

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
				await dispatch(updateProduct({ id, productData })).unwrap();
			} else {
				await dispatch(createProduct(productData)).unwrap();
			}
			navigate("/products");
		} catch (error) {
			console.error("Failed to save product:", error);
		}
	};

	const removeImage = (index: number) => {
		setImagePreviews((prev) => prev.filter((_, i) => i !== index));
		setImageFiles((prev) => prev.filter((_, i) => i !== index));
	};

	return {
		formData,
		imagePreviews,
		status,
		error,
		handleChange,
		handleImageChange,
		handleSubmit,
		removeImage,
	};
};
