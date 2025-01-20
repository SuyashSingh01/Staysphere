import {combineReducers} from "@reduxjs/toolkit";
import { configureStore } from '@reduxjs/toolkit';


import authReducer from "./slices/AuthSlice";
import bookingReducer from "./slices/BookingSlice";
import listingReducer from "./slices/ListingSlice";

const rootReducer  = combineReducers({
    auth: authReducer,
    bookings: bookingReducer,
    listings:listingReducer,
    // -- Other reducers go here --
})


export const store = configureStore({
  reducer: rootReducer,
})


export default rootReducer;