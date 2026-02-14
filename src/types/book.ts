export interface Book {
  id?: number;
  isbn: string;
  title: string;
  authors: string;
  publisher: string;
  publishedDate: string;
  description: string;
  thumbnail: string;
  pageCount: number;
  memo: string;
  createdAt: Date;
  updatedAt: Date;
}
