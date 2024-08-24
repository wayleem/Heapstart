import { AdminState } from "./admin";
import { OrderState } from "./order";
import { ProductState } from "./product";
import { PromoCodeState } from "./promo";
import { SupportTicketState } from "./supportTicket";

export interface RootState {
	admin: AdminState;
	product: ProductState;
	order: OrderState;
	supportTicket: SupportTicketState;
	promoCode: PromoCodeState;
}
