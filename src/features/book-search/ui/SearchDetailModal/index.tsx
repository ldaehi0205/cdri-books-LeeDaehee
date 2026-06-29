'use client';

import { BUTTON } from '@/shared/ui/Button/constants';
import Button from '@/shared/ui/Button/index';
import {
  BOOK_SELECT_OPTIONS,
  SEARCH_TYPES,
} from '@/features/book-search/model/constants';
import { cn } from '@/shared/lib/cn';
import { useRef, useState, useEffect } from 'react';

interface SearchDetailModalProps {
  onClose: () => void;
  onSearch: (type: TSelectOption, query: string) => void;
}

const SearchDetailModal = ({ onClose, onSearch }: SearchDetailModalProps) => {
  const [selectedType, setSelectedType] = useState<TSelectOption>(
    BOOK_SELECT_OPTIONS.title,
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleSearch = () => {
    onSearch(selectedType, inputRef.current?.value ?? '');
    onClose();
  };

  return (
    <div
      ref={modalRef}
      className="absolute top-full right-0 mt-2 w-[360px] bg-white rounded-lg translate-x-[40%] translate-y-0 shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-[#E5E8EC] z-50"
    >
      <div className="relative flex flex-col gap-[10px] px-4 pt-4 pb-3">
        <div className="flex justify-end w-[100%]">
          <button
            type="button"
            onClick={onClose}
            className="text-[#8D94A0] hover:text-[#353C49] transition-colors text-lg leading-none cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="flex items-center gap-3 pr-6">
          <div
            ref={dropdownRef}
            className={cn(
              'relative flex-shrink-0 border-b border-[#E5E8EC] cursor-pointer pb-[5px] w-[60px] duration-200 ease-in-out',
              dropdownOpen && 'border-blue-500',
            )}
          >
            <button
              type="button"
              onClick={() => setDropdownOpen(prev => !prev)}
              className="flex items-center gap-1 text-[14px] font-medium text-[#353C49] whitespace-nowrap "
            >
              {SEARCH_TYPES.find(v => v.key === selectedType)?.name}
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
              >
                <path
                  d="M3 5L7 9L11 5"
                  stroke="#353C49"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-[#E5E8EC] rounded-md shadow-md z-10 min-w-[80px]">
                {SEARCH_TYPES.filter(t => t.key !== selectedType).map(
                  ({ name, key }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setSelectedType(key);
                        setDropdownOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-[14px] text-[#353C49] hover:bg-cool-gray-500 transition-colors"
                    >
                      {name}
                    </button>
                  ),
                )}
              </div>
            )}
          </div>

          <div className="w-px h-4 bg-[#E5E8EC] flex-shrink-0" />

          <div className="border-b border-[#E5E8EC] cursor-pointer pb-[5px] w-[100%] duration-200 ease-in-out focus-within:border-blue-500">
            <input
              ref={inputRef}
              type="text"
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="검색어 입력"
              className="flex-1 text-[14px] text-[#353C49] placeholder:text-[#8D94A0] outline-none bg-transparent"
            />
          </div>
        </div>
      </div>

      <div className="p-4">
        <Button
          variant={BUTTON.variant.primary}
          size={BUTTON.size.md}
          onClick={handleSearch}
          className="w-full"
        >
          검색하기
        </Button>
      </div>
    </div>
  );
};

export default SearchDetailModal;
