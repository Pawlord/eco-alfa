import { configureStore } from "@reduxjs/toolkit";
import foodReducer from './foodSlice';

const store = configureStore({
    reducer: {
        food: foodReducer,
    }
})

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;