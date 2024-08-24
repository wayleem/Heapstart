export interface PromoCodeState {
	code: string | null;
	discountType: "percentage" | "fixed" | null;
	discountValue: number | null;
	error: string | null;
}

export interface ValidatePromoCodeResponse {
	isValid: boolean;
	discountType: "percentage" | "fixed";
	discountValue: number;
}
