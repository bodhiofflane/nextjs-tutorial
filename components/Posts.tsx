// Этот компонент вполне может быть серверных, он просто принимает пропсы и рендерит их.
// Здесь нет историй связанных с событиями onClick и прочего...

import Link from 'next/link';

const Posts = ({posts}: {posts: any[]}) => {
  return (
    <ul>
    {posts.map((post: any, index: number) => {
      return (
        // key требуется даже если мы не будуем ререндерить.
        <li key={index}>
          <Link href={`/blog/${post.id}`}>{post.title}</Link>
        </li>
      );
    })}
  </ul>
  );
}
 
export default Posts;