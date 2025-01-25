import { createSlice } from "@reduxjs/toolkit";

const bookingSlice = createSlice({
  name: "bookings",
  initialState: {
    steps: 1,
    bookings: [],
    reviews: [
      {
        username: "John Doe",
        rating: 4,
        comment:
          "Great place to stay! lorem ipsum dolor sit amet condfsod doa vel Great place to stay! lorem ipsum dolor sit amet condfsod doa vel",
        timestamp: "1 week ago",
      },
      {
        username: "DAVVID",
        rating: 5,
        comment:
          "I loved it! Great place to stay! lorem ipsum dolor sit amet condfsod doa vel This place is the best stay The place and the host are gem. He welcomed us with warm coffee, gave us recommendations if we want to order food ",
        timstamp: "2 weeks ago",
      },
    ],
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

      // Convert check-in and check-out times to Date objects
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
        // console.log("Booking conflict: Place already booked in this time range.");
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
