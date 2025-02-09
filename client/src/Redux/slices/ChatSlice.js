import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: [],
    loading: false,
    chatModal: false,
  },
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
    setChatModal(state, action) {
      state.chatModal = !state.chatModal;
      console.log("chat modal", state.chatModal);
    },
  },
});

export const { setChats, addChat, setLoading, setChatModal } =
  chatSlice.actions;
export default chatSlice.reducer;
