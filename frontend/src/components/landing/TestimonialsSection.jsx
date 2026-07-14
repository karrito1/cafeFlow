import { motion } from 'framer-motion';
import TestimonialCard from './TestimonialCard';

const testimonials = [
  {
    quote: 'CaféFlow transformó la gestión de mi restaurante. Ahora puedo ver las ventas en tiempo real y mis clientes están más felices con el programa de fidelización.',
    name: 'María González',
    role: 'Dueña de restaurante',
    rating: 5
  },
  {
    quote: 'Desde que uso CaféFlow, el control de inventario dejó de ser un problema. Ahorro tiempo y dinero, y el equipo de trabajo lo adoptó rápidamente.',
    name: 'Carlos Ramírez',
    role: 'Gerente de cafetería',
    rating: 5
  },
  {
    quote: 'La plataforma es increíblemente intuitiva. En menos de una semana ya estábamos usando todas las funcionalidades. Los reportes me ayudan a tomar mejores decisiones.',
    name: 'Ana Martínez',
    role: 'Directora de operaciones',
    rating: 5
  },
  {
    quote: 'CaféFlow es exactamente lo que necesitábamos. Un solo sistema para pedidos, clientes y pagos. No puedo imaginar volver a gestionar el negocio sin él.',
    name: 'Luis Hernández',
    role: 'Emprendedor',
    rating: 5
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-landing-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-landing-fg mb-4">
            Lo que dicen nuestros usuarios
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              quote={testimonial.quote}
              name={testimonial.name}
              role={testimonial.role}
              rating={testimonial.rating}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
