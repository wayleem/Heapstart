import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./store";
import Layout from "@components/Layout";
import Home from "@pages/Home";
import Contact from "@pages/Contact";
import Registration from "@pages/Registration";
import Login from "@pages/Login";
import Profile from "@pages/Profile";
import PasswordReset from "@pages/PasswordReset";
import Store from "@pages/Store";
import Faq from "@pages/Faq";
import Checkout from "@pages/Checkout";
import { fetchCart } from "@store/slices/cartSlice";
import { selectIsAuthenticated } from "./store/slices/userSlice";
import { fetchProducts, selectProductsStatus } from "./store/slices/productsSlice";

function App() {
	const dispatch = useAppDispatch();
	const isAuthenticated = useAppSelector(selectIsAuthenticated);
	const productsStatus = useAppSelector(selectProductsStatus);

	useEffect(() => {
		if (isAuthenticated) {
			dispatch(fetchCart());
			if (productsStatus === "idle") {
				dispatch(fetchProducts());
			}
		}
	}, [isAuthenticated, dispatch, productsStatus]);

	return (
		<Router>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<Home />} />
					<Route path="/contact" element={<Contact />} />
					<Route path="/register" element={<Registration />} />
					<Route path="/login" element={<Login />} />
					<Route path="/profile" element={<Profile />} />
					<Route path="/reset-password" element={<PasswordReset />} />
					<Route path="/store" element={<Store />} />
					<Route path="/faq" element={<Faq />} />
					<Route path="/checkout" element={<Checkout />} />
				</Route>
			</Routes>
		</Router>
	);
}

export default App;
