import { Link } from 'react-router-dom';
import { Coffee } from 'lucide-react';

function NotFoundPage() {
  return (
    <div
      data-theme="cafe"
      className="min-h-screen bg-gradient-to-br from-primary to-neutral flex items-center justify-center p-4"
    >
      <div className="card bg-base-100 w-full max-w-sm shadow-2xl">
        <div className="card-body px-10 py-12 text-center">
          <div className="text-7xl font-bold text-primary/20 mb-2">404</div>
          <Coffee size={48} className="mx-auto mb-4" />
          <h1 className="text-xl font-bold text-base-content mb-2">Página no encontrada</h1>
          <p className="text-sm text-base-content/60">
            La página que buscas no existe o ha sido movida.
          </p>
          <Link to="/" className="btn btn-primary w-full mt-6">
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
