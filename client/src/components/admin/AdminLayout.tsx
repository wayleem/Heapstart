import React from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "./AdminHeader"; // You'll need to create this component

const AdminLayout: React.FC = () => {
	return (
		<div className="admin-layout">
			<AdminHeader />
			<main>
				<Outlet />
			</main>
		</div>
	);
};

export default AdminLayout;
