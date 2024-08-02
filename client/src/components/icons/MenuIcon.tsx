import React from "react";
import { motion } from "framer-motion";

interface MenuIconProps {
	isOpen: boolean;
}

const MenuIcon: React.FC<MenuIconProps> = ({ isOpen }) => {
	return (
		<motion.div className="w-8 h-8 relative" animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.3 }}>
			<motion.span
				className="block absolute bg-primary h-0.5 w-full top-1/2 left-0 -translate-y-1/2"
				animate={{
					width: isOpen ? "100%" : "100%",
				}}
			/>
			<motion.span
				className="block absolute bg-primary w-0.5 h-full left-1/2 top-0 -translate-x-1/2"
				animate={{
					height: isOpen ? "100%" : "100%",
				}}
			/>
		</motion.div>
	);
};

export default MenuIcon;
