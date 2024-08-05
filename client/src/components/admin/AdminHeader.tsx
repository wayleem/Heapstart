// src/components/AdminHeader.tsx

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@store/index";
import { clearAdmin, selectAdmin } from "@store/slices/adminSlice";

const AdminHeader: React.FC = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const admin = useAppSelector(selectAdmin);

	const handleLogout = () => {
		dispatch(clearAdmin());
		navigate("/admin/login");
	};

	return (
		<header className="bg-gray-800 text-white p-4">
			<div className="container mx-auto flex justify-between items-center">
				<Link to="/admin/dashboard" className="text-2xl font-bold">
					Admin Dashboard
				</Link>
				<nav>
					<ul className="flex space-x-4">
						<li>
							<Link to="/admin/dashboard" className="hover:text-gray-300">
								Dashboard
							</Link>
						</li>
						<li>
							<Link to="/admin/products" className="hover:text-gray-300">
								Products
							</Link>
						</li>
						<li>
							<Link to="/admin/orders" className="hover:text-gray-300">
								Orders
							</Link>
						</li>
						{admin && (
							<li>
								<button onClick={handleLogout} className="hover:text-gray-300">
									Logout
								</button>
							</li>
						)}
					</ul>
				</nav>
			</div>
		</header>
	);
};

export default AdminHeader;
