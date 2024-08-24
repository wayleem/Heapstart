import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer, PersistConfig } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import cartReducer from "./slices/cartSlice";
import userReducer from "./slices/userSlice";
import productReducer from "./slices/productSlice";
import orderReducer from "./slices/orderSlice";
import supportTicketReducer from "./slices/supportTicketSlice";
import promoCodeReducer from "./slices/promoCodeSlice";
import { RootState } from "@types";

const rootReducer = combineReducers({
	cart: cartReducer,
	user: userReducer,
	product: productReducer,
	orders: orderReducer,
	supportTickets: supportTicketReducer,
	promoCodes: promoCodeReducer,
});

const persistConfig: PersistConfig<RootState> = {
	key: "root",
	storage,
	whitelist: ["user"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: ["persist/PERSIST"],
			},
		}),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
