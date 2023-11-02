import { configureStore } from '@reduxjs/toolkit';
import postsSlice from './features/postsSlice';


const store = configureStore({
  reducer: {posts: postsSlice},
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;