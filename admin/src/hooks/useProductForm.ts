import { useState, useEffect } from "react";
import { useAppDispatch } from "@store/index";
import { createProduct, updateProductDetails, fetchProduct } from "@store/thunks/productThunks";
import { useNavigate } from "react-router-dom";
import { Product } from "@types";

export const useProductForm = (id?: string) => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
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
	const [imagePreviews, setImagePreviews] = useState<string[]>([]);
	const [status, setStatus] = useState<"idle" | "loading" | "succeeded" | "failed">("idle");
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (id) {
			setStatus("loading");
			dispatch(fetchProduct(id))
				.unwrap()
				.then((product: Product) => {
					setFormData(product);
					setImagePreviews(
						product.images.map((img: string | File) =>
							typeof img === "string" ? img : URL.createObjectURL(img),
						),
					);
					setStatus("succeeded");
				})
				.catch((err: Error) => {
					setError(err.message || "An error occurred");
					setStatus("failed");
				});
		}
	}, [id, dispatch]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setStatus("loading");
		try {
			const productData = new FormData();
			Object.entries(formData).forEach(([key, value]) => {
				if (key !== "images" && key !== "_id") {
					productData.append(key, value.toString());
				}
			});

			if (formData.images && formData.images.length > 0) {
				formData.images.forEach((image, index) => {
					if (image instanceof File) {
						productData.append(`images`, image);
					} else if (typeof image === "string") {
						productData.append(`existingImages[${index}]`, image);
					}
				});
			}

			if (id) {
				await dispatch(updateProductDetails({ id, productData })).unwrap();
			} else {
				await dispatch(createProduct(productData)).unwrap();
			}
			navigate("/products");
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : "An error occurred");
			setStatus("failed");
		}
	};

	const removeImage = (index: number) => {
		setFormData((prev) => ({
			...prev,
			images: prev.images.filter((_, i) => i !== index),
		}));
		setImagePreviews((prev) => prev.filter((_, i) => i !== index));
	};

	return {
		formData,
		setFormData,
		imagePreviews,
		setImagePreviews,
		status,
		error,
		handleChange,
		handleSubmit,
		removeImage,
	};
};
