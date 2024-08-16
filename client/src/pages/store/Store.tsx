import React from "react";
import { useProductList } from "@hooks/product/useProductList";
import { useCart } from "@hooks/cart/useCart";
import { Product } from "@types";

const Store: React.FC = () => {
	const { products, status, error } = useProductList();
	const { handleAddToCart } = useCart();

	if (status === "loading") return <div>Loading...</div>;
	if (status === "failed") return <div>Error: {error}</div>;

	return (
		<div>
			{products.map((product: Product) => (
				<div key={product._id}>
					<h2>{product.name}</h2>
					<p>${product.price}</p>
					<button onClick={() => handleAddToCart(product._id, 1)}>Add to Cart</button>
				</div>
			))}
		</div>
	);
};

export default Store;
