import { NextResponse } from 'next/server';

// Набор хелперов:
import {headers, cookies} from 'next/headers';

// Удалить статью находясь на ней, мы можем редиректнуть юзера в место куда нужно.
import {redirect} from 'next/navigation';

export async function DELETE(req: Request, {params}: {params: {id: string}} ) {
  const id = params.id;
  // ... логика удаления ...

  // Получаем сущность с типом ReadonlyHeaders.
  const headerList = headers(); // Это что-то вроде хука, который возвращает посланные в request заголовки?

  // Получаем куки который был отправлен на /api/posts/[id]
  const coockieList = cookies();
  const coo2 = coockieList.get('Cookie_2');

  const type = headerList.get('Content-Type');
 
  // Редиректит пользователя на страницу блога.
  // redirect('/blog');
  return NextResponse.json({id, message: 'Пост удалён', type, coo2});
}