export const BOOK_SELECT_OPTIONS = {
  title: 'title',
  person: 'person',
  publisher: 'publisher',
} as const;

export const SEARCH_TYPES = [
  {
    name: '제목',
    key: BOOK_SELECT_OPTIONS.title,
  },
  { name: '저자명', key: BOOK_SELECT_OPTIONS.person },
  { name: '출판사', key: BOOK_SELECT_OPTIONS.publisher },
] as const;
