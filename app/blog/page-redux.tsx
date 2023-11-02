"use client";

import PostSearch from '@/components/PostSearch';
import Posts from '@/components/Posts';
import { getAllPosts } from "@/services/getPosts";
import { useAppDispatch, useAppSelector } from '@/store/appHooks';
import { getAllPostsThunk, getPostsBySearchThunk } from '@/store/features/postsThunks';
import {  useEffect} from "react";


export default function Blog() {
  const posts = useAppSelector((state) => state.posts.posts);
  const error = useAppSelector((state) => state.posts.error);
  const loading = useAppSelector((state) => state.posts.loading);

  const dispatch = useAppDispatch();

  const getPostsBySearch = (query: string) => {
    console.log('Слово', query); // Это просто параметр который мы получаем из вложенного компонента. Здесь просто строка 'esse'.
    dispatch(getPostsBySearchThunk(query));
  }

  useEffect(() => {
    dispatch(getAllPostsThunk());
  }, [dispatch]);

  console.log('Это важный',posts)

  return (
    <>
      <h1>Blog</h1>
      <PostSearch onSearch={getPostsBySearch}/>
      {error ? <h3>{error}</h3>: null}
      {loading ? (
        <h3>Loading posts</h3>
      ) : (
        <Posts posts={posts}/>
      )}
    </>
  );
}
