import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectAdmin } from "../store/slices/adminSlice";

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
							<span className="text-gray-700">Welcome, {admin.name}</span>
						</div>
					</div>
				</div>
			</nav>

			<div className="py-10">
				<main>
					<div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
						<div className="px-4 py-8 sm:px-0">
							<div className="border-4 border-dashed border-gray-200 rounded-lg h-96">
								<div className="p-4">
									<h2 className="text-2xl font-bold mb-4">Quick Stats</h2>
									{/* Add your quick stats here */}
									<p>Total Users: 1,234</p>
									<p>Total Orders: 567</p>
									<p>Revenue: $89,012</p>
								</div>
								<div className="p-4">
									<h2 className="text-2xl font-bold mb-4">Admin Actions</h2>
									<ul className="space-y-2">
										<li>
											<Link to="/admin/users" className="text-blue-600 hover:underline">
												Manage Users
											</Link>
										</li>
										<li>
											<Link to="/admin/products" className="text-blue-600 hover:underline">
												Manage Products
											</Link>
										</li>
										<li>
											<Link to="/admin/orders" className="text-blue-600 hover:underline">
												View Orders
											</Link>
										</li>
										<li>
											<Link to="/admin/settings" className="text-blue-600 hover:underline">
												Site Settings
											</Link>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default AdminDashboard;
