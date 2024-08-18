import { useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchProducts } from "@store/thunks/productThunks";
import { useAppDispatch } from "@store/index";
import { RootState } from "@types";

export const useProducts = () => {
	const dispatch = useAppDispatch();
	const products = useSelector((state: RootState) => state.product.items);
	const status = useSelector((state: RootState) => state.product.status);

	useEffect(() => {
		if (status === "idle") {
			dispatch(fetchProducts());
		}
	}, [status, dispatch]);

	return { products, status };
};
