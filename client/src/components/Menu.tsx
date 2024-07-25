import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAppSelector, useAppDispatch } from "../store";
import { selectIsAuthenticated, clearUser } from "../store/slices/userSlice";
import Logo from "../assets/sm_heapstart.svg";

interface MenuProps {
	closeMenu: () => void;
}

interface NavItemProps {
	to: string;
	children: React.ReactNode;
	icon: React.ReactNode;
	isCartLink?: boolean;
	onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, children, icon, onClick }) => (
	<NavLink
		to={to}
		className={({ isActive }) =>
			`flex items-center space-x-3 py-3 px-4 text-body font-normal transition-all duration-200 ${
				isActive ? "bg-primary bg-opacity-10 text-primary font-semibold" : "text-text hover:bg-base-200"
			}`
		}
		onClick={onClick}
	>
		{icon}
		<span className="font-heading">{children}</span>
	</NavLink>
);

const CartItem: React.FC<{ item: string }> = ({ item }) => <div className="text-sm text-text">{item}</div>;

const Pagination: React.FC<{
	currentPage: number;
	totalPages: number;
	onPrevious: () => void;
	onNext: () => void;
}> = ({ currentPage, totalPages, onPrevious, onNext }) => (
	<div className="flex justify-between items-center mt-4">
		<button onClick={onPrevious} disabled={currentPage === 1} className="btn btn-ghost btn-sm">
			Previous
		</button>
		<span className="text-sm text-text">
			{currentPage} / {totalPages}
		</span>
		<button onClick={onNext} disabled={currentPage === totalPages} className="btn btn-ghost btn-sm">
			Next
		</button>
	</div>
);

const Menu: React.FC<MenuProps> = ({ closeMenu }) => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const isAuthenticated = useAppSelector(selectIsAuthenticated);
	const [isCartExpanded, setIsCartExpanded] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

	const cartItems = Array.from({ length: 25 }, (_, i) => `Item ${i + 1}`);
	const itemsPerPage = 10;
	const totalPages = Math.ceil(cartItems.length / itemsPerPage);
	const displayedItems = cartItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth < 768);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const toggleCart = () => {
		setIsCartExpanded(!isCartExpanded);
		setCurrentPage(1);
	};

	const handleLogout = () => {
		dispatch(clearUser());
		closeMenu();
		navigate("/");
	};

	const handleLinkClick = (isCartLink: boolean) => {
		if (isMobile && !isCartLink) {
			closeMenu();
		}
	};

	return (
		<div className="h-full w-full bg-base-100 p-6 flex flex-col space-y-6 shadow-lg font-sans">
			<div className="flex items-center justify-between">
				<NavLink to="/" className="flex items-center text-2xl font-heading font-bold text-primary">
					<img src={Logo} alt="Heapstart Logo" className="w-8 h-8" />
					<span>Heapstart</span>
				</NavLink>
			</div>
			<nav className="flex-grow flex flex-col mt-6 space-y-2">
				<button
					onClick={toggleCart}
					className="flex items-center justify-between w-full text-text hover:text-primary text-lg font-heading font-semibold py-3 px-4 transition-colors duration-200"
				>
					<span className="flex items-center space-x-3">
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
							/>
						</svg>
						<span>Your Cart</span>
					</span>
					<span className="badge badge-secondary badge-sm">{cartItems.length}</span>
				</button>
				<AnimatePresence>
					{isCartExpanded && (
						<motion.div
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: "auto", opacity: 1 }}
							exit={{ height: 0, opacity: 0 }}
							transition={{ duration: 0.3 }}
							className="overflow-hidden"
						>
							<div className="py-2 px-4 space-y-2">
								{displayedItems.map((item, index) => (
									<CartItem key={index} item={item} />
								))}
								{totalPages > 1 && (
									<Pagination
										currentPage={currentPage}
										totalPages={totalPages}
										onPrevious={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
										onNext={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
									/>
								)}
								<NavItem
									to="/checkout"
									icon={
										<svg
											className="w-5 h-5"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
											/>
										</svg>
									}
									isCartLink={true}
									onClick={() => handleLinkClick(true)}
								>
									Checkout
								</NavItem>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
				<div className="pt-4">
					<NavItem
						to="/store"
						icon={
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
								/>
							</svg>
						}
						onClick={() => handleLinkClick(false)}
					>
						Store
					</NavItem>
					<NavItem
						to="/contact"
						icon={
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
								/>
							</svg>
						}
						onClick={() => handleLinkClick(false)}
					>
						Contact
					</NavItem>
					<NavItem
						to="/faq"
						icon={
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						}
						onClick={() => handleLinkClick(false)}
					>
						FAQ
					</NavItem>
				</div>
				{isAuthenticated ? (
					<div className="pt-4 border-t border-base-300">
						<NavItem
							to="/profile"
							icon={
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
									/>
								</svg>
							}
							onClick={() => handleLinkClick(false)}
						>
							Profile
						</NavItem>
						<button
							onClick={handleLogout}
							className="flex items-center space-x-3 w-full text-left py-3 px-4 text-text hover:bg-base-200 transition-colors duration-200"
						>
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
								/>
							</svg>
							<span className="font-heading">Logout</span>
						</button>
					</div>
				) : (
					<div className="pt-4 border-t border-base-300">
						<NavItem
							to="/register"
							icon={
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
									/>
								</svg>
							}
							onClick={() => handleLinkClick(false)}
						>
							Register
						</NavItem>
						<NavItem
							to="/login"
							icon={
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
									/>
								</svg>
							}
							onClick={() => handleLinkClick(false)}
						>
							Login
						</NavItem>
					</div>
				)}
			</nav>
		</div>
	);
};

export default Menu;
