import Button from '@/components/Button';
import { BUTTON } from '@/components/Button/constants';
import { cn } from '@/utils/style';
import Image from 'next/image';

const heart = '/heart.svg';
const arrow = '/arrow.svg';
const emptyBook = '/emptyBook.svg';

interface Props {
  book: BookDocument;
  isOpen: boolean;
  hasOpened: boolean;
  handleOpenBookItem: (isbn: string | null) => void;
  handleBookmark: (book: BookDocument) => void;
  isBookmark: boolean;
}

const BookDetail = ({
  book,
  isOpen,
  hasOpened,
  handleOpenBookItem,
  handleBookmark,
  isBookmark,
}: Props) => {
  const { thumbnail, title, authors, contents, price, sale_price, url } = book;

  return (
    <div
      className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
        isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
      }`}
    >
      <div className="overflow-hidden">
        {hasOpened && (
          <div className="flex gap-6 px-6 py-5 bg-white border-b border-[#D2D6DA]">
            <div className="relative flex-shrink-0">
              <Image
                height={280}
                width={210}
                src={thumbnail || emptyBook}
                alt={title}
                className="w-[210px] h-[280px] object-cover"
              />
              <div className="absolute top-[5%] right-[5%] w-[10%] aspect-square">
                <Image
                  src={heart}
                  alt="북마크"
                  fill
                  className={`object-contain cursor-pointer transition-opacity ${
                    isBookmark ? 'opacity-100' : 'opacity-30'
                  }`}
                  onClick={() => handleBookmark(book)}
                />
              </div>
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-start justify-between mb-5">
                <div className="min-w-0 mr-4">
                  <p className="text-[18px] font-bold leading-tight">{title}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {authors.join(', ')}
                  </p>
                </div>
                <Button
                  variant={BUTTON.variant.secondary}
                  size={BUTTON.size.md}
                  className="w-[115px] gap-[5px]"
                  onClick={() => handleOpenBookItem(null)}
                >
                  상세보기
                  <Image
                    src={arrow}
                    alt=""
                    width={14}
                    height={8}
                    className="rotate-180"
                  />
                </Button>
              </div>

              <div className="flex gap-6 flex-1">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1A1A1A] mb-2">
                    책 소개
                  </p>
                  <p className="text-sm leading-[1.8] line-clamp-6">
                    {contents}
                  </p>
                </div>

                <div className="flex flex-col justify-end flex-shrink-0 w-[160px]">
                  <div className="flex flex-col gap-[6px]">
                    <div
                      className={cn(
                        'flex items-center justify-end gap-[10px]',
                        price === sale_price ? 'text-black' : 'text-gray-400',
                      )}
                    >
                      <span className="text-sm">원가</span>
                      <span
                        className={cn(
                          'text-[16px]',
                          price !== sale_price ? 'line-through' : 'font-bold',
                        )}
                      >
                        {price?.toLocaleString()}원
                      </span>
                    </div>
                    {price !== sale_price && (
                      <div className="flex items-center justify-end gap-[10px]">
                        <span className="text-sm text-gray-700">할인가</span>
                        <span className="text-[16px] font-bold">
                          {sale_price > 0 ? sale_price?.toLocaleString() : 0}원
                        </span>
                      </div>
                    )}
                  </div>
                  <Button
                    size={BUTTON.size.md}
                    className="w-full mt-4"
                    onClick={() => window.open(url, '_blank')}
                  >
                    구매하기
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetail;
