import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./store";
import Layout from "@components/layout/Layout";
import Home from "@pages/home/Home";
import Contact from "@pages/info/Contact";
import Registration from "@pages/auth/Registration";
import Login from "@pages/auth/Login";
import Profile from "@pages/user/Profile";
import PasswordReset from "@pages/auth/PasswordReset";
import Store from "@pages/store/Store";
import Faq from "@pages/info/Faq";
import Checkout from "@pages/checkout/Checkout";
import OrderHistory from "@pages/orders/OrderHistory";
import { selectUser } from "./store/slices/userSlice";
import { selectProductsStatus } from "./store/slices/productSlice";
import OrderConfirmation from "@pages/checkout/OrderConfirmation";
import { fetchCart } from "@store/thunks/cartThunks";
import { fetchProducts } from "@store/thunks/productThunks";
import { fetchUserProfile } from "@store/thunks/userThunks";

function App() {
	const dispatch = useAppDispatch();
	const user = useAppSelector(selectUser);
	const productsStatus = useAppSelector(selectProductsStatus);

	useEffect(() => {
		if (user.isAuthenticated && user.accessToken) {
			dispatch(fetchUserProfile());
			dispatch(fetchCart());
			if (productsStatus === "idle") {
				dispatch(fetchProducts());
			}
		}
	}, [user.isAuthenticated, user.accessToken, dispatch, productsStatus]);

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
					<Route path="/order-history" element={<OrderHistory />} />
					<Route path="/order-confirmation" element={<OrderConfirmation />} />
				</Route>
			</Routes>
		</Router>
	);
}

export default App;
