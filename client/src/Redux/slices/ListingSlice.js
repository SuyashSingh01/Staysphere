import { createSlice } from "@reduxjs/toolkit";

const listingSlice = createSlice({
  name: "listings",
  initialState: {
    listings:localStorage.getItem("listings")? JSON.parse(localStorage.getItem("listings")):[],//Array of Hosted listings
    favorites: [], // List of favorite listings
    // currentListing: null, // Current listing being viewed needs to work on this
   
  },
  reducers: {
    setListings(state, action) {
      // Initialize listings
      state.listings = action.payload; 
    },
    addFavorite(state, action) {
      if (!state.favorites.includes(action.payload)) {
        state.favorites.push(action.payload);
      }
    },
    removeFavorite(state, action) {
      state.favorites = state.favorites.filter(
        (listingId) => listingId !== action.payload
      );
    },
    addListing(state, action) {
      // Add new listing
      state.listings.push(action.payload); 
    },
    updateListing(state, action) {
      const { id, placeData } = action.payload;
      const index = state.listings.findIndex((listing) => listing.id === id);
      if (index !== -1) state.listings[index] = { ...state.listings[index], ...placeData };
    },
    deleteListing(state, action) {
      state.listings = state.listings.filter(
        (listing) => listing.id !== action.payload
      );
    },
  },
});

export const {
  setListings,
  addFavorite,
  removeFavorite,
  addListing,
  updateListing,
  deleteListing,
} = listingSlice.actions;
export default listingSlice.reducer;
