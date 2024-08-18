import { AdminState } from "./admin";
import { ProductState } from "./product";

export interface RootState {
	admin: AdminState;
	product: ProductState;
}
