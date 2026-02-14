import { useCallback, useState } from 'react';
import { useBooks } from '../hooks/useBooks';
import SearchBar from '../components/SearchBar';
import BookGrid from '../components/BookGrid';

export default function BookListPage() {
  const [search, setSearch] = useState('');
  const books = useBooks(search);

  const handleSearch = useCallback((q: string) => setSearch(q), []);

  if (books === undefined) {
    return <div className="loading">読み込み中...</div>;
  }

  return (
    <>
      <SearchBar onSearch={handleSearch} />
      <BookGrid books={books} />
    </>
  );
}
