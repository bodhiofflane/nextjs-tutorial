"use client";

import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/store/appHooks";
import { getAllPostsThunk, getPostsBySearchThunk } from "@/store/features/postsThunks";

import PostSearch from "@/components/PostSearch";
import Posts from "@/components/Posts";

// Ревалидация по таймеру на конкретной странице. (Существует ревалидация по запросу через события)
export const revalidate = 10; // Через 10 секунд запустится процесс ревалидации.

export default function Blog() {
  const posts = useAppSelector((state) => state.posts.posts);
  const error = useAppSelector((state) => state.posts.error);
  const loading = useAppSelector((state) => state.posts.loading);

  const dispatch = useAppDispatch();

  const getPostsBySearch = (query: string) => {
    dispatch(getPostsBySearchThunk(query));
  };

  useEffect(() => {
    dispatch(getAllPostsThunk());
  }, [dispatch]);

  return (
    <>
      <h1>Blog</h1>
      <PostSearch onSearch={getPostsBySearch} />
      {error ? <h3>{error}</h3> : null}
      {loading ? <h3>Loading posts</h3> : <Posts posts={posts} />}
    </>
  );
}
