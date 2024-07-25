import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer, PersistConfig } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import cartReducer from "./slices/cartSlice";
import userReducer from "./slices/userSlice";
import productsReducer from "./slices/productsSlice";
import adminReducer from "./slices/adminSlice";

const rootReducer = combineReducers({
	cart: cartReducer,
	user: userReducer,
	products: productsReducer,
	admin: adminReducer,
});

const persistConfig: PersistConfig<RootState> = {
	key: "root",
	storage,
	whitelist: ["cart", "user"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: ["persist/PERSIST"],
				ignoredPaths: ["user.lastLogin"],
			},
		}),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
