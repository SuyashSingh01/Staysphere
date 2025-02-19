import { createSlice } from "@reduxjs/toolkit";

export const categorySlice = createSlice({
  name: "category",
  initialState: {
    selectedCategory: "all",
    search: "",
  },
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
  },
});

export const { selectedCategory, setSelectedCategory, setSearch } =
  categorySlice.actions;

export default categorySlice.reducer;
