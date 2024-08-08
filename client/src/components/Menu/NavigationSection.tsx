import React from "react";
import NavItem from "./NavItem";
import { StoreIcon, ContactIcon, FAQIcon } from "../icons";

interface NavigationSectionProps {
	handleLinkClick: (isCartLink: boolean) => void;
}

const NavigationSection: React.FC<NavigationSectionProps> = ({ handleLinkClick }) => (
	<div className="pt-4">
		<NavItem to="/store" icon={<StoreIcon className="w-5 h-5" />} onClick={() => handleLinkClick(false)}>
			Store
		</NavItem>
		<NavItem to="/contact" icon={<ContactIcon className="w-5 h-5" />} onClick={() => handleLinkClick(false)}>
			Contact
		</NavItem>
		<NavItem to="/faq" icon={<FAQIcon className="w-5 h-5" />} onClick={() => handleLinkClick(false)}>
			FAQ
		</NavItem>
		<NavItem to="/order-history" icon={<FAQIcon className="w-5 h-5" />} onClick={() => handleLinkClick(false)}>
			Order History
		</NavItem>
	</div>
);

export default NavigationSection;
