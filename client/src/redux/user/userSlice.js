import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'userProfile',
    initialState: {
        fullname: '',
        username: '',
        email: '',
    },
    reducers: {
        setUserProfile: (state, action) => {
            state.fullname = action.payload.fullname;
            state.username = action.payload.username;
            state.email = action.payload.email;
        },
    }
})

export const { setUserProfile } = userSlice.actions;
export default userSlice.reducer;