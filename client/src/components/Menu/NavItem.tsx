import { NavLink } from "react-router-dom";

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

export default NavItem;
