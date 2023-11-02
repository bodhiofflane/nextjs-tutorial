// API в Next.js использутся для получения/добавления данных именно через клиентскую часть приложения.
// В дальнейшем на клиенте будем использовать серверные экшены, но они только в альфе.

import { NextResponse } from 'next/server';
import {posts} from '@/app/api/posts/posts';

// Проверим со стрелочной. Реквест типизируется типом Request, который доступен на глобальном уровне. Т.е. запрос обычного браузерного апи.
export const GET = async (req: Request) => {
  const {searchParams} = new URL(req.url);

  const query = searchParams.get('q');

  let currentPosts = posts;

  if (query) {
    currentPosts = posts.filter(post => post.title.toLowerCase().includes(query));
  }

  // Возвращаем расширенный объект response из 'next/server'.
  return NextResponse.json(currentPosts);
}

// Как итог, мы можем использовать это API из клиентских компонентов, для того что бы получать отсюда данные из базы данных. Хорошая ли это практика?

export const POST = async (req: Request) => {
  const body = await req.json();

  console.log(body);
  return NextResponse.json(body);
}