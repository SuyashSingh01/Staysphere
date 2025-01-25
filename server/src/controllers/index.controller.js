import AuthController from "./auth/auth.controller.js";
import ListingController from "./listing/listing.controllers.js";
import ChatServiceController from "./chat/chat.controller.js";
import HostController from "./host/host.controllers.js";
import BookingController from "./booking/booking.controllers.js";
import FavouriteController from "./favourite/favourite.controllers.js";
import PaymentController from "./payment/payment.controllers.js";
import ReviewController from "./review/review.controllers.js";

export const controllers = {
  auth: AuthController,
  booking: BookingController,
  listing: ListingController,
  host: HostController,
  chatservice: ChatServiceController,
  favourite: FavouriteController,
  payment: PaymentController,
  review: ReviewController,
};
