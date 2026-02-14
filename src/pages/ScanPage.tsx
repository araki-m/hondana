import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Scanner from '../components/Scanner';
import { fetchBookByISBN } from '../api/googleBooks';
import { addBook, findByISBN } from '../hooks/useBooks';
import type { Book } from '../types/book';

type ScanState =
  | { step: 'scanning' }
  | { step: 'loading'; isbn: string }
  | { step: 'preview'; isbn: string; data: Partial<Book> }
  | { step: 'not_found'; isbn: string }
  | { step: 'duplicate'; isbn: string; existingId: number }
  | { step: 'error'; message: string };

export default function ScanPage() {
  const [state, setState] = useState<ScanState>({ step: 'scanning' });
  const navigate = useNavigate();

  const handleScan = useCallback(
    async (isbn: string) => {
      setState({ step: 'loading', isbn });

      // 重複チェック
      const existing = await findByISBN(isbn);
      if (existing) {
        setState({ step: 'duplicate', isbn, existingId: existing.id! });
        return;
      }

      try {
        const data = await fetchBookByISBN(isbn);
        if (data && data.title) {
          setState({ step: 'preview', isbn, data });
        } else {
          setState({ step: 'not_found', isbn });
        }
      } catch {
        setState({ step: 'error', message: '書籍情報の取得に失敗しました。' });
      }
    },
    []
  );

  async function handleRegister(data: Partial<Book>, isbn: string) {
    const newId = await addBook({
      isbn,
      title: data.title ?? '',
      authors: data.authors ?? '',
      publisher: data.publisher ?? '',
      publishedDate: data.publishedDate ?? '',
      description: data.description ?? '',
      thumbnail: data.thumbnail ?? '',
      pageCount: data.pageCount ?? 0,
      memo: '',
    });
    navigate(`/book/${newId}`);
  }

  function reset() {
    setState({ step: 'scanning' });
  }

  return (
    <>
      <h2 className="page-title">バーコードスキャン</h2>

      {state.step === 'scanning' && (
        <>
          <Scanner onScan={handleScan} active />
          <p className="scan-status">
            本のバーコード(ISBN)にカメラを向けてください
          </p>
        </>
      )}

      {state.step === 'loading' && (
        <div className="scan-status">
          ISBN: {state.isbn}<br />
          書籍情報を取得中...
        </div>
      )}

      {state.step === 'duplicate' && (
        <div className="card scan-result">
          <p style={{ marginBottom: 12 }}>
            この本はすでに登録されています (ISBN: {state.isbn})
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-primary"
              style={{ flex: 1 }}
              onClick={() => navigate(`/book/${state.existingId}`)}
            >
              詳細を見る
            </button>
            <button
              className="btn btn-secondary"
              style={{ flex: 1 }}
              onClick={reset}
            >
              続けてスキャン
            </button>
          </div>
        </div>
      )}

      {state.step === 'preview' && (
        <div className="card scan-result">
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            {state.data.thumbnail ? (
              <img
                src={state.data.thumbnail}
                alt=""
                style={{ width: 80, borderRadius: 6 }}
              />
            ) : null}
            <div>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>
                {state.data.title}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                {state.data.authors}
              </div>
              {state.data.publisher && (
                <div style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                  {state.data.publisher}
                </div>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-primary"
              style={{ flex: 1 }}
              onClick={() => handleRegister(state.data, state.isbn)}
            >
              登録する
            </button>
            <button
              className="btn btn-secondary"
              style={{ flex: 1 }}
              onClick={reset}
            >
              やり直す
            </button>
          </div>
        </div>
      )}

      {state.step === 'not_found' && (
        <div className="card scan-result">
          <p style={{ marginBottom: 12 }}>
            ISBN: {state.isbn} の書籍情報が見つかりませんでした。
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-primary"
              style={{ flex: 1 }}
              onClick={() => navigate(`/add?isbn=${state.isbn}`)}
            >
              手動で登録
            </button>
            <button
              className="btn btn-secondary"
              style={{ flex: 1 }}
              onClick={reset}
            >
              やり直す
            </button>
          </div>
        </div>
      )}

      {state.step === 'error' && (
        <div className="card scan-result">
          <p style={{ marginBottom: 12, color: 'var(--color-danger)' }}>
            {state.message}
          </p>
          <button className="btn btn-primary btn-block" onClick={reset}>
            やり直す
          </button>
        </div>
      )}
    </>
  );
}
