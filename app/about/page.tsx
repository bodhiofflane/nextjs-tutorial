import { Metadata } from 'next';

// Меняет метаданные на конктерно этой странице.
export const metadata: Metadata = {
  title: "About | Next App",
  //description: "Generated by create next app",
};

// Экспорт по умолчанию из файла page.tsx, из папки about , гарантирует то что у нас будет путь /about который вернт компонент About.
export default function About() {
  return <h3>Select subitem</h3>
}