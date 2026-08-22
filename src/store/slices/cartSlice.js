import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCartStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addToCartSuccess: (state, action) => {
      state.loading = false;
      state.items = action.payload.items;
      state.total = action.payload.total;
      state.itemCount = action.payload.items.reduce((count, item) => count + item.quantity, 0);
      state.error = null;
    },
    addToCartFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateCartItemStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateCartItemSuccess: (state, action) => {
      state.loading = false;
      state.items = action.payload.items;
      state.total = action.payload.total;
      state.itemCount = action.payload.items.reduce((count, item) => count + item.quantity, 0);
      state.error = null;
    },
    updateCartItemFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    removeCartItemStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    removeCartItemSuccess: (state, action) => {
      state.loading = false;
      state.items = action.payload.items;
      state.total = action.payload.total;
      state.itemCount = action.payload.items.reduce((count, item) => count + item.quantity, 0);
      state.error = null;
    },
    removeCartItemFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearCartStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    clearCartSuccess: (state) => {
      state.loading = false;
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
      state.error = null;
    },
    clearCartFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCart: (state, action) => {
      state.items = action.payload.items;
      state.total = action.payload.total;
      state.itemCount = action.payload.items.reduce((count, item) => count + item.quantity, 0);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  addToCartStart,
  addToCartSuccess,
  addToCartFailure,
  updateCartItemStart,
  updateCartItemSuccess,
  updateCartItemFailure,
  removeCartItemStart,
  removeCartItemSuccess,
  removeCartItemFailure,
  clearCartStart,
  clearCartSuccess,
  clearCartFailure,
  setCart,
  clearError,
} = cartSlice.actions;

export default cartSlice.reducer;
