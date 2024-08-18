import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "@components/layout/Layout";
import { RootState } from "@types";
import ProductForm from "@components/forms/ProductForm";
import Login from "@pages/auth/Login";
import ProductList from "@components/tables/ProductList";

const App: React.FC = () => {
	const isAuthenticated = useSelector((state: RootState) => state.admin.isAuthenticated);

	return (
		<Router>
			<Routes>
				<Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
				<Route
					path="/"
					element={
						isAuthenticated ? (
							<Layout>
								<ProductList />
							</Layout>
						) : (
							<Navigate to="/login" />
						)
					}
				/>
				<Route
					path="/products"
					element={
						isAuthenticated ? (
							<Layout>
								<ProductList />
							</Layout>
						) : (
							<Navigate to="/login" />
						)
					}
				/>
				<Route
					path="/add"
					element={
						isAuthenticated ? (
							<Layout>
								<ProductForm />
							</Layout>
						) : (
							<Navigate to="/login" />
						)
					}
				/>
				<Route
					path="/edit/:id"
					element={
						isAuthenticated ? (
							<Layout>
								<ProductForm />
							</Layout>
						) : (
							<Navigate to="/login" />
						)
					}
				/>
			</Routes>
		</Router>
	);
};

export default App;
