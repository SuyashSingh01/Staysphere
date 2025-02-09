import { combineReducers, configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/AuthSlice";
import bookingReducer from "./slices/BookingSlice";
import listingReducer from "./slices/ListingSlice";
import chatReducer from "./slices/ChatSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  bookings: bookingReducer,
  listings: listingReducer,
  chat: chatReducer,
  // -- Other reducers go here --
});

export const store = configureStore({
  reducer: rootReducer,
});

export default rootReducer;
