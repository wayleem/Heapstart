import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@store/index";
import { selectAllProducts, selectProductsStatus, selectProductsError } from "@store/slices/productSlice";
import { fetchProducts } from "@store/thunks/productThunks";

export const useProductList = () => {
	const dispatch = useAppDispatch();
	const products = useAppSelector(selectAllProducts);
	const status = useAppSelector(selectProductsStatus);
	const error = useAppSelector(selectProductsError);

	useEffect(() => {
		if (status === "idle") {
			dispatch(fetchProducts());
		}
	}, [status, dispatch]);

	return { products, status, error };
};
