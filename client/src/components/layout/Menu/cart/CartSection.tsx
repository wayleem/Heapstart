import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import CartItem from "./CartItem";
import Pagination from "../../../common/Pagination";
import { CartIcon } from "../../../icons";
import NavItem from "../nav/NavItem";
import { useCart } from "@hooks/cart/useCart";

interface CartSectionProps {
	isCartExpanded: boolean;
	toggleCart: () => void;
	currentPage: number;
	setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
	handleLinkClick: (isCartLink: boolean) => void;
}

const CartSection: React.FC<CartSectionProps> = ({
	isCartExpanded,
	toggleCart,
	currentPage,
	setCurrentPage,
	handleLinkClick,
}) => {
	const { cartProducts, handleRemoveFromCart, calculateTotal } = useCart();
	const itemsPerPage = 10;
	const totalPages = Math.ceil(cartProducts.length / itemsPerPage);
	const displayedItems = cartProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
	const cartTotal = calculateTotal();
	const isCartEmpty = cartProducts.length === 0;

	return (
		<>
			<button
				onClick={toggleCart}
				className="flex items-center justify-between w-full text-text hover:text-primary text-lg font-heading font-semibold py-3 px-4 transition-colors duration-200"
			>
				<span className="flex items-center space-x-3">
					<CartIcon className="w-6 h-6" />
					<span>Your Cart</span>
				</span>
				<span className="badge badge-secondary badge-sm">
					{cartProducts.reduce((total, item) => total + item.quantity, 0)}
				</span>
			</button>
			<AnimatePresence>
				{isCartExpanded && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.3 }}
						className="overflow-hidden"
					>
						<div className="py-2 px-4 space-y-4">
							{isCartEmpty ? (
								<p className="text-center text-gray-500">Your cart is empty</p>
							) : (
								<>
									{displayedItems.map(({ product, quantity }) =>
										product ? (
											<CartItem
												key={product._id}
												product={product}
												quantity={quantity}
												onRemove={() => handleRemoveFromCart(product._id)}
											/>
										) : (
											<p>Loading product...</p>
										),
									)}
									{totalPages > 1 && (
										<Pagination
											currentPage={currentPage}
											totalPages={totalPages}
											onPrevious={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
											onNext={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
										/>
									)}
									<div className="flex justify-between items-center text-lg font-semibold mt-4 pt-4 border-t border-gray-200">
										<h3>Total:</h3>
										<p>${cartTotal.toFixed(2)}</p>
									</div>
									<NavItem
										to="/checkout"
										icon={<CartIcon className="w-5 h-5" />}
										isCartLink={true}
										onClick={() => handleLinkClick(true)}
										className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors text-center"
									>
										Checkout
									</NavItem>
								</>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
};

export default CartSection;
