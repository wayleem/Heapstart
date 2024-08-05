import React, { lazy, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./store";
import { selectIsAdminAuthenticated } from "./store/slices/adminSlice";
import Layout from "@components/user/Layout";
import AdminLayout from "@components/admin/AdminLayout";
import Home from "@pages/user/Home";
import Contact from "@pages/user/Contact";
import Registration from "@pages/user/Registration";
import Login from "@pages/user/Login";
import Profile from "@pages/user/Profile";
import PasswordReset from "@pages/user/PasswordReset";
import Store from "@pages/user/Store";
import Faq from "@pages/user/Faq";
import Checkout from "@pages/user/Checkout";
import AdminLogin from "@pages/admin/AdminLogin";
import { fetchCart } from "@store/slices/cartSlice";
import { selectIsAuthenticated } from "./store/slices/userSlice";
import { fetchProducts, selectProductsStatus } from "./store/slices/productsSlice";

const AdminDashboard = lazy(() => import("@pages/admin/Dashboard"));

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
	const isAdminAuthenticated = useAppSelector(selectIsAdminAuthenticated);
	if (!isAdminAuthenticated) {
		return <Navigate to="/admin/login" replace />;
	}
	return <>{children}</>;
};

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

				{/* Admin routes */}
				<Route path="/admin" element={<AdminLayout />}>
					<Route path="login" element={<AdminLogin />} />
					<Route
						path="dashboard"
						element={
							<ProtectedAdminRoute>
								<AdminDashboard />
							</ProtectedAdminRoute>
						}
					/>
				</Route>
			</Routes>
		</Router>
	);
}

export default App;
