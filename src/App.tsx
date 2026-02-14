import { HashRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import BookListPage from './pages/BookListPage';
import ScanPage from './pages/ScanPage';
import BookFormPage from './pages/BookFormPage';
import BookDetailPage from './pages/BookDetailPage';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<BookListPage />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/add" element={<BookFormPage />} />
          <Route path="/edit/:id" element={<BookFormPage />} />
          <Route path="/book/:id" element={<BookDetailPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
