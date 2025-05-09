import { createSlice } from "@reduxjs/toolkit";

const cachedResultsSlice = createSlice({
    name: "cachedResults",
    initialState: {
        trendingMovies: [],
        trendingWebSeries: [],
        upcomingMovies: [],
        upcomingWebSeries: [],
        topMovies: [],
        topWebSeries: []
    },
    reducers: {
        setCachedResults: (state, action) => {
            Object.entries(action.payload).forEach(([key, value]) => {
                state[key] = value;
            });
        },
        logoutHandler: (state, action) => {
            state.trendingMovies = [];
            state.trendingWebSeries = [];
            state.upcomingMovies = [];
            state.upcomingWebSeries = [];
            state.topMovies = [];
            state.topWebSeries = []
        }
    }
})

export const { setCachedResults,logoutHandler } = cachedResultsSlice.actions;
export default cachedResultsSlice.reducer;