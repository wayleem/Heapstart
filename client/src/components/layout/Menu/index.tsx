// Menu/index.tsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "@assets/sm_heapstart.svg";
import { useAppDispatch, useAppSelector } from "@store/index";
import { selectIsAuthenticated } from "@store/slices/userSlice";
import CartSection from "../Menu/cart/CartSection";
import NavigationSection from "../Menu/nav/NavigationSection";
import AuthSection from "../Menu/auth/AuthSection";
import { logout } from "@store/thunks/userThunks";
import { useNavigationMenu } from "@hooks/nav/useNavigationMenu";

interface MenuProps {
	closeMenu: () => void;
}

const Menu: React.FC<MenuProps> = ({ closeMenu }) => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const isAuthenticated = useAppSelector(selectIsAuthenticated);
	const { isLoading, isMobile, isCartExpanded, setIsCartExpanded, currentPage, setCurrentPage } = useNavigationMenu();

	const toggleCart = () => {
		setIsCartExpanded(!isCartExpanded);
		setCurrentPage(1);
	};

	const handleLogout = async () => {
		try {
			await dispatch(logout()).unwrap();
			closeMenu();
			navigate("/");
		} catch (error) {
			console.error("Logout failed:", error);
		}
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
				<CartSection
					isCartExpanded={isCartExpanded}
					toggleCart={toggleCart}
					currentPage={currentPage}
					setCurrentPage={setCurrentPage}
					handleLinkClick={handleLinkClick}
				/>
				<NavigationSection handleLinkClick={handleLinkClick} />
				<AuthSection
					isAuthenticated={isAuthenticated}
					handleLogout={handleLogout}
					handleLinkClick={handleLinkClick}
				/>
			</nav>
		</div>
	);
};

export default Menu;
