import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Scanner from '../components/Scanner';
import { fetchBookByISBN } from '../api/googleBooks';
import { addBook, findByISBN } from '../hooks/useBooks';
import type { Book } from '../types/book';

const DEBUG = true;

type ScanState =
  | { step: 'scanning' }
  | { step: 'loading'; isbn: string }
  | { step: 'preview'; isbn: string; data: Partial<Book> }
  | { step: 'not_found'; isbn: string }
  | { step: 'duplicate'; isbn: string; existingId: number }
  | { step: 'error'; isbn: string; message: string };

export default function ScanPage() {
  const [state, setState] = useState<ScanState>({ step: 'scanning' });
  const [debugLog, setDebugLog] = useState<string[]>([]);
  const navigate = useNavigate();
  const processingRef = useRef(false);

  function log(msg: string) {
    const ts = new Date().toLocaleTimeString();
    setDebugLog((prev) => [...prev, `[${ts}] ${msg}`]);
    console.log('[ScanPage]', msg);
  }

  const handleScan = useCallback(async (isbn: string) => {
    log(`onScan called: isbn=${isbn}`);

    if (processingRef.current) {
      log('SKIP: already processing');
      return;
    }
    processingRef.current = true;

    log('setState → loading');
    setState({ step: 'loading', isbn });

    try {
      log('findByISBN start');
      const existing = await findByISBN(isbn);
      log(`findByISBN result: ${existing ? `found id=${existing.id}` : 'not found'}`);

      if (existing) {
        setState({ step: 'duplicate', isbn, existingId: existing.id! });
        log('setState → duplicate');
        return;
      }

      log('fetchBookByISBN start');
      const data = await fetchBookByISBN(isbn);
      log(`fetchBookByISBN result: ${data ? `title=${data.title}` : 'null'}`);

      if (data && data.title) {
        setState({ step: 'preview', isbn, data });
        log('setState → preview');
      } else {
        setState({ step: 'not_found', isbn });
        log('setState → not_found');
      }
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : String(e);
      log(`ERROR: ${errMsg}`);
      setState({
        step: 'error',
        isbn,
        message: '書籍情報の取得に失敗しました。',
      });
    } finally {
      processingRef.current = false;
      log('processing complete');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    processingRef.current = false;
    setDebugLog([]);
    setState({ step: 'scanning' });
  }

  const isScanning = state.step === 'scanning';

  return (
    <>
      <h2 className="page-title">バーコードスキャン</h2>

      {/* Scanner は常にDOMに存在させ、非表示で制御する（アンマウントしない） */}
      <div style={{ display: isScanning ? 'block' : 'none' }}>
        <Scanner onScan={handleScan} active={isScanning} />
        <p className="scan-status">
          本のバーコード(ISBN)にカメラを向けてください
        </p>
      </div>

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
          <p style={{ marginBottom: 4, color: 'var(--color-danger)' }}>
            {state.message}
          </p>
          <p style={{ marginBottom: 12, fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
            ISBN: {state.isbn}
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

      {DEBUG && debugLog.length > 0 && (
        <div style={{
          marginTop: 24,
          padding: 12,
          background: '#1a1a2e',
          color: '#0f0',
          borderRadius: 8,
          fontSize: '0.72rem',
          fontFamily: 'monospace',
          maxHeight: 200,
          overflow: 'auto',
          wordBreak: 'break-all',
        }}>
          <div style={{ marginBottom: 4, color: '#ff0', fontWeight: 700 }}>
            DEBUG (state: {state.step})
          </div>
          {debugLog.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      )}
    </>
  );
}
