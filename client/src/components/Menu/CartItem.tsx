// src/components/Menu/CartItem.tsx

import React from "react";
import { TrashIcon } from "../icons/";

interface CartItemProps {
	product: Product;
	quantity: number;
}

interface ExtendedCartItemProps extends CartItemProps {
	onRemove: (productId: string) => void;
}

const CartItem: React.FC<ExtendedCartItemProps> = ({ product, quantity, onRemove }) => (
	<div className="flex justify-between items-center text-sm">
		<div className="flex items-center">
			<div className="w-8 h-8 bg-gray-200 rounded-md mr-2"></div>
			<div>
				<h3 className="font-medium">{product.name}</h3>
				<p className="text-gray-600">Qty: {quantity}</p>
			</div>
		</div>
		<div className="flex items-center">
			<p className="font-medium mr-2">${(product.price * quantity).toFixed(2)}</p>
			<button
				onClick={() => onRemove(product._id)}
				className="text-red-500 hover:text-red-700 transition-colors"
				aria-label="Remove item"
			>
				<TrashIcon className="w-4 h-4" />
			</button>
		</div>
	</div>
);

export default CartItem;
