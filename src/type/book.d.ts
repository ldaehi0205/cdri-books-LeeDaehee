interface BookDocument {
  title: string;
  authors: string[];
  publisher: string;
  thumbnail: string;
  isbn: string;
  price: number;
  sale_price: number;
  contents: string;
  url: string;
}

interface BooksResponse {
  documents: BookDocument[];
  meta: {
    total_count: number;
    pageable_count: number;
    is_end: boolean;
  };
}

type TSelectOption = 'title' | 'person' | 'publisher';
