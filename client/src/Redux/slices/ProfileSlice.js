import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    isEmailVerified: localStorage.getItem("isEmailVerified")
      ? JSON.parse(localStorage.getItem("isEmailVerified"))
      : false,
    isPhoneVerified: localStorage.getItem("isPhoneVerified")
      ? JSON.parse(localStorage.getItem("isPhoneVerified"))
      : false,
    profilePic: localStorage.getItem("profilePic")
      ? JSON.parse(localStorage.getItem("profilePic"))
      : null,
    profileData: null,
  },
  reducers: {
    setIsEmailVerified(state, action) {
      state.isEmailVerified = action.payload;
    },
    setIsPhoneVerified(state, action) {
      state.isPhoneVerified = action.payload;
    },
    setProfilePic(state, action) {
      state.profilePic = action.payload;
    },
    setProfileData(state, action) {
      state.profileData = action.payload;
    },
  },
});

export const { setIsEmailVerified, setIsPhoneVerified, setProfileData } =
  profileSlice.actions;
export default profileSlice.reducer;
