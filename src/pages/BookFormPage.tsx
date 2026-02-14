import { type FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { addBook, updateBook, useBook } from '../hooks/useBooks';
import { fetchBookByISBN } from '../api/googleBooks';

export default function BookFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = id != null;
  const bookId = id ? Number(id) : undefined;
  const existing = useBook(bookId);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isbn, setIsbn] = useState(searchParams.get('isbn') ?? '');
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [publisher, setPublisher] = useState('');
  const [publishedDate, setPublishedDate] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [pageCount, setPageCount] = useState(0);
  const [memo, setMemo] = useState('');
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    if (existing) {
      setIsbn(existing.isbn);
      setTitle(existing.title);
      setAuthors(existing.authors);
      setPublisher(existing.publisher);
      setPublishedDate(existing.publishedDate);
      setDescription(existing.description);
      setThumbnail(existing.thumbnail);
      setPageCount(existing.pageCount);
      setMemo(existing.memo);
    }
  }, [existing]);

  async function handleFetchISBN() {
    if (!isbn.trim()) return;
    setFetching(true);
    setFetchError('');
    try {
      const data = await fetchBookByISBN(isbn.trim());
      if (data) {
        setTitle(data.title ?? '');
        setAuthors(data.authors ?? '');
        setPublisher(data.publisher ?? '');
        setPublishedDate(data.publishedDate ?? '');
        setDescription(data.description ?? '');
        setThumbnail(data.thumbnail ?? '');
        setPageCount(data.pageCount ?? 0);
      } else {
        setFetchError('書籍情報が見つかりませんでした。手動で入力してください。');
      }
    } catch {
      setFetchError('取得に失敗しました。');
    } finally {
      setFetching(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const bookData = {
      isbn,
      title,
      authors,
      publisher,
      publishedDate,
      description,
      thumbnail,
      pageCount,
      memo,
    };

    if (isEdit && bookId != null) {
      await updateBook(bookId, bookData);
      navigate(`/book/${bookId}`);
    } else {
      const newId = await addBook(bookData);
      navigate(`/book/${newId}`);
    }
  }

  return (
    <>
      <h2 className="page-title">{isEdit ? '本を編集' : '本を登録'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>ISBN</label>
          <div className="isbn-row">
            <input
              type="text"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              placeholder="978..."
              inputMode="numeric"
            />
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleFetchISBN}
              disabled={fetching || !isbn.trim()}
            >
              {fetching ? '検索中...' : '検索'}
            </button>
          </div>
          {fetchError && (
            <p style={{ color: 'var(--color-danger)', fontSize: '0.82rem', marginTop: 4 }}>
              {fetchError}
            </p>
          )}
        </div>

        <div className="form-group">
          <label>タイトル *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>著者</label>
          <input
            type="text"
            value={authors}
            onChange={(e) => setAuthors(e.target.value)}
            placeholder="カンマ区切りで複数入力可"
          />
        </div>

        <div className="form-group">
          <label>出版社</label>
          <input
            type="text"
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>出版日</label>
          <input
            type="text"
            value={publishedDate}
            onChange={(e) => setPublishedDate(e.target.value)}
            placeholder="2024-01-01"
          />
        </div>

        <div className="form-group">
          <label>ページ数</label>
          <input
            type="number"
            value={pageCount || ''}
            onChange={(e) => setPageCount(Number(e.target.value) || 0)}
            min="0"
          />
        </div>

        <div className="form-group">
          <label>表紙画像URL</label>
          <input
            type="url"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>説明</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className="form-group">
          <label>メモ</label>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            rows={3}
            placeholder="感想やメモなど..."
          />
        </div>

        <button type="submit" className="btn btn-primary btn-block">
          {isEdit ? '更新する' : '登録する'}
        </button>
      </form>
    </>
  );
}
