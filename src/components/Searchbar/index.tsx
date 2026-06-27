'use client';

import {
  getRecentSearches,
  addLocalStorageSearchs,
  updateRecentSearches,
} from '@/utils/saerch';
import Image from 'next/image';
import { KeyboardEvent, MouseEvent, forwardRef, useState } from 'react';

interface Props {
  onSubmit: (keyword: string) => void;
}

const Searchbar = forwardRef<HTMLInputElement, Props>(({ onSubmit }, ref) => {
  const [showRecent, setShowRecent] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const getInputEl = () => {
    if (typeof ref === 'function' || !ref) return null;
    return ref.current;
  };

  const handleFocus = () => {
    setRecentSearches(getRecentSearches());
    setShowRecent(true);
  };

  const handleBlur = () => {
    setShowRecent(false);
  };

  const handleSubmit = () => {
    const keyword = getInputEl()?.value?.trim();

    if (!keyword) return;

    setRecentSearches(updateRecentSearches(keyword));
    onSubmit(keyword);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const handleRecentClick = (keyword: string) => {
    const inputEl = getInputEl();
    if (inputEl) inputEl.value = keyword;
    setRecentSearches(updateRecentSearches(keyword));
    onSubmit(keyword);
    setShowRecent(false);
  };

  const handleRemove = (keyword: string, e: MouseEvent) => {
    e.stopPropagation();
    const next = getRecentSearches().filter(s => s !== keyword);
    addLocalStorageSearchs(next);
    setRecentSearches(next);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 w-[480px] h-[50px] p-[15px] rounded-[100px] bg-cool-gray-50">
        <button type="button" onClick={handleSubmit}>
          <Image src="/search.svg" alt="search" width={30} height={30} />
        </button>
        <input
          ref={ref}
          type="text"
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="검색어를 입력하세요"
          className="flex-1 outline-none bg-transparent text-[16px] font-medium text-[#353C49] placeholder:text-[#8D94A0]"
        />
      </div>
      {showRecent && recentSearches.length > 0 && (
        <ul className="absolute top-[calc(100%+6px)] left-0 w-full bg-cool-gray-50 rounded-2xl py-1 z-10">
          {recentSearches.map(keyword => (
            <li
              key={keyword}
              className="flex items-center justify-between px-[15px] py-[9px] cursor-pointer first:rounded-t-2xl last:rounded-b-2xl"
              onMouseDown={e => e.preventDefault()}
              onClick={() => handleRecentClick(keyword)}
            >
              <span className="text-[14px] text-[#6D7582]">{keyword}</span>
              <button
                type="button"
                className="text-[#8D94A0] hover:text-[#353C49] flex items-center"
                onMouseDown={e => e.preventDefault()}
                onClick={e => handleRemove(keyword, e)}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M12 4L4 12M4 4l8 8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

Searchbar.displayName = 'Searchbar';
export default Searchbar;
