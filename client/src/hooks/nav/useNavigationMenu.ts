import { useState, useEffect, useCallback, useMemo } from "react";
import { debounce } from "lodash";
import { useAppDispatch, useAppSelector } from "@store/index";
import { selectCartItems } from "@store/slices/cartSlice";
import { selectAllProducts, selectProductsStatus } from "@store/slices/productSlice";
import { fetchCart } from "@store/thunks/cartThunks";
import { Product } from "@types";

export const useNavigationMenu = () => {
	const dispatch = useAppDispatch();
	const cartItems = useAppSelector(selectCartItems);
	const cartStatus = useAppSelector((state) => state.cart.status);
	const productsStatus = useAppSelector(selectProductsStatus);
	const allProducts = useAppSelector(selectAllProducts);
	const [isCartExpanded, setIsCartExpanded] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

	const isLoading = cartStatus === "loading" || productsStatus === "loading";

	const debouncedFetchCart = useCallback(
		debounce(() => {
			if (cartStatus === "idle") {
				dispatch(fetchCart());
			}
		}, 300),
		[dispatch, cartStatus],
	);

	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth < 768);
		window.addEventListener("resize", handleResize);
		debouncedFetchCart();
		return () => {
			window.removeEventListener("resize", handleResize);
			debouncedFetchCart.cancel();
		};
	}, [debouncedFetchCart]);

	const cartProducts = useMemo(() => {
		return Object.entries(cartItems)
			.map(([productId, quantity]) => {
				const product = allProducts.find((p: Product) => p._id === productId);
				return { product, quantity, productId };
			})
			.filter((item) => item.product !== undefined || productsStatus === "loading");
	}, [cartItems, allProducts, productsStatus]);

	const toggleCart = () => {
		setIsCartExpanded(!isCartExpanded);
		setCurrentPage(1);
	};

	return {
		isLoading,
		isMobile,
		isCartExpanded,
		setIsCartExpanded,
		currentPage,
		setCurrentPage,
		cartProducts,
		allProducts,
		productsStatus,
		toggleCart,
	};
};
