'use client';

import Button from '@/components/Button';
import { BUTTON } from '@/components/Button/constants';
import { cn } from '@/utils/style';
import Image from 'next/image';

const arrow = '/arrow.svg';
const heart = '/heart.svg';
const emptyBook = '/emptyBook.svg';

type BookItemProps = {
  book: BookDocument;
  isOpen: boolean;
  handleOpenBookItem: (isbn: string) => void;
  handleBookmark: (book: BookDocument) => void;
  isBookmark: boolean;
};

const BookItem = ({
  book,
  isOpen,
  handleOpenBookItem,
  handleBookmark,
  isBookmark,
}: BookItemProps) => {
  const { isbn, thumbnail, title, authors, sale_price, url } = book;
  return (
    <div
      key={isbn}
      className="flex items-center border-b border-b-[#D2D6DA] px-4 h-[100px] gap-4"
    >
      <div className="relative flex-shrink-0">
        <Image
          height={68}
          width={48}
          src={thumbnail || emptyBook}
          alt={title}
          className="w-[48px] h-[68px] object-cover"
        />
        <Image
          width={20}
          height={20}
          src={heart}
          alt="북마크"
          className={cn(
            'absolute top-[5%] right-[5%] w-[20%] h-auto cursor-pointer transition-opacity',
            isBookmark ? 'opacity-100' : 'opacity-30',
          )}
          onClick={() => handleBookmark(book)}
        />
      </div>
      <div className="flex flex-1 min-w-0 gap-[10px]">
        <p className="font-bold truncate">{title}</p>
        <p className="text-sm leading-[1.8] text-gray-600 truncate">
          {authors}
        </p>
      </div>
      <div className="w-[120px] text-right text-[18px] font-bold flex-shrink-0">
        {sale_price > 0 ? sale_price.toLocaleString() : 0}원
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <Button
          size={BUTTON.size.md}
          className="w-[115px]"
          onClick={() => window.open(url, '_blank')}
        >
          구매하기
        </Button>
        <Button
          variant={BUTTON.variant.secondary}
          size={BUTTON.size.md}
          className="w-[115px] gap-[5px]"
          onClick={() => handleOpenBookItem(isbn)}
        >
          상세보기
          <Image
            src={arrow}
            alt=""
            width={14}
            height={8}
            className={cn(
              'transition-transform duration-300',
              isOpen && 'rotate-180',
            )}
          />
        </Button>
      </div>
    </div>
  );
};

export default BookItem;
