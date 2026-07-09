import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import Footer from './Footer';

function AppLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const isWaiter = user?.role === 'waiter';
  const isMenuPage = location.pathname === '/menu';

  if (isWaiter) {
    return (
      <div className="min-h-screen flex flex-col bg-base-200 pb-16 lg:pb-0" data-theme="cafe">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-base-200 pb-16 lg:pb-0" data-theme="cafe">
      <Navbar />
      <div className="flex flex-1">
        {!isMenuPage && <Sidebar />}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
      <Footer />
      <BottomNav />
    </div>
  );
}

export default AppLayout;
