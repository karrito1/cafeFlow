import AppRouter from './routes/AppRouter';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'sonner';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppRouter />
        <Toaster
          position="bottom-right"
          closeButton
          duration={3000}
          toastOptions={{
            className: 'text-sm',
          }}
        />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
