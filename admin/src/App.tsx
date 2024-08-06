import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import Login from "./pages/Login";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";
import Layout from "./components/Layout";

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
	const isAuthenticated = useSelector((state: RootState) => state.admin.isAuthenticated);
	return isAuthenticated ? <Layout>{element}</Layout> : <Navigate to="/login" />;
};

// Wrapper component for ProductForm
const ProductFormWrapper: React.FC = () => {
	const navigate = useNavigate();

	const handleClose = () => {
		navigate("/products");
	};

	return <ProductForm onClose={handleClose} />;
};

const App: React.FC = () => {
	return (
		<Router>
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route path="/" element={<PrivateRoute element={<ProductList />} />} />
				<Route path="/products" element={<PrivateRoute element={<ProductList />} />} />
				<Route path="/add" element={<PrivateRoute element={<ProductFormWrapper />} />} />
				<Route path="/edit/:id" element={<PrivateRoute element={<ProductFormWrapper />} />} />
			</Routes>
		</Router>
	);
};

export default App;
