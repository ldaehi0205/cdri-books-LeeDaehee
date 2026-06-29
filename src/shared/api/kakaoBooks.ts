import axios from 'axios';

const SEARCH_KAKAO_API = 'https://dapi.kakao.com/v3/search/book';

interface BookSearchParams {
  query: string;
  size: number;
  page: number;
  target?: TSelectOption;
}

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
