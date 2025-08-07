import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice"
import postReducer from "./slices/postSlice"
import commentReducer from "./slices/commentSlice"

export const store = configureStore({
    reducer:{
        user: userReducer,
        post: postReducer,
        comment: commentReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch