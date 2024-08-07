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

interface ShippingFormProps {
	onNext: (data: ShippingFormData) => void;
}

interface PaymentFormProps {
	onNext: (data: PaymentFormData) => void;
	onBack: () => void;
	total: number;
}

interface OrderReviewProps {
	shippingAddress: Address;
	paymentInfo: any; // Consider creating a more specific type for paymentInfo
	products: Array<{ product: Product | undefined; quantity: number }>;
	total: number;
	onSubmit: () => void;
	onBack: () => void;
}
