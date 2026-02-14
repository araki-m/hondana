import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function Layout() {
  return (
    <>
      <header className="app-header">本棚</header>
      <main className="app-main">
        <Outlet />
      </main>
      <BottomNav />
    </>
  );
}
