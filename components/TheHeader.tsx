import Link from "next/link";

const TheHeader = () => {
  return (
    <header>
      <nav>
        {/* Навигация осуществляется с помощью компонента Link из модуля 'next/link'. У Link дефолтные пропсы тега a.*/}
        <Link href={"/"}>Home</Link>
        <Link href={"/blog"}>Blog</Link>
        <Link href={"/about"}>About</Link>
      </nav>
    </header>
  );
};

export default TheHeader;
