import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    name: "",
    username: "",
    email: "",
  },
  reducers: {
    setUserProfile: (state, action) => {
      state.name = action.payload.name;
      state.username = action.payload.username;
      state.email = action.payload.email;
    },
  },
});

export const { setUserProfile } = userSlice.actions;
export default userSlice.reducer;
