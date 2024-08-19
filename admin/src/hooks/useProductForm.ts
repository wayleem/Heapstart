import { useState, useEffect } from "react";
import { useAppDispatch } from "@store/index";
import { createProduct, updateProductDetails, fetchProduct } from "@store/thunks/productThunks";
import { useNavigate } from "react-router-dom";
import { Product, ProductFormData } from "@types";

export const useProductForm = (id?: string) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductFormData>({
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
          setImagePreviews(product.images);
          setStatus("succeeded");
        })
        .catch((err: Error) => {
          setError(err.message || "An error occurred");
          setStatus("failed");
        });
    }
  }, [id, dispatch]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach(URL.revokeObjectURL);
    };
  }, [imagePreviews]);

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

      // Only append new File objects as new images
      formData.images.forEach((image) => {
        if (image instanceof File) {
          productData.append('newImages', image);
        }
      });

      // Send existing image URLs as a separate field
      const existingImageUrls = formData.images.filter(image => typeof image === 'string');
      productData.append('existingImages', JSON.stringify(existingImageUrls));

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

  return {
    formData,
    setFormData,
    imagePreviews,
    setImagePreviews,
    status,
    error,
    handleChange,
    handleSubmit,
  };
};
