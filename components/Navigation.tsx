"use client";
// Для входа у нас есть роут /api/auth/signin так что нам не понадобится
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // хук типа useParams только от Next.js

// Для каждого клиентского компонента нужно использовать директиву.

type NavLink = {
  label: string;
  href: string;
};
type Props = {
  navLinks: NavLink[];
};

const Navigation = ({ navLinks }: Props) => {
  const pathname = usePathname();

  // Хук из 'next-auth/react' для клиентского компонента. Он должен быть обёрнуть в SessionProvider потому как использует React.Context.
  // Также можно получать на сервере и спускать в Navigation. Позже...
  /* 
    И так, хук вернул объект с data: информация о пользователи, status: loading|authenticated и функией update.
  */
  const session = useSession();

  console.log(session);

  return (
    <>
      {navLinks.map((item, index) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.label}
            href={item.href}
            className={isActive ? "active" : ""}
          >
            {item.label}
          </Link>
        );
      })}

      {session?.data && <Link href={"/profile"}>Profile</Link>}
      {session?.data ? (
        <Link href={"#"} onClick={() => signOut({ callbackUrl: "/" })}>
          Sign Out
        </Link>
      ) : (
        <Link href={"/api/auth/signin"}>Sing In</Link>
      )}
    </>
  );
};

export default Navigation;
