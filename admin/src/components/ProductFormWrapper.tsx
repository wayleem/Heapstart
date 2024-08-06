import React from "react";
import { useNavigate } from "react-router-dom";
import ProductForm from "./ProductForm";

const ProductFormWrapper: React.FC = () => {
	const navigate = useNavigate();

	const handleClose = () => {
		navigate("/");
	};

	return <ProductForm onClose={handleClose} />;
};

export default ProductFormWrapper;
