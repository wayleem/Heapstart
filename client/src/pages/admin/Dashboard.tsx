import React from "react";
import { useSelector } from "react-redux";
import { selectAdmin } from "@store/slices/adminSlice";
import ProductManagement from "@components/admin/ProductManagement";

const AdminDashboard: React.FC = () => {
	const admin = useSelector(selectAdmin);

	if (!admin) {
		return <div>Loading...</div>;
	}

	return (
		<div className="min-h-screen bg-gray-100">
			<nav className="bg-white shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16">
						<div className="flex">
							<div className="flex-shrink-0 flex items-center">
								<h1 className="text-xl font-bold">Admin Dashboard</h1>
							</div>
						</div>
						<div className="flex items-center">
							<span className="text-gray-700">Welcome, {admin.username}</span>
						</div>
					</div>
				</div>
			</nav>
			<div className="py-10">
				<main>
					<div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
						<div className="px-4 py-8 sm:px-0">
							<ProductManagement />
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default AdminDashboard;
