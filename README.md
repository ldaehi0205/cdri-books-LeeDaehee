## 개요

cdri 기술 과제 제출을 위한 프로젝트입니다.
도서 검색 및 북마크 기능을 구현했으며, 공통 컴포넌트와 모듈화를 통해 재사용성을 높였으며, 성능 최적화를 고려한 구조로 개발했습니다.

## 강조 기능 및 주요 코드

1. 무한 스크롤을 적용해 검색 결과를 점진적으로 로드함으로써 네트워크 트래픽을 절감

- useInfiniteQuery를 활용해 검색 결과를 페이지 단위로 관리했습니다. queryKey에 검색어와 검색 옵션이 변경될 때 자동으로 refetch되도록 했습니다. 10개씩 호출하도록 설정했고 getNextPageParam에서는 API의 is_end 값을 활용해 더 이상 데이터가 없으면 추가 요청을 중단하여 불필요한 네트워크 호출을 방지했습니다. 또한 enabled 옵션으로 검색어가 있을 때만 요청을 수행해 불필요한 API 호출을 막았습니다.

```js
useInfiniteQuery({
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
```

2. 가상화를 적용해 렌더링되는 DOM 수를 최소화하고, 다수 이미지 렌더링에 따른 메인 스레드 블로킹을 방지

- useWindowVirtualizer를 사용해 리스트 가상화를 적용했습니다. 전체 데이터를 모두 렌더링하지 않고 현재 화면에 보이는 아이템과 주변 아이템(overscan)만 렌더링하여 DOM 노드 수를 줄였습니다. 이를 통해 스크롤 성능을 개선하고, 이미지가 많은 리스트에서도 메인 스레드의 렌더링 부하를 최소화했습니다.

```js
const rowVirtualizer = useWindowVirtualizer({
  count: books.length,
  estimateSize: () => 100,
  overscan: 3,
});
```

3. 검색 요청 시 이전 API 호출을 Abort 처리하여 응답 순서가 뒤바뀌는 문제를 방지하고, 최신 검색 결과의 일관성을 유지

- useInfiniteQuery에서 제공하는 AbortSignal을 활용해 이전 요청을 취소하도록 구현했습니다. 네트워크 지연으로 이전 요청의 응답이 늦게 도착하더라도 최신 요청만 처리하여 오래된 검색 결과가 화면에 반영되지 않도록 했습니다.

```js
export const fetchBooks = async (
  params: BookSearchParams,
  signal?: AbortSignal,
) => {
  const { data } = await axios.get<BooksResponse>(SEARCH_KAKAO_API, {
    headers: {
      Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_REST_API_KEY}`,
    },
    params,
    signal,
  });
  return data;
};
```

4. 무한 스크롤 데이터 조회 실패 시 재시도 가능한 cta 버튼 제공

- isFetchNextPageError가 발생했을 때 단순히 에러 상태로 종료하지 않고, 사용자가 다시 시도할 수 있도록 Retry CTA를 제공했습니다. 일시적인 네트워크 오류에도 사용자가 현재까지 조회한 데이터를 유지한 채 다음 페이지를 다시 요청할 수 있도록 구현하여 사용자 경험을 개선했습니다.

```js
{
  isFetchNextPageError && (
    <div className="flex flex-col items-center gap-3 py-4">
      <p className="text-[#6D7582]">목록을 불러오지 못했습니다.</p>
      <Button
        variant={BUTTON.variant.outline}
        size={BUTTON.size.sm}
        className="w-[120px]"
        onClick={() => fetchNextPage()}
      >
        다시 시도
      </Button>
    </div>
  );
}
```

5. localStorage를 활용해 북마크와 최근 검색어를 영속적으로 관리

- localStorage를 활용해 북마크와 최근 검색어를 영속적으로 관리했으며, 북마크 상태는 Map으로 관리해 빈번한 조회·추가·삭제를 효율적으로 수행할 수 있도록 구현했습니다.

```js
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
```

## 기술 스택

| 분류           | 기술                         |
| -------------- | ---------------------------- |
| 프레임워크     | Next.js(App Router)          |
| 언어           | TypeScript                   |
| 스타일         | Tailwind CSS                 |
| 서버 상태 관리 | TanStack Query (React Query) |
| 가상화         | TanStack Virtual             |

1. TanStack Virtual 사용 이유

- 프로젝트에서 TanStack Query를 사용하고 있었기 때문에 생태계가 잘 맞았고, useWindowVirtualizer처럼 훅 기반 API를 제공해 React와 자연스럽게 연동할 수 있었습니다. 또한 필요한 기능만 제공하는 가벼운 라이브러리라 리스트 가상화 구현에 적합하다고 판단했습니다.

## 프로젝트 구조

```
src/
├── app/																# 페이지 단위 폴더
│   ├── books/
│   ├── bookmarks/
├── components/													# 재사용 가능한 컴포넌트 폴더
│   ├── Book/
│   ├── Button/
│   ├── Header/
│   ├── Searchbar/
├── hooks/															# 재사용 가능한 기능별 커스텀 훅
├── service/														# API 호출 모듈
├── constants/													# 공통 상수
├── utils/															# 공통 함수
└── type/
```

## 개발 환경

- "node": ">=20.9.0",
- "npm": ">=10"

## 설치 및 실행

- `npm install`
- `npm run dev` : http://localhost:3000 개발용 모드로 실행
