import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const isAuthenticated = useSelector((state: RootState) => state.admin.isAuthenticated);

	if (!isAuthenticated) {
		return <Navigate to="/admin/login" replace />;
	}

	return <>{children}</>;
};

export default ProtectedAdminRoute;
