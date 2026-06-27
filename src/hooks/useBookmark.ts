import { addLocalStorageBookmark, getBookmark } from '@/utils/bookmark';
import { useEffect, useState } from 'react';

const useBookmark = () => {
  const [savedBooks, setSavedBooks] = useState<Map<string, BookDocument>>(
    () => new Map(),
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSavedBooks(getBookmark());
  }, []);

  const handleBookmark = (book: BookDocument) => {
    setSavedBooks(prev => {
      const next = new Map(prev);

      if (next.has(book.isbn)) {
        next.delete(book.isbn);
      } else {
        next.set(book.isbn, book);
      }

      addLocalStorageBookmark(next);

      return next;
    });
  };

  return { savedBooks, handleBookmark };
};

export default useBookmark;
