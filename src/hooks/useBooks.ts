import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import type { Book } from '../types/book';

export function useBooks(search?: string) {
  return useLiveQuery(async () => {
    let collection = db.books.orderBy('createdAt').reverse();
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      return (await collection.toArray()).filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.authors.toLowerCase().includes(q) ||
          b.isbn.includes(q)
      );
    }
    return collection.toArray();
  }, [search]);
}

export function useBook(id: number | undefined) {
  return useLiveQuery(
    () => (id != null ? db.books.get(id) : undefined),
    [id]
  );
}

export async function addBook(
  book: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>
): Promise<number> {
  const now = new Date();
  return db.books.add({ ...book, createdAt: now, updatedAt: now });
}

export async function updateBook(
  id: number,
  changes: Partial<Book>
): Promise<void> {
  await db.books.update(id, { ...changes, updatedAt: new Date() });
}

export async function deleteBook(id: number): Promise<void> {
  await db.books.delete(id);
}

export async function findByISBN(isbn: string): Promise<Book | undefined> {
  return db.books.where('isbn').equals(isbn).first();
}
