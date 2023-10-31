import { Metadata } from "next";

// На динамической странице также создаётся функция полученния данных.
async function getData(id: string) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`,
    {
      next: {
        revalidate: 60,
      },
    }
  );

  return response.json();
}

// Это что, придется типизировать каждую динамическую страицу?
type Props = {
  params: {
    id: string; // <- id потому что мы назвали папку id.
  };
};

// Для вложенных динамических страниц работа с методатой - сложнее.
// Мы экспортируем не объект а функцию, которая принимает теже самый параметры что и комонент page и возвращает промис с сигнатурой Metadata.
// Без async тоже работает.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // При работе с методатой динамических pages, мы делаем запрос getData на основе params.id. (Это же целых два запроса. Все ок???)
  const post = await getData(params.id);

  return {
    title: post.title,
  };
}

// Из за того что мы именовали папку [id] у нас есть доступ к параметрам.
const Post = async ({ params }: Props) => {
  const post = await getData(params.id);

  // ! Так как это серверные компоненты, все c.l() будут отрабатывать на сервере.
  console.log(post)

  return (
    <>
    {/* Для пользователя это будет просто html-разметка, никакого другого js пользователь не получит*/}
      <h2>{post.title}</h2>
      <p>{post.body}</p>
    </>
  );
};

export default Post;
