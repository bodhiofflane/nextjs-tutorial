import { createAsyncThunk } from '@reduxjs/toolkit';

export const getAllPostsThunk = createAsyncThunk(
  'posts/getAllPosts',
  async () => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts`);

    if (!response.ok) {
      throw new Error('Не удалось получить посты');
    }
  
    return response.json();
  }
);

export const getPostsBySearchThunk = createAsyncThunk(
  'posts/getPostsBySearch',
  async (query: string) => {
    console.log(query)
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts?q=${query}`);

    if (!response.ok) {
      throw new Error('Не удалось получить посты');
    }

    return response.json();
  }
)