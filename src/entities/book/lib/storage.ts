const SAVED_BOOKS_KEY = 'savedBooks';

type BookmarkEntries = [string, BookDocument][];

export const getBookmark = (): Map<string, BookDocument> => {
  try {
    const raw = localStorage.getItem(SAVED_BOOKS_KEY);
    if (!raw) return new Map();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return new Map(parsed as BookmarkEntries);
    }
    return new Map(Object.entries(parsed) as BookmarkEntries);
  } catch {
    return new Map();
  }
};

export const addLocalStorageBookmark = (next: Map<string, BookDocument>) => {
  localStorage.setItem(SAVED_BOOKS_KEY, JSON.stringify([...next.entries()]));
};
