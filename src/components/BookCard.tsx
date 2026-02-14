import { Link } from 'react-router-dom';
import type { Book } from '../types/book';

interface Props {
  book: Book;
}

export default function BookCard({ book }: Props) {
  return (
    <Link to={`/book/${book.id}`} className="book-card">
      {book.thumbnail ? (
        <img
          className="book-card-thumbnail"
          src={book.thumbnail}
          alt={book.title}
          loading="lazy"
        />
      ) : (
        <div className="book-card-placeholder">📖</div>
      )}
      <div className="book-card-info">
        <div className="book-card-title">{book.title}</div>
        {book.authors && (
          <div className="book-card-author">{book.authors}</div>
        )}
      </div>
    </Link>
  );
}
