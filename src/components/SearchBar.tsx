import { useEffect, useRef, useState } from 'react';

interface Props {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: Props) {
  const [value, setValue] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onSearch(value), 300);
    return () => clearTimeout(timerRef.current);
  }, [value, onSearch]);

  return (
    <div className="search-bar">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        placeholder="タイトル・著者・ISBNで検索..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
