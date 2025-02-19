import { createSlice } from "@reduxjs/toolkit";

const bookingSlice = createSlice({
  name: "bookings",
  initialState: {
    step: 1,
    bookings: [],
    reviews: [],
    paymentLoading: false,
  },
  reducers: {
    setStep: (state, action) => {
      state.step = action.payload;
    },
    addBooking(state, action) {
      const {
        place,
        checkIn: newCheckIn,
        checkOut: newCheckOut,
      } = action.payload;

      const newCheckInDate = new Date(newCheckIn);
      const newCheckOutDate = new Date(newCheckOut);

      // Check if the place with same id has an overlapping booking
      const isOverlapping = state.bookings.some((booking) => {
        const existingCheckIn = new Date(booking.checkIn);
        const existingCheckOut = new Date(booking.checkOut);

        // Check for overlapping dates for the same place ID
        return (
          booking.place === place &&
          newCheckInDate < existingCheckOut &&
          newCheckOutDate > existingCheckIn
        );
      });

      // If no overlap, add the booking; otherwise, skip
      if (!isOverlapping) {
        state.bookings.push(action.payload);
        console.log("New booking added:", action.payload);
      } else {
        throw new Error(
          "Booking conflict! Place is already booked in this time range."
        );
      }
    },

    cancelBooking(state, action) {
      state.bookings = state.bookings.filter(
        (booking) => booking.id !== action.payload
      );
    },
    setPaymentLoading: (state, action) => {
      state.paymentLoading = action.payload;
    },
    setBookings(state, action) {
      state.bookings = action.payload;
    },
    addReviews(state, action) {
      state.reviews.push(action.payload);
    },
  },
});

export const {
  addBooking,
  cancelBooking,
  setBookings,
  addReviews,
  setPaymentLoading,
  setStep,
} = bookingSlice.actions;
export default bookingSlice.reducer;
