import { createAsyncThunk } from "@reduxjs/toolkit";
import { productApi } from "@api/endpoints";
import { handleApiError, log } from "@utils/errorUtils";
import {
  setProducts,
  setSelectedProduct,
  addProduct,
  updateProduct,
  removeProduct,
  setProductStatus,
  setProductError,
} from "../slices/productSlice";
import { Product } from "@types";

export const fetchProducts = createAsyncThunk<void, void>("products/fetchProducts", async (_, { dispatch }) => {
  try {
    dispatch(setProductStatus("loading"));
    const products = await productApi.getAllProducts();
    dispatch(setProducts(products));
    dispatch(setProductStatus("succeeded"));
  } catch (err) {
    const errorMessage = handleApiError(err);
    log("error", "Failed to fetch products", { error: errorMessage });
    dispatch(setProductError(errorMessage));
    dispatch(setProductStatus("failed"));
    throw err;
  }
});

export const fetchProduct = createAsyncThunk<Product, string>("products/fetchProduct", async (productId, { dispatch }) => {
  try {
    dispatch(setProductStatus("loading"));
    const product = await productApi.getProduct(productId);
    dispatch(updateProduct(product));
    dispatch(setSelectedProduct(product));
    dispatch(setProductStatus("succeeded"));
    return product;
  } catch (err) {
    const errorMessage = handleApiError(err);
    log("error", "Failed to fetch product", { error: errorMessage, productId });
    dispatch(setProductError(errorMessage));
    dispatch(setProductStatus("failed"));
    throw err;
  }
});

export const createProduct = createAsyncThunk<void, FormData>("products/createProduct", async (productData, { dispatch }) => {
  try {
    dispatch(setProductStatus("loading"));
    const newProduct = await productApi.createProduct(productData);
    dispatch(addProduct(newProduct));
    dispatch(setProductStatus("succeeded"));
  } catch (err) {
    const errorMessage = handleApiError(err);
    log("error", "Failed to create product", { error: errorMessage });
    dispatch(setProductError(errorMessage));
    dispatch(setProductStatus("failed"));
    throw err;
  }
});

export const updateProductDetails = createAsyncThunk<void, { id: string; productData: FormData }>(
  "products/updateProduct",
  async ({ id, productData }, { dispatch }) => {
    try {
      dispatch(setProductStatus("loading"));
      const updatedProduct = await productApi.updateProduct(id, productData);
      dispatch(updateProduct(updatedProduct));
      dispatch(setProductStatus("succeeded"));
    } catch (err) {
      const errorMessage = handleApiError(err);
      log("error", "Failed to update product", { error: errorMessage, id });
      dispatch(setProductError(errorMessage));
      dispatch(setProductStatus("failed"));
      throw err;
    }
  }
);

export const deleteProduct = createAsyncThunk<void, string>("products/deleteProduct", async (productId, { dispatch }) => {
  try {
    dispatch(setProductStatus("loading"));
    await productApi.deleteProduct(productId);
    dispatch(removeProduct(productId));
    dispatch(setProductStatus("succeeded"));
  } catch (err) {
    const errorMessage = handleApiError(err);
    log("error", "Failed to delete product", { error: errorMessage, productId });
    dispatch(setProductError(errorMessage));
    dispatch(setProductStatus("failed"));
    throw err;
  }
});
