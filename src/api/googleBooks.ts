import type { Book } from '../types/book';

interface GoogleBooksVolume {
  totalItems: number;
  items?: Array<{
    volumeInfo: {
      title?: string;
      authors?: string[];
      publisher?: string;
      publishedDate?: string;
      description?: string;
      pageCount?: number;
      imageLinks?: {
        thumbnail?: string;
        smallThumbnail?: string;
      };
    };
  }>;
}

export async function fetchBookByISBN(
  isbn: string
): Promise<Partial<Book> | null> {
  const res = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
  );
  if (!res.ok) return null;

  const data: GoogleBooksVolume = await res.json();
  if (!data.items || data.items.length === 0) return null;

  const info = data.items[0].volumeInfo;
  return {
    isbn,
    title: info.title ?? '',
    authors: (info.authors ?? []).join(', '),
    publisher: info.publisher ?? '',
    publishedDate: info.publishedDate ?? '',
    description: info.description ?? '',
    thumbnail: info.imageLinks?.thumbnail ?? '',
    pageCount: info.pageCount ?? 0,
  };
}
