import Dexie, { type Table } from 'dexie';
import type { Book } from '../types/book';

class HondanaDB extends Dexie {
  books!: Table<Book, number>;

  constructor() {
    super('hondana');
    this.version(1).stores({
      books: '++id, isbn, title, authors, createdAt',
    });
  }
}

export const db = new HondanaDB();
