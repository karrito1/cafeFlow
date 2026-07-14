import { motion } from 'framer-motion';

const AboutSection = () => {
  return (
    <section id="nosotros" className="py-20 bg-landing-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-landing-fg mb-6">
            ¿Qué es CaféFlow?
          </h2>
          <p className="text-lg text-landing-muted-fg leading-relaxed mb-6">
            CaféFlow es una plataforma SaaS diseñada para simplificar la gestión de negocios como restaurantes, cafeterías, tiendas y más. Centraliza pedidos, inventario, clientes y pagos en un solo lugar, para que puedas enfocarte en lo que importa: hacer crecer tu negocio.
          </p>
          <p className="text-lg text-landing-muted-fg leading-relaxed">
            Con herramientas de análisis, programas de fidelización y una interfaz intuitiva, CaféFlow le da a los dueños de negocios el control total de sus operaciones desde cualquier dispositivo. Simple, potente y escalable.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
