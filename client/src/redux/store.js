import { configureStore } from "@reduxjs/toolkit"
import { persistStore, persistReducer } from "redux-persist"
import storage from 'redux-persist/lib/storage'
import userReducer from './user/userSlice'
import cachedReducer from './cachedResults/cachedResultsSlice'

const userPersistConfig = {
    key: 'userProfile',
    storage,
}

const cachedResultsPersistConfig = {
    key: 'cachedResults',
    storage,
}

const persistedUserReducer = persistReducer(userPersistConfig, userReducer);
const persistedCachedResultsReducer = persistReducer(cachedResultsPersistConfig, cachedReducer);

const store = configureStore({
    reducer: {
        userProfile: persistedUserReducer,
        cachedResults : persistedCachedResultsReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PURGE', 'persist/FLUSH', 'persist/PAUSE', 'persist/REGISTER'],
            },
        }),
})

export const persistor = persistStore(store);
export default store;