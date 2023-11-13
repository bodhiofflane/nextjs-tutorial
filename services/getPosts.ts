export const getAllPosts = async () => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts`, {
    //cache: 'force-cache', // Всегда храни кеш. Происходит и так.
    // cache: 'no-cache', // Не храни кеш вообще. Для страниц которые часто обновляются. Всегда будет SSR, при каждом запросе пользователя.
    // next: {revalidate: 10}, // Ревалидация через указанное время. Здень нужно конкретное значение без вычеслений.
  });

  if (!response.ok) {
    throw new Error("Не удалось получить посты");
  }

  return response.json();
};

export const getPostsBySearch = async (search: string) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?q=${search}`
  );

  if (!response.ok) {
    throw new Error("Не удалось получить посты");
  }

  return response.json();
};
