import { createSlice } from "@reduxjs/toolkit";
const getInitialState = () => {
  return {
    chats: [],
    loading: false,
    openChat: false,
    size: JSON.parse(localStorage.getItem("chatSize")) || {
      width: 400,
      height: 500,
    },
    position: JSON.parse(localStorage.getItem("chatPosition")) || {
      x: 100,
      y: 100,
    },
  };
};
const chatSlice = createSlice({
  name: "chat",
  initialState: getInitialState(),
  reducers: {
    setChats(state, action) {
      state.chats = action.payload;
    },
    addChat(state, action) {
      state.chats.push(action.payload);
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setOpenChat(state, action) {
      state.openChat = action.payload;
      console.log("chat modal", state.openChat);
    },
    setChatSize: (state, action) => {
      state.size = action.payload;
      localStorage.setItem("chatSize", JSON.stringify(action.payload)); // Persist size
    },
    setChatPosition: (state, action) => {
      state.position = action.payload;
      localStorage.setItem("chatPosition", JSON.stringify(action.payload)); // Persist position
    },
  },
});

export const {
  setChats,
  addChat,
  setLoading,
  setOpenChat,
  setChatSize,
  setChatPosition,
} = chatSlice.actions;
export default chatSlice.reducer;
