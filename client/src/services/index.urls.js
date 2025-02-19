import {
  authApis,
  userApis,
  listingApis,
  hostApis,
  profileApis,
  bookingApis,
  reviewApis,
  locationApis,
  contactUsApis,
  chatEndpoint,
} from "./api.urls";

export const API_URLS = {
  AUTH_ADMIN: authApis,
  LISTING: listingApis,
  USERS: userApis,
  HOST: hostApis,
  PROFILE: profileApis,
  BOOKING: bookingApis,
  REVIEW: reviewApis,
  LOCATION: locationApis,
  CONTACT: contactUsApis,
  CHAT: chatEndpoint,
};
