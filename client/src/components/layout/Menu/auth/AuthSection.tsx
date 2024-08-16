import React from "react";
import { ProfileIcon, LogoutIcon, RegisterIcon, LoginIcon } from "../../../icons";
import NavItem from "../nav/NavItem";

interface AuthSectionProps {
	isAuthenticated: boolean;
	handleLogout: () => void;
	handleLinkClick: (isCartLink: boolean) => void;
}

const AuthSection: React.FC<AuthSectionProps> = ({ isAuthenticated, handleLogout, handleLinkClick }) => (
	<div className="pt-4 border-t border-base-300">
		{isAuthenticated ? (
			<>
				<NavItem
					to="/profile"
					icon={<ProfileIcon className="w-5 h-5" />}
					onClick={() => handleLinkClick(false)}
				>
					Profile
				</NavItem>
				<button
					onClick={handleLogout}
					className="flex items-center space-x-3 w-full text-left py-3 px-4 text-text hover:bg-base-200 transition-colors duration-200"
				>
					<LogoutIcon className="w-5 h-5" />
					<span className="font-heading">Logout</span>
				</button>
			</>
		) : (
			<>
				<NavItem
					to="/register"
					icon={<RegisterIcon className="w-5 h-5" />}
					onClick={() => handleLinkClick(false)}
				>
					Register
				</NavItem>
				<NavItem to="/login" icon={<LoginIcon className="w-5 h-5" />} onClick={() => handleLinkClick(false)}>
					Login
				</NavItem>
			</>
		)}
	</div>
);

export default AuthSection;
