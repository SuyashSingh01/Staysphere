const BASE_URL = import.meta.env.VITE_BASE_URL;

// AUTH ENDPOINTS
export const authApis = {
  REGISTER_API: BASE_URL + "/auth/register",
  LOGIN_API: BASE_URL + "/auth/login",
  RESETPASSTOKEN_API: BASE_URL + "/auth/forgot",
  RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
  // SENDOTP_API: BASE_URL + "/auth/sendotp",
};

// HOST ENDPOINTS
export const hostApis = {
  // Host Authentication ENDPOINTS
  HOST_REGISTER_API: BASE_URL + "/host/register",
  HOST_REGISTER_VERIFY_API: BASE_URL + "/host/register/verify",
  HOST_LOGIN: BASE_URL + "/host/login",

  // Host Profile ENDPOINTS
  ADD_PLACE: BASE_URL + "/host/addplace",
  DELETE_PLACE: BASE_URL + "/host/deletehostplace/",
  GET_HOST_PLACE_BY_ID: BASE_URL + "/host/gethostplaceById",
  GET_ALL_PLACES: BASE_URL + "/host/getallhostplace",
  UPDATE_PLACE: BASE_URL + "/host/updatehostplace",
};

// BOOKINGS ENDPOINTS
export const bookingsApis = {
  GET_ALL_BOOKINGS: BASE_URL + "/booking/all",
  GET_BOOKING_BY_ID: BASE_URL + "/booking/",
  CREATE_BOOKING: BASE_URL + "/create-booking",
  CANCEL_BOOKING: BASE_URL + "/booking/cancel-request/:bookingId",
};

// FAVORITES  ENDPOINTS
export const favorite = {
  ADD_FAVORITE: BASE_URL + "/add-favorite/:placeID",
  GET_FAVORITE: BASE_URL + "/account/liked-place",
  REMOVE_FAVORITE: BASE_URL + "/remove-favorite/:id",
};

// PLACE ENDPOINTS
export const listingApis = {
  GET_ALL_LISTINGS_API: BASE_URL + "/place/getAllplaces",
  GET_LISTING_DETAILS_API: BASE_URL + "/place/getplaceDetails",
  GET_TOP_PLACE_API: BASE_URL + "/place/top-listing",
  // GET_NEARBY_PLACE_API: BASE_URL + "/place/nearby",
  // GET_PLACE_BY_CATEGORY_API: BASE_URL + "/place/category",
  // GET_PLACE_BY_LOCATION_API: BASE_URL + "/place/location",
  // GET_PLACE_BY_NAME_API: BASE_URL + "/place/name",
  // GET_PLACE_BY_RATING_API: BASE_URL + "/place/rating",
  // GET_PLACE_BY_PRICE_API: BASE_URL + "/place/price",
  // GET_PLACE_BY_FEATURES_API: BASE_URL + "/place/features",
  // GET_PLACE_BY_HOST_API: BASE_URL + "/place/host",
  // GET_PLACE_BY_DATE_API: BASE_URL + "/place/date",
  // GET_PLACE_BY_TIME_API: BASE_URL + "/place/time",
};

// PAYMENT ENDPOINTS

export const paymentApis = {
  BOOKING_PAYMENT_CHECKOUT_API: BASE_URL + "/checkout",
  BOOKING_VERIFY_API_PAYMENT: BASE_URL + "/payment/verifyPayment",
  SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL + "/payment/sendPaymentSuccessEmail",
};

// PROFILE ENDPOINTS
export const profileEndpoints = {
  GET_PROFILE_API: BASE_URL + "/account/profile",
  UPDATE_PROFILE_API: BASE_URL + "/account/profileupdate",
  UPDATE_PROFILE_IMAGE_API: BASE_URL + "/account/updateDisplaypic",
  UPDATE_PASSWORD_API: BASE_URL + "/profile/updatePassword",
  DELETED_PROFILE_API: BASE_URL + "/account/deleteprofile",

  UPDATE_EMAIL_API: BASE_URL + "/profile/updateEmail",
  UPDATE_PHONE_API: BASE_URL + "/profile/updatePhone",

  //   add other
};

// RATINGS AND REVIEWS
export const review = {
  REVIEWS_DETAILS_API: BASE_URL + "/place/getReviews/:id",
  ADD_REVIEW_API: BASE_URL + "/place/addReview",
  DELETE_REVIEW_API: BASE_URL + "/place/deleteReview",
  UPDATE_REVIEW_API: BASE_URL + "/place/updateReview",
};

// Location API
export const location = {
  _API: BASE_URL + "/place/location",
};

// CONTACT US API
export const contactusEndpoint = {};

//   add other ENDPOINTS LIKE FOR CHATS

export const chatEndpoint = {
  CHATROOM: BASE_URL + "/chatroom/:roomId",
  CHAT_HISTORY: BASE_URL + "/chat_history",
  SEND_MESSAGE: BASE_URL + "/send_message",
};
