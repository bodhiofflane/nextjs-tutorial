/*
  Layout в конкретных роутах, может выступать как обёртка для рядом лежащих и вложенных page.tsx
  Содержимое всех page.tsx из пути 'about' будет попадать d
*/

import Link from 'next/link';

export default function AboutLayout({children}: {children: React.ReactNode}) {
  return (
    <div>
      <h1>About us</h1>
      <ul>
        {/* В линках, путь пишется всегда целеком */}
        <li><Link href={'/about/contacts'}>Contacts</Link></li>
        <li><Link href={'/about/team'}>Team</Link></li>
      </ul>
      {/* children - это конкретная страница. Либо лежащий рядом page.tsx либо page.jsx ил вложенных роутов */}
      {children}
    </div>
  )
}