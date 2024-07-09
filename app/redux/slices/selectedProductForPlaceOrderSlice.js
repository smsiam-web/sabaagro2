import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

export const selectedProductSlice = createSlice({
  name: "selectedProduct",
  initialState,
  reducers: {
    updateSelectedProduct: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { updateSelectedProduct } = selectedProductSlice.actions;
export const selectSelectedProduct = (state) => state.selectedProduct.items;

export default selectedProductSlice.reducer;
