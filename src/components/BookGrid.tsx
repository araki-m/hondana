import type { Book } from '../types/book';
import BookCard from './BookCard';

interface Props {
  books: Book[];
}

export default function BookGrid({ books }: Props) {
  if (books.length === 0) {
    return (
      <div className="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15z" />
        </svg>
        <p>本がまだ登録されていません</p>
        <p style={{ fontSize: '0.82rem', marginTop: 4 }}>
          「登録」または「スキャン」から追加しましょう
        </p>
      </div>
    );
  }

  return (
    <div className="book-grid">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
