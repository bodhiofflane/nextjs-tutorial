"use client";
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
  return navLinks.map((item, index) => {
    const isActive = pathname === item.href;

    return (
      <Link key={item.label} href={item.href} className={isActive ? 'active' : ''}>
        {item.label}
      </Link>
    );
  });
};

export default Navigation;
