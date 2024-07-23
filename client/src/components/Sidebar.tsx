import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppSelector, useAppDispatch } from "../store";
import { selectIsAuthenticated, clearUser } from "../store/slices/userSlice";

interface SidebarProps {
	closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ closeSidebar }) => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const isAuthenticated = useAppSelector(selectIsAuthenticated);
	const [isCartExpanded, setIsCartExpanded] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);

	// Placeholder cart items
	const cartItems = Array.from({ length: 25 }, (_, i) => `Item ${i + 1}`);
	const itemsPerPage = 10;
	const totalPages = Math.ceil(cartItems.length / itemsPerPage);
	const displayedItems = cartItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

	const toggleCart = () => {
		setIsCartExpanded(!isCartExpanded);
		setCurrentPage(1); // Reset to first page when toggling
	};

	const handleLogout = () => {
		dispatch(clearUser());
		closeSidebar();
		navigate("/"); // Redirect to home page after logout
	};

	return (
		<div className="h-full w-full bg-base-200 p-4 flex flex-col">
			<nav className="flex-grow pt-12 flex flex-col space-y-8">
				<motion.div>
					<button onClick={toggleCart} className="text-primary hover:text-neutral text-4xl flex items-center">
						Your Cart
						<svg
							className={`ml-2 h-6 w-6 transform transition-transform ${
								isCartExpanded ? "rotate-180" : ""
							}`}
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
						</svg>
						<section className="ml-4 text-xl">{cartItems.length}</section>
					</button>
					<motion.div transition={{ duration: 0.15 }} layout>
						{isCartExpanded && (
							<div className="mt-4 space-y-2">
								{displayedItems.map((item, index) => (
									<div key={index} className="text-sm text-primary ml-4">
										{item}
									</div>
								))}
								{totalPages > 1 && (
									<div className="flex justify-between items-center mt-4">
										<button
											onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
											disabled={currentPage === 1}
											className="btn btn-sm btn-ghost"
										>
											Previous
										</button>
										<span>
											{currentPage} / {totalPages}
										</span>
										<button
											onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
											disabled={currentPage === totalPages}
											className="btn btn-sm btn-ghost"
										>
											Next
										</button>
									</div>
								)}
								<Link to="/checkout" onClick={closeSidebar} className="btn btn-primary mt-4 w-full">
									Checkout
								</Link>
							</div>
						)}
					</motion.div>
				</motion.div>
				<Link to="/contact" onClick={closeSidebar} className="text-primary hover:text-neutral text-3xl">
					Contact
				</Link>
				<Link to="/faq" onClick={closeSidebar} className="text-primary hover:text-neutral text-3xl">
					FAQ
				</Link>
				{isAuthenticated ? (
					<>
						<Link to="/profile" onClick={closeSidebar} className="text-primary hover:text-neutral text-2xl">
							Profile
						</Link>
						<button onClick={handleLogout} className="text-primary hover:text-neutral text-2xl text-left">
							Logout
						</button>
					</>
				) : (
					<>
						<Link
							to="/register"
							onClick={closeSidebar}
							className="text-primary hover:text-neutral text-2xl"
						>
							Register
						</Link>
						<Link to="/login" onClick={closeSidebar} className="text-primary hover:text-neutral text-2xl">
							Login
						</Link>
					</>
				)}
			</nav>
		</div>
	);
};

export default Sidebar;
