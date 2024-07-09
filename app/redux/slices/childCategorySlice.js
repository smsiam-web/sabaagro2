import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

export const childCategorySlice = createSlice({
  name: "childCategory",
  initialState,
  reducers: {
    updateChildCategory: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { updateChildCategory } = childCategorySlice.actions;

export const selectChildCategory = (state) => state.childCategory.items;

export default childCategorySlice.reducer;
