import chatReducer from "./slices/ChatSlice";
import authReducer from "./slices/AuthSlice";
import bookingReducer from "./slices/BookingSlice";
import listingReducer from "./slices/ListingSlice";
import profileReducer from "./slices/ProfileSlice";
import categoriesReducer from "./slices/CategorySlice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  auth: authReducer,
  bookings: bookingReducer,
  listings: listingReducer,
  chat: chatReducer,
  category: categoriesReducer,
  profile: profileReducer,
  // -- Other reducers go here --
});

export const store = configureStore({
  reducer: rootReducer,
});

export default rootReducer;
