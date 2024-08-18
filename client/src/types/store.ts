import { CartState } from "./cart";
import { OrderState } from "./order";
import { ProductState } from "./product";
import { SupportTicketState } from "./supportTicket";
import { UserState } from "./user";

export interface RootState {
	cart: CartState;
	user: UserState;
	product: ProductState;
	orders: OrderState;
	supportTickets: SupportTicketState;
}
