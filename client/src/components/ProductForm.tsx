import React, { useState, useEffect } from "react";
import { api } from '../hooks/ApiHooks'

interface ProductFormProps {
  onSubmit: (productData: any) => void;
  product?: any;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, product }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    supplier_id: "",
    supplier_cost: 0,
    supplier_link: "",
    category: "",
  });
  const [images, setImages] = useState<File[]>([]);

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    if (images.length > 0 && product) {
      const formData = new FormData();
      images.forEach((image) => formData.append("images", image));
      try {
        await api.post(`/api/products/${product._id}/images`, formData);
      } catch (error) {
        console.error("Error uploading images:", error);
      }
    }
    setFormData({
      name: "",
      description: "",
      price: 0,
      supplier_id: "",
      supplier_cost: 0,
      supplier_link: "",
      category: "",
    });
    setImages([]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
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
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
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
          required
          min="0"
          step="0.01"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
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
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
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
          required
          min="0"
          step="0.01"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
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
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
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
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
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
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {product ? "Update Product" : "Add Product"}
      </button>
    </form>
  );
};

export default ProductForm;
