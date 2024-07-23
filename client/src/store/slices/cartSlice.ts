import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { RootState } from '../';

interface CartState {
  items: { [key: string]: number };
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CartState = {
  items: {},
  status: 'idle',
  error: null,
};

export const checkout = createAsyncThunk<
  void,
  void,
  { state: RootState; rejectValue: { message: string } }
>('cart/checkout', async (_, { getState, rejectWithValue }) => {
  const { cart, user } = getState();
  const body = { customerID: user.id, cartItems: cart.items };
  try {
    await axios.post('http://localhost:3001/products/checkout', body, {
      headers: { Authorization: `Bearer ${user.accessToken}` },
    });
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    if (!error.response) {
      throw err;
    }
    return rejectWithValue(error.response.data);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      state.items[itemId] = (state.items[itemId] || 0) + 1;
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      if (state.items[itemId]) {
        state.items[itemId] -= 1;
        if (state.items[itemId] === 0) {
          delete state.items[itemId];
        }
      }
    },
    updateCartItemCount: (state, action: PayloadAction<{ itemId: string; amount: number }>) => {
      const { itemId, amount } = action.payload;
      if (amount === 0) {
        delete state.items[itemId];
      } else {
        state.items[itemId] = amount;
      }
    },
    clearCart: (state) => {
      state.items = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkout.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(checkout.fulfilled, (state) => {
        state.status = 'succeeded';
        state.items = {};
      })
      .addCase(checkout.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Checkout failed';
      });
  },
});

export const { addToCart, removeFromCart, updateCartItemCount, clearCart } = cartSlice.actions;

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartStatus = (state: RootState) => state.cart.status;
export const selectCartError = (state: RootState) => state.cart.error;

export const selectTotalCartAmount = (state: RootState) => {
  const { cart, products } = state;
  return Object.entries(cart.items).reduce((total, [itemId, quantity]) => {
    const product = products.items.find((p: Product) => p._id === itemId);
    return total + (product ? product.price * quantity : 0);
  }, 0);
};

export default cartSlice.reducer;
