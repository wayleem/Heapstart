import React from "react";
import { Link, useLocation } from "react-router-dom";
import { HomeIcon, CubeIcon, ShoppingCartIcon, UsersIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

const Sidebar = () => {
	const location = useLocation();

	const NavItem = ({
		to,
		icon: Icon,
		children,
	}: {
		to: string;
		icon: React.ElementType;
		children: React.ReactNode;
	}) => {
		const isActive = location.pathname === to;
		return (
			<Link
				to={to}
				className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 ${
					isActive ? "bg-gray-700 text-white" : ""
				}`}
			>
				<Icon className="h-6 w-6 mr-3" />
				<span className="text-sm font-medium">{children}</span>
			</Link>
		);
	};

	return (
		<div className="flex flex-col w-64 bg-gray-800 text-gray-300">
			<div className="flex items-center justify-center h-20 border-b border-gray-700">
				<h1 className="text-2xl font-bold text-white">Admin Panel</h1>
			</div>
			<nav className="flex-1 overflow-y-auto">
				<NavItem to="/" icon={HomeIcon}>
					Dashboard
				</NavItem>
				<NavItem to="/products" icon={CubeIcon}>
					Products
				</NavItem>
				<NavItem to="/orders" icon={ShoppingCartIcon}>
					Orders
				</NavItem>
				<NavItem to="/users" icon={UsersIcon}>
					Users
				</NavItem>
				<NavItem to="/support-tickets" icon={QuestionMarkCircleIcon}>
					Support Tickets
				</NavItem>
			</nav>
		</div>
	);
};

export default Sidebar;
