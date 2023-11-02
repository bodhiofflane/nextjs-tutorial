"use client";

import { getPostsBySearch } from '@/services/getPosts';
import { useState } from "react";

type Props = {
  onSearch: (query: string) => void;
};

const PostSearch = ({ onSearch }: Props) => {
  const [search, setSearch] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSearch(search);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="search"
        placeholder="Search"
        value={search}
        onChange={(event) => {
          setSearch(event.target.value);
        }}
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default PostSearch;
