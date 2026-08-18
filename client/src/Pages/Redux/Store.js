import { configureStore } from '@reduxjs/toolkit'
import userReducer from './User/UserSlice'



export const store = configureStore({ reducer: {user:userReducer}, 
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
    devTools: true,
})
// The store now has redux-thunk added and the Redux DevTools Extension is turned on