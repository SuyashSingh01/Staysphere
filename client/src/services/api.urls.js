const BASE_URL = "https://localhost:4000/api/v1";

// add all the correct routes that are available in pdf except for chat routes

// AUTH ENDPOINTS
export const authApis = {
  SENDOTP_API: BASE_URL + "/auth/sendotp",
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
  RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
  //   RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
};

// PROFILE ENDPOINTS
export const profileEndpoints = {
  GET_PROFILE_API: BASE_URL + "/profile/getProfile",
  UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
  UPDATE_PROFILE_IMAGE_API: BASE_URL + "/profile/updateProfileImage",
  UPDATE_PASSWORD_API: BASE_URL + "/profile/updatePassword",
  UPDATE_EMAIL_API: BASE_URL + "/profile/updateEmail",
  UPDATE_PHONE_API: BASE_URL + "/profile/updatePhone",
  //   add other
};

// Booking ENDPOINTS
export const booking = {
  BOOKING_PAYMENT_API: BASE_URL + "/payment/capturePayment",
  BOOKING_VERIFY_API: BASE_URL + "/payment/verifyPayment",
  SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL + "/payment/sendPaymentSuccessEmail",
};

// Place ENDPOINTS
export const listingApis = {
  GET_ALL_PLACE_API: BASE_URL + "/place/getAllplaces",
  GET_PLACE_DETAILS_API: BASE_URL + "/place/getplaceDetails",

  //   add other
};

export const userApis = {
  //   add other
};
// RATINGS AND REVIEWS
export const review = {
  REVIEWS_DETAILS_API: BASE_URL + "/place/getReviews",
};

// Location API
export const location = {
  _API: BASE_URL + "/place/location",
};

// CONTACT-US API
// export const contactusEndpoint = {
//   CONTACT_US_API: BASE_URL + "/reach/contact",
// };

//   add other ENDPOINTS LIKE FOR CHATS

export const chatEndpoint = {
  CHATROOM: BASE_URL + "/chatroom/:roomId",
  CHAT_HISTORY: BASE_URL + "/chat_history",
  SEND_MESSAGE: BASE_URL + "/send_message",
};
