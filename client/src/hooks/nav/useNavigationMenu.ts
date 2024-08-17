import { useState, useEffect, useMemo } from "react";
import { useAppSelector } from "@store/index";
import { selectCartItems } from "@store/slices/cartSlice";
import { selectAllProducts, selectProductsStatus } from "@store/slices/productSlice";
import { Product } from "@types";

export const useNavigationMenu = () => {
	const cartItems = useAppSelector(selectCartItems);
	const cartStatus = useAppSelector((state) => state.cart.status);
	const productsStatus = useAppSelector(selectProductsStatus);
	const allProducts = useAppSelector(selectAllProducts);
	const [isCartExpanded, setIsCartExpanded] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

	const isLoading = cartStatus === "loading" || productsStatus === "loading";

	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth < 768);
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

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
