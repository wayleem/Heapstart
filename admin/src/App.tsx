import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import Login from "./pages/Login";
import ProductList from "./components/ProductList";
import ProductFormWrapper from "./components/ProductFormWrapper";

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
	const isAuthenticated = useSelector((state: RootState) => state.admin.isAuthenticated);
	return isAuthenticated ? element : <Navigate to="/login" />;
};

const App: React.FC = () => {
	return (
		<Router>
			<div className="container mx-auto p-4">
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/" element={<PrivateRoute element={<ProductList />} />} />
					<Route path="/add" element={<PrivateRoute element={<ProductFormWrapper />} />} />
					<Route path="/edit/:id" element={<PrivateRoute element={<ProductFormWrapper />} />} />
				</Routes>
			</div>
		</Router>
	);
};

export default App;
