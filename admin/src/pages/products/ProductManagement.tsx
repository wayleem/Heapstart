import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useAppDispatch } from "@store/index";
import ProductForm from "@components/forms/ProductForm";
import { Product, RootState } from "@types";
import { fetchProducts, removeProduct } from "@store/thunks/productThunks";

const ProductManagement: React.FC = () => {
	const dispatch = useAppDispatch();
	const products = useSelector((state: RootState) => state.product.items);
	const status = useSelector((state: RootState) => state.product.status);
	const error = useSelector((state: RootState) => state.product.error);
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

	useEffect(() => {
		if (status === "idle") {
			dispatch(fetchProducts());
		}
	}, [status, dispatch]);

	const handleDelete = async (id: string) => {
		try {
			await dispatch(removeProduct(id)).unwrap();
		} catch (error) {
			console.error("Failed to delete product:", error);
		}
	};

	const handleEdit = (product: Product) => {
		setSelectedProduct(product);
	};

	const handleFormClose = () => {
		setSelectedProduct(null);
	};

	if (status === "loading") {
		return <div>Loading...</div>;
	}

	if (status === "failed") {
		return <div>Error: {error}</div>;
	}

	return (
		<div className="container mx-auto px-4">
			<h2 className="text-2xl font-semibold mb-4">Product Management</h2>

			{selectedProduct ? (
				<ProductForm product={selectedProduct} onClose={handleFormClose} />
			) : (
				<Link
					to="/add"
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 inline-block"
				>
					Add New Product
				</Link>
			)}

			<table className="min-w-full bg-white">
				<thead>
					<tr>
						<th className="py-2 px-4 border-b">Name</th>
						<th className="py-2 px-4 border-b">Price</th>
						<th className="py-2 px-4 border-b">Category</th>
						<th className="py-2 px-4 border-b">Actions</th>
					</tr>
				</thead>
				<tbody>
					{products.map((product) => (
						<tr key={product._id}>
							<td className="py-2 px-4 border-b">{product.name}</td>
							<td className="py-2 px-4 border-b">${product.price.toFixed(2)}</td>
							<td className="py-2 px-4 border-b">{product.category}</td>
							<td className="py-2 px-4 border-b">
								<button
									onClick={() => handleEdit(product)}
									className="text-blue-500 hover:text-blue-700 mr-2"
								>
									Edit
								</button>
								<button
									onClick={() => handleDelete(product._id)}
									className="text-red-500 hover:text-red-700"
								>
									Delete
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default ProductManagement;
