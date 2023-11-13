import { getAllPosts } from '@/services/getPosts';
import { Metadata } from "next";

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

// Для того что бы у нас работал SSG нам нужно экспортировать отсюда generateStaticParams.
export async function generateStaticParams() {
  const posts: any[] = await getAllPosts();

  // Нам нужно получить все посты, обойти их и создать структуру на базе которой у нас будут формироваться ссылки.
  // Здесь вернется массив объектов с единственным полем slug: [id]. (slug зарезервированное слово)
  return posts.map((post) => ({
    slug: post.id.toString(),
  }))
}

type Props = {
  params: {
    id: string; 
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getData(params.id);
  return {
    title: post.title,
  };
}

const Post = async ({ params }: Props) => {
  const post = await getData(params.id);

  return (
    <>
      <h2>{post.title}</h2>
      <p>{post.body}</p>
    </>
  );
};

export default Post;
