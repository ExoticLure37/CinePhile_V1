import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    fullname: "",
    username: "",
    email: "",
  },
  reducers: {
    setUserProfile: (state, action) => {
      state.fullname = action.payload.fullname;
      state.username = action.payload.username;
      state.email = action.payload.email;
    },
    logout: (state) => {
      return { name: null, email: null, reg_no: null, aura_points: 0 };
    },
  },
});

export const { setUserProfile, logout } = userSlice.actions;
export default userSlice.reducer;
