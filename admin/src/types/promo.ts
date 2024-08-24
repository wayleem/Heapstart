export interface PromoCode {
	_id: string;
	code: string;
	discountType: "percentage" | "fixed";
	discountValue: number;
	validFrom: Date;
	validUntil: Date;
	usageLimit: number;
	usageCount: number;
	isActive: boolean;
}

export interface PromoCodeState {
	items: PromoCode[];
	status: "idle" | "loading" | "succeeded" | "failed";
	error: string | null;
}
