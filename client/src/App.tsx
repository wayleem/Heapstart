import React, { lazy } from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./store";
import { useSelector } from "react-redux";
import { selectIsAdminAuthenticated } from "./store/slices/adminSlice";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import PasswordReset from "./pages/PasswordReset";
import Store from "./pages/Store";
import Faq from "./pages/Faq";
import Checkout from "./pages/Checkout";
import AdminLogin from "./pages/AdminLogin";

// Lazy load the admin dashboard
const AdminDashboard = lazy(() => import("./pages/Dashboard"));

// Create a wrapper component for protected admin routes
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
	const isAdminAuthenticated = useSelector(selectIsAdminAuthenticated);

	if (!isAdminAuthenticated) {
		return <Navigate to="/admin/login" replace />;
	}

	return <>{children}</>;
};

function App() {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
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
							{/* Admin routes */}
							<Route path="/admin/login" element={<AdminLogin />} />
							<Route
								path="/admin/dashboard"
								element={
									<ProtectedAdminRoute>
										<AdminDashboard />
									</ProtectedAdminRoute>
								}
							/>
						</Route>
					</Routes>
				</Router>
			</PersistGate>
		</Provider>
	);
}

export default App;
