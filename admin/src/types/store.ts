import { AdminState } from "./admin";
import { OrderState } from "./order";
import { ProductState } from "./product";

export interface RootState {
	admin: AdminState;
	product: ProductState;
	order: OrderState;
}
