import { useAppSelector, useAppDispatch } from "@store/index";
import { selectCartItems } from "@store/slices/cartSlice";
import { addToCart, removeFromCart } from "@store/thunks/cartThunks";
import { selectAllProducts } from "@store/slices/productSlice";
import { Product } from "@types";

export const useCart = () => {
	const dispatch = useAppDispatch();
	const cartItems = useAppSelector(selectCartItems);
	const products = useAppSelector(selectAllProducts);

	const cartProducts = Object.entries(cartItems)
		.map(([productId, quantity]) => {
			const product = products.find((p: Product) => p._id === productId);
			return { product, quantity };
		})
		.filter((item): item is { product: Product; quantity: number } => item.product !== undefined);

	const handleAddToCart = async (productId: string, quantity: number) => {
		try {
			await dispatch(addToCart({ productId, quantity })).unwrap();
		} catch (error) {
			console.error("Error adding to cart:", error);
		}
	};

	const handleRemoveFromCart = async (productId: string) => {
		try {
			await dispatch(removeFromCart(productId)).unwrap();
		} catch (error) {
			console.error("Error removing from cart:", error);
		}
	};

	const calculateTotal = () => {
		return cartProducts.reduce((total, item) => {
			return total + item.product.price * item.quantity;
		}, 0);
	};

	return { cartProducts, handleAddToCart, handleRemoveFromCart, calculateTotal };
};
