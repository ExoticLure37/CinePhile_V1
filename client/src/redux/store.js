import { configureStore } from "@reduxjs/toolkit"
import { persistStore, persistReducer } from "redux-persist"
import storage from 'redux-persist/lib/storage'
import userReducer from './user/userSlice'

const userPersistConfig = {
    key: 'userProfile',
    storage,
}

const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

const store = configureStore({
    reducer: {
        userProfile: persistedUserReducer,
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