import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import Footer from './Footer';
import useScrollLock from '../../hooks/useScrollLock';

function AppLayout() {
  useScrollLock();
  const { user } = useAuth();
  const isMobileRole = user?.role === 'waiter' || user?.role === 'customer';

  if (isMobileRole) {
    return (
      <div className="min-h-screen flex flex-col bg-base-200 pb-16 lg:pb-0" data-theme="cafe">
        <Navbar />
        <main className="flex-1 overflow-x-hidden">
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
        <Sidebar />
        <main className="flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
      <Footer />
      <BottomNav />
    </div>
  );
}

export default AppLayout;
