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
    phone_number: ""
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
    },
    logout: (state) => {
      return {
        fullname: null,
        username: null,
        email: null,
        about: null,
        gender: null,
        dob: null,
        phone_number: null
      };
    },
  },
});

export const { setUserProfile, logout } = userSlice.actions;
export default userSlice.reducer;
