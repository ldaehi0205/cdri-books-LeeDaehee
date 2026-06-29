'use client';

import Image from 'next/image';
import React, { useMemo, useState } from 'react';

import { BookItem, BookDetail } from '@/entities/book';
import { useBookmark } from '@/features/bookmark';

const Page = () => {
  const [openIsbn, setOpenIsbn] = useState<string | null>(null);
  const [everOpened, setEverOpened] = useState<Set<string>>(new Set());
  const { savedBooks, handleBookmark } = useBookmark();

  const allBooks = useMemo(() => [...savedBooks.values()], [savedBooks]);

  const handleOpenBookItem = (isbn: string | null) => {
    if (isbn) setEverOpened(prev => new Set(prev).add(isbn));
    setOpenIsbn(prev => (prev === isbn ? null : isbn));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <p className="text-[22px] font-bold">내가 찜한 책</p>
      </div>
      <div>
        <span className="mr-[10px]">도서 검색 결과 </span>
        <span>총 </span>
        <span className="text-blue-500">{allBooks.length}</span>
        <span>건</span>
      </div>
      {allBooks.length === 0 && (
        <div className="flex flex-col justify-center items-center h-full gap-5 font-medium text-[#6D7582] mt-[100px]">
          <Image
            height={80}
            width={80}
            src="/emptyBook.svg"
            alt=""
            loading="eager"
          />
          <p>찜한 책이 없습니다.</p>
        </div>
      )}
      <ul className="flex flex-col gap-2">
        {allBooks.map(book => {
          const isOpen = openIsbn === book.isbn;
          const isBookmark = savedBooks.has(book.isbn);
          const hasOpened = everOpened.has(book.isbn);
          return (
            <React.Fragment key={book.isbn}>
              <BookItem
                book={book}
                isOpen={isOpen}
                handleOpenBookItem={handleOpenBookItem}
                handleBookmark={handleBookmark}
                isBookmark={isBookmark}
              />
              <BookDetail
                book={book}
                isOpen={isOpen}
                hasOpened={hasOpened}
                handleOpenBookItem={handleOpenBookItem}
                handleBookmark={handleBookmark}
                isBookmark={isBookmark}
              />
            </React.Fragment>
          );
        })}
      </ul>
    </div>
  );
};

export default Page;
