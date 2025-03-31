import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    fullname: "",
    username: "",
    email: "",
    about: "",
    gender: "",
    dob: "",
    phone_number: "",
    friendList: [],
    pending_requests: [],
    request_sent: []
  },
  reducers: {
    setUserProfile: (state, action) => {
      state.fullname = action.payload.fullname;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.about = action.payload.about;
      state.gender = action.payload.gender;
      state.dob = action.payload.dob;
      state.phone_number = action.payload.phone_number;
      state.friendList = action.payload.friendList;
    },
    setFriendList: (state, action) => {
      state.friendList = action.payload.friendList;
    },
    setPendingRequest: (state, action) => {
      state.pending_requests = action.payload.pending_requests;
    },
    setRequestSent: (state, action) => {
      state.request_sent = action.payload.request_sent;
    },
    logout: (state) => {
      return {
        fullname: null,
        username: null,
        email: null,
        about: null,
        gender: null,
        dob: null,
        phone_number: null,
        friendList: [],
        pending_requests: [],
        request_sent: []
      };
    },
  },
});

export const { setUserProfile, logout, setFriendList, setPendingRequest, setRequestSent } = userSlice.actions;
export default userSlice.reducer;
