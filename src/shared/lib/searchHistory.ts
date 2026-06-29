const RECENT_SEARCHES_KEY = 'recentSearches';
const MAX_RECENT_SEARCHES = 8;

export const getRecentSearches = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) ?? '[]');
  } catch {
    return [];
  }
};

export const addLocalStorageSearches = (next: string[]) => {
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
};

export const updateRecentSearches = (keyword: string): string[] => {
  const filtered = getRecentSearches().filter(s => s !== keyword);
  const next = [keyword, ...filtered].slice(0, MAX_RECENT_SEARCHES);
  addLocalStorageSearches(next);
  return next;
};
