import React, { useState } from "react";
import { useProductList } from "@hooks/product/useProductList";
import { useCart } from "@hooks/cart/useCart";
import { Product } from "@types";

const Store: React.FC = () => {
	const { products, status, error } = useProductList();
	const { handleAddToCart } = useCart();
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");

	if (status === "loading") return <div className="text-center py-10">Loading...</div>;
	if (status === "failed") return <div className="text-center py-10 text-red-500">Error: {error}</div>;

	const categories = ["all", ...new Set(products.map((product) => product.category))];

	const filteredProducts = products.filter(
		(product) =>
			product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
			(selectedCategory === "all" || product.category === selectedCategory),
	);

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-6">
				<input
					type="text"
					placeholder="Search products..."
					className="w-full p-2 border rounded"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</div>
			<div className="mb-6">
				<select
					className="w-full p-2 border rounded"
					value={selectedCategory}
					onChange={(e) => setSelectedCategory(e.target.value)}
				>
					{categories.map((category) => (
						<option key={category} value={category}>
							{category.charAt(0).toUpperCase() + category.slice(1)}
						</option>
					))}
				</select>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
				{filteredProducts.map((product: Product) => (
					<div key={product._id} className="border rounded-lg overflow-hidden shadow-lg">
						{product.images && product.images.length > 0 ? (
							<img
								src={`data:image/jpeg;base64,${product.images[0]}`}
								alt={product.name}
								className="w-full h-48 object-cover"
							/>
						) : (
							<div className="w-full h-48 bg-gray-200 flex items-center justify-center">No Image</div>
						)}
						<div className="p-4">
							<h2 className="text-xl font-semibold mb-2">{product.name}</h2>
							<p className="text-gray-600 mb-2">{product.category}</p>
							<p className="text-lg font-bold mb-4">${product.price.toFixed(2)}</p>
							<button
								onClick={() => handleAddToCart(product._id, 1)}
								className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
							>
								Add to Cart
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Store;
