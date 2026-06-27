'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';

import { BUTTON } from '@/components/Button/constants';
import Button from '@/components/Button/index';
import useBookmark from '@/hooks/useBookmark';
import useBookSearchResults from '@/hooks/useBookSearchResults';
import Searchbar from '@/components/Searchbar';
import { QUERY_STATUS } from '@/constants/queryKey';

import BookItem from '../../components/Book/BookItem';
import BookDetail from '../../components/Book/BookDetail';
import SearchDetailModal from './_components/SearchDetailModal';

const Page = () => {
  const [openIsbn, setOpenIsbn] = useState<string | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [everOpened, setEverOpened] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  const { savedBooks, handleBookmark } = useBookmark();
  const {
    books,
    status,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
    setSubmittedQuery,
    submittedQuery,
    totalCount,
    virtualItems,
    rowVirtualizer,
  } = useBookSearchResults();

  const handleOpenBookItem = (isbn: string | null) => {
    if (isbn) setEverOpened(prev => new Set(prev).add(isbn));
    setOpenIsbn(prev => (prev === isbn ? null : isbn));
  };

  const isLoading = !!submittedQuery.query && status === QUERY_STATUS.pending;
  const isEmpty =
    !submittedQuery.query ||
    (status === QUERY_STATUS.success && books.length === 0);
  const isError = status === QUERY_STATUS.error;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <p className="text-[22px] font-bold">도서 검색</p>
        <div className="flex items-center gap-4">
          <Searchbar
            ref={inputRef}
            onSubmit={keyword => {
              setOpenIsbn(null);
              setSubmittedQuery({ query: keyword ?? '', target: '' });
            }}
          />
          <div className="relative">
            <Button
              variant={BUTTON.variant.outline}
              size={BUTTON.size.sm}
              className="w-[76px]"
              onClick={() => setDetailModalOpen(prev => !prev)}
            >
              상세검색
            </Button>
            {detailModalOpen && (
              <SearchDetailModal
                onClose={() => setDetailModalOpen(false)}
                onSearch={(target, query) => {
                  setOpenIsbn(null);
                  setDetailModalOpen(false);
                  if (inputRef.current) inputRef.current.value = query;
                  setSubmittedQuery({ target, query });
                }}
              />
            )}
          </div>
        </div>
      </div>

      <div>
        <span className="mr-[10px]">도서 검색 결과 </span>
        <span>총 </span>
        <span className="text-blue-500">{totalCount}</span>
        <span>건</span>
      </div>
      {/* 로딩 케이스 */}
      {isLoading && (
        <div className="flex justify-center items-center mt-[100px]">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {/* 도서 없는 케이스 */}
      {isEmpty && (
        <div className="flex flex-col justify-center items-center h-full gap-5 font-medium text-[#6D7582] mt-[100px]">
          <Image
            height={80}
            width={80}
            src="/emptyBook.svg"
            alt=""
            loading="eager"
          />
          <p>검색된 결과가 없습니다.</p>
        </div>
      )}
      {/* 에러 케이스 */}
      {isError && (
        <div className="flex justify-center items-center mt-[100px] text-[#6D7582]">
          <p>오류가 발생했습니다. 다시 시도해 주세요.</p>
        </div>
      )}
      {/* 도서 목록 출력될 경우 */}
      {!isLoading && !isEmpty && !isError && (
        <ul
          className="relative"
          style={{
            height: rowVirtualizer.getTotalSize(),
          }}
        >
          {virtualItems.map(virtualItem => {
            const book = books[virtualItem.index];
            if (!book) return null;
            const isOpen = openIsbn === book.isbn;
            const isBookmark = savedBooks.has(book.isbn);
            const hasOpened = everOpened.has(book.isbn);
            return (
              <li
                key={virtualItem.key}
                data-index={virtualItem.index}
                ref={rowVirtualizer.measureElement}
                className="absolute top-0 left-0 w-full pb-2"
                style={{
                  transform: `translateY(${virtualItem.start - rowVirtualizer.options.scrollMargin}px)`,
                }}
              >
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
              </li>
            );
          })}
        </ul>
      )}
      {isFetchingNextPage && <p className="text-center">불러오는 중...</p>}
      {/* 에러시 재호출 cta */}
      {isFetchNextPageError && (
        <div className="flex flex-col items-center gap-3 py-4">
          <p className="text-[#6D7582]">목록을 불러오지 못했습니다.</p>
          <Button
            variant={BUTTON.variant.outline}
            size={BUTTON.size.sm}
            className="w-[120px]"
            onClick={() => fetchNextPage()}
          >
            다시 시도
          </Button>
        </div>
      )}
    </div>
  );
};

export default Page;
