import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-base-100 border-t border-base-200 py-3 px-6 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-4 text-xs text-base-content/40">
      <span>CaféFlow &copy; {new Date().getFullYear()} &mdash; Todos los derechos reservados</span>
      <span className="hidden sm:inline">&middot;</span>
      <Link to="/policies" className="hover:text-primary transition-colors">
        Términos y Condiciones
      </Link>
    </footer>
  );
}

export default Footer
