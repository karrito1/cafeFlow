import { Link } from 'react-router-dom';
import { Coffee, Globe, ExternalLink, Share2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-landing-primary text-landing-primary-fg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Coffee className="w-8 h-8" />
              <span className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
                Café Aroma
              </span>
            </div>
            <p className="text-landing-primary-fg/80 leading-relaxed">
              El mejor café colombiano para cada momento especial de tu día.
            </p>
          </div>

          <div>
            <span className="font-semibold mb-4 block">Enlaces Rápidos</span>
            <nav className="space-y-2">
              <a href="/#nosotros" className="block text-landing-primary-fg/80 hover:text-landing-primary-fg transition-colors duration-200">
                Nosotros
              </a>
              <a href="/#productos" className="block text-landing-primary-fg/80 hover:text-landing-primary-fg transition-colors duration-200">
                Productos
              </a>
              <a href="/#fidelizacion" className="block text-landing-primary-fg/80 hover:text-landing-primary-fg transition-colors duration-200">
                Fidelización
              </a>
              <a href="/#contacto" className="block text-landing-primary-fg/80 hover:text-landing-primary-fg transition-colors duration-200">
                Contacto
              </a>
            </nav>
          </div>

          <div>
            <span className="font-semibold mb-4 block">Legal</span>
            <nav className="space-y-2">
              <Link to="/privacidad" className="block text-landing-primary-fg/80 hover:text-landing-primary-fg transition-colors duration-200">
                Política de Privacidad
              </Link>
              <Link to="/terminos" className="block text-landing-primary-fg/80 hover:text-landing-primary-fg transition-colors duration-200">
                Términos de Servicio
              </Link>
            </nav>
          </div>

          <div>
            <span className="font-semibold mb-4 block">Síguenos</span>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-landing-primary-fg/80 hover:text-landing-primary-fg transition-colors duration-200"
                aria-label="Instagram"
              >
                <Globe className="w-6 h-6" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-landing-primary-fg/80 hover:text-landing-primary-fg transition-colors duration-200"
                aria-label="Facebook"
              >
                <ExternalLink className="w-6 h-6" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-landing-primary-fg/80 hover:text-landing-primary-fg transition-colors duration-200"
                aria-label="Twitter"
              >
                <Share2 className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-landing-primary-fg/20 mt-8 pt-8 text-center">
          <p className="text-landing-primary-fg/80">
            © 2026 Café Aroma. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
