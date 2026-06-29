import { QUERY_KEY } from '@/shared/config/queryKey';
import { fetchBooks } from '@/shared/api/kakaoBooks';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useState } from 'react';

const PAGE_SIZE = 10;

const useBookSearchResults = () => {
  const [submittedQuery, setSubmittedQuery] = useState({
    query: '',
    target: '',
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    status,
  } = useInfiniteQuery({
    queryKey: [
      QUERY_KEY.books,
      submittedQuery.query.trim(),
      submittedQuery.target,
    ],
    queryFn: ({ pageParam = 1, signal }) =>
      fetchBooks(
        {
          size: PAGE_SIZE,
          page: pageParam,
          query: submittedQuery.query.trim(),
          ...(submittedQuery.target && { target: submittedQuery.target as TSelectOption }),
        },
        signal,
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.meta.is_end || lastPage.documents.length === 0)
        return undefined;
      return lastPageParam + 1;
    },
    enabled: !!submittedQuery.query.trim(),
  });

  const books = data?.pages.flatMap(p => p.documents) ?? [];
  const totalCount = data?.pages[0]?.meta.total_count ?? 0;

  const rowVirtualizer = useWindowVirtualizer({
    count: books.length,
    estimateSize: () => 100,
    overscan: 3,
  });
  const virtualItems = rowVirtualizer.getVirtualItems();

  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];
    if (!lastItem) return;
    if (
      lastItem.index >= books.length - 3 &&
      hasNextPage &&
      !isFetchingNextPage &&
      !isFetchNextPageError
    ) {
      fetchNextPage();
    }
  }, [
    virtualItems,
    books.length,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  ]);

  return {
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
  };
};

export default useBookSearchResults;
