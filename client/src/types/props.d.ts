interface MenuProps {
	closeMenu: () => void;
}

interface NavItemProps {
	to: string;
	children: ReactNode;
	icon: ReactNode;
	isCartLink?: boolean;
	onClick?: () => void;
}

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPrevious: () => void;
	onNext: () => void;
}

interface CartItemProps {
	product: Product;
	quantity: number;
	onRemove: (productId: string) => void;
}
