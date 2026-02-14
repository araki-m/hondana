import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteBook, useBook } from '../hooks/useBooks';
import ConfirmDialog from '../components/ConfirmDialog';

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const book = useBook(id ? Number(id) : undefined);
  const navigate = useNavigate();
  const [showDelete, setShowDelete] = useState(false);

  if (book === undefined) {
    return <div className="loading">読み込み中...</div>;
  }

  if (!book) {
    return (
      <div className="empty-state">
        <p>本が見つかりませんでした</p>
      </div>
    );
  }

  async function handleDelete() {
    await deleteBook(book!.id!);
    navigate('/', { replace: true });
  }

  return (
    <>
      <div className="detail-header">
        <div className="detail-thumbnail">
          {book.thumbnail ? (
            <img src={book.thumbnail} alt={book.title} />
          ) : (
            <div className="detail-thumbnail-placeholder">📖</div>
          )}
        </div>
        <div className="detail-meta">
          <h2 className="detail-title">{book.title}</h2>
          {book.authors && <p className="detail-author">{book.authors}</p>}
          {book.publisher && (
            <p className="detail-publisher">
              {book.publisher}
              {book.publishedDate && ` (${book.publishedDate})`}
            </p>
          )}
          {book.isbn && (
            <p className="detail-publisher" style={{ marginTop: 4 }}>
              ISBN: {book.isbn}
            </p>
          )}
          {book.pageCount > 0 && (
            <p className="detail-publisher" style={{ marginTop: 2 }}>
              {book.pageCount}ページ
            </p>
          )}
        </div>
      </div>

      {book.description && (
        <div className="detail-section">
          <h3>説明</h3>
          <p>{book.description}</p>
        </div>
      )}

      {book.memo && (
        <div className="detail-section">
          <h3>メモ</h3>
          <p>{book.memo}</p>
        </div>
      )}

      <div className="detail-actions">
        <button
          className="btn btn-primary"
          onClick={() => navigate(`/edit/${book.id}`)}
        >
          編集
        </button>
        <button
          className="btn btn-danger"
          onClick={() => setShowDelete(true)}
        >
          削除
        </button>
      </div>

      {showDelete && (
        <ConfirmDialog
          title="本を削除"
          message={`「${book.title}」を削除しますか？この操作は取り消せません。`}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </>
  );
}
