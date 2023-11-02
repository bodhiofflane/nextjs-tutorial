import { createSlice } from '@reduxjs/toolkit';
import { getAllPostsThunk, getPostsBySearchThunk } from './postsThunks';
import { error } from 'console';
import { stat } from 'fs';

type initialStateType = {
  posts: any[];
  loading: boolean;
  error: string;
};

const initialState = {
  posts: [],
  loading: false,
  error: '',
};

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getAllPostsThunk.pending, (state) => {
        state.error = '';
        state.loading = true;
      })
      .addCase(getAllPostsThunk.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.loading = false;
      })
      .addCase(getAllPostsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      // Search...
      .addCase(getPostsBySearchThunk.pending, (state) => {
        state.error = '';
        state.loading = true;
      })
      .addCase(getPostsBySearchThunk.fulfilled, (state, action) => {
        console.log(action.payload);
        state.posts = action.payload;
        state.loading = false;
      })
      .addCase(getPostsBySearchThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
  },
});

export default postSlice.reducer;