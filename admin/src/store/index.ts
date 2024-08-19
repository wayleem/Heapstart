import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
	persistStore,
	persistReducer,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
	PersistConfig,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import adminReducer from "./slices/adminSlice";
import productReducer from "./slices/productSlice";
import orderReducer from "./slices/orderSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { RootState } from "@types";

const persistConfig: PersistConfig<RootState> = {
	key: "root",
	storage,
	whitelist: ["admin"], // only admin will be persisted
};

const rootReducer = combineReducers({
	admin: adminReducer,
	product: productReducer,
	order: orderReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
