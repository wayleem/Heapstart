import React from "react";
import { Link } from "react-router-dom";

const StorePage: React.FC = () => {
	const products = [
		{ id: 1, name: "Product 1", price: 19.99 },
		{ id: 2, name: "Product 2", price: 29.99 },
		{ id: 3, name: "Product 3", price: 39.99 },
		{ id: 4, name: "Product 4", price: 49.99 },
	];

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-6">Our Store</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{products.map((product) => (
					<div key={product.id} className="border rounded-lg p-4 shadow-md">
						<div className="w-full h-48 bg-gray-200 rounded-md mb-4"></div>
						<h2 className="text-xl font-semibold">{product.name}</h2>
						<p className="text-gray-600">${product.price.toFixed(2)}</p>
						<button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
							Add to Cart
						</button>
					</div>
				))}
			</div>
		</div>
	);
};

export default StorePage;
