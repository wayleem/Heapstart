import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import adminReducer from "./slices/adminSlice";
import productReducer from "./slices/productsSlice";

const persistConfig = {
	key: "root",
	storage,
	whitelist: [""], // only admin will be persisted
};

const persistedAdminReducer = persistReducer(persistConfig, adminReducer);

export const store = configureStore({
	reducer: {
		admin: persistedAdminReducer,
		products: productReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
