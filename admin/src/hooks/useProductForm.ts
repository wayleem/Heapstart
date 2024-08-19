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

		const formDataToSend = new FormData();

		// Append all non-file fields
		Object.entries(formData).forEach(([key, value]) => {
			if (key !== "images") {
				formDataToSend.append(key, value as string | Blob); // Append string or Blob types
			}
		});

		// Append file objects (ensure they are files)
		(formData.images || []).forEach((value) => {
			if (value instanceof File) {
				formDataToSend.append("images", value);
			}
		});

		try {
			if (id) {
				await dispatch(updateProductDetails({ id, productData: formDataToSend }));
			} else {
				await dispatch(createProduct(formDataToSend));
			}
		} catch (err) {
			console.error("Failed to submit the form", err);
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
