import { motion } from 'framer-motion';
import { Button } from './ui/button';

const HeroSection = () => {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1586357543997-5e69f9302815)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
          style={{ letterSpacing: '-0.02em' }}
        >
          Gestiona tu negocio con inteligencia
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          La plataforma todo-en-uno para gestionar pedidos, clientes, pagos, inventario y programas de fidelización. Diseñada para restaurantes, cafeterías y cualquier negocio que quiera crecer.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            size="lg"
            onClick={() => scrollTo('funcionalidades')}
            className="text-lg transition-all duration-200 active:scale-[0.98]"
          >
            Ver Funcionalidades
          </Button>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => scrollTo('fidelizacion')}
            className="text-lg transition-all duration-200 active:scale-[0.98]"
          >
            Programa de Fidelización
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
