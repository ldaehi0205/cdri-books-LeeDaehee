'use client';

import { PATH } from '@/shared/config/path';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const navLinkClass = (href: string) =>
    `text-sm text-gray-700 hover:text-gray-900 pb-1 ${
      pathname === href ? 'border-b-2 border-blue-500' : ''
    }`;

  return (
    <header className="w-full bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/books"
          className="whitespace-nowrap text-sm font-bold tracking-widest text-gray-900"
        >
          CERTICOS BOOKS
        </Link>
        <nav className="flex justify-center items-center w-[100%] gap-6">
          <Link href="/books" className={navLinkClass(PATH.books)}>
            도서 검색
          </Link>
          <Link href="/bookmarks" className={navLinkClass(PATH.bookmarks)}>
            내가 찜한 책
          </Link>
        </nav>
      </div>
    </header>
  );
}
