import { getAllPosts } from '@/services/getPosts';
import { Metadata } from "next";

import Image from 'next/image';

// Здесь не ссылка на ресурс как в React, а обхект со свойствами: src, ширина, высота и прочее.
import img1 from '../../../assets/1.jpg';
import img2 from '../../../assets/2.jpg';

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
    <div style={{display: 'flex', flexDirection: 'column' , alignItems: 'center', justifyContent: 'center'}}>
      <h2>{post.title}</h2>
      <div style={{width: '500px'}}>
      <Image
        style={{width: '100%', height: 'auto'}}
        className={`sd`}
        //initial={``}
        //animate={``}
        alt={`Woman`} // Обязательный проп.
        // Автоматически передается и ширина с высотой.
        src={img1.src} // Обязательный проп. Ширина и высота тоже обязательные.
        // Если указываем в src строку с адресом, то ширину и высоту нужно указывать вручную. Это для того что бы браузер резервовал место под img.
        width={500} 
        height={1000}
        priority // Изображение в видемой облости загрузится в с самым высоким приоритетом.
      />
      </div>

      <p>{post.body}</p>
    </div>
  );
};

export default Post;
