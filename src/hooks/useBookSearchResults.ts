import { QUERY_KEY } from '@/constants/queryKey';
import { fetchBooks } from '@/service/api';
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
          ...(submittedQuery.target && { target: submittedQuery.target }),
        },
        signal,
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.meta.is_end || lastPage.documents.length === 0)
        return undefined; // 더이상 호출할 데이터 없으면 재호출 하지 않는다.
      return lastPageParam + 1;
    },
    enabled: !!submittedQuery.query.trim(),
  });

  const books = data?.pages.flatMap(p => p.documents) ?? [];
  const totalCount = data?.pages[0]?.meta.total_count ?? 0;

  // window 스크롤 기준으로 도서 목록 가상화한다.
  const rowVirtualizer = useWindowVirtualizer({
    count: books.length,
    estimateSize: () => 100,
    overscan: 3,
  });
  const virtualItems = rowVirtualizer.getVirtualItems();

  // 리스트 하단에 가까워지면 다음 페이지 조회
  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];
    if (!lastItem) return;
    if (
      // 마지막 아이템이 현재 목록의 끝에 가까워졌을 때
      lastItem.index >= books.length - 3 &&
      // 다음 페이지가 존재
      hasNextPage &&
      // 현재 추가 요청 중이 아닐때
      !isFetchingNextPage &&
      // 이전 추가 요청이 실패한 상태가 아닐 때
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
