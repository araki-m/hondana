import { useEffect, useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import BookListPage from './pages/BookListPage';
import ScanPage from './pages/ScanPage';
import BookFormPage from './pages/BookFormPage';
import BookDetailPage from './pages/BookDetailPage';

function GlobalErrorCatcher() {
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    function onError(e: ErrorEvent) {
      setErrors((prev) => [...prev, `[error] ${e.message}`]);
    }
    function onRejection(e: PromiseRejectionEvent) {
      const msg = e.reason instanceof Error ? e.reason.message : String(e.reason);
      setErrors((prev) => [...prev, `[unhandled] ${msg}`]);
    }
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, []);

  if (errors.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 70,
      left: 8,
      right: 8,
      zIndex: 9999,
      padding: 10,
      background: '#2d0000',
      color: '#ff6666',
      borderRadius: 8,
      fontSize: '0.7rem',
      fontFamily: 'monospace',
      maxHeight: 150,
      overflow: 'auto',
      wordBreak: 'break-all',
    }}>
      <div style={{ color: '#ff0', fontWeight: 700, marginBottom: 4 }}>
        Global Errors ({errors.length})
      </div>
      {errors.map((e, i) => (
        <div key={i}>{e}</div>
      ))}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <GlobalErrorCatcher />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<BookListPage />} />
            <Route path="/scan" element={<ErrorBoundary><ScanPage /></ErrorBoundary>} />
            <Route path="/add" element={<BookFormPage />} />
            <Route path="/edit/:id" element={<BookFormPage />} />
            <Route path="/book/:id" element={<BookDetailPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </ErrorBoundary>
  );
}
