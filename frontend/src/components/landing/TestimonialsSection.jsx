import { motion } from 'framer-motion';
import TestimonialCard from './TestimonialCard';

const testimonials = [
  {
    quote: 'El mejor café que he probado en mi vida. La atención es excepcional y el ambiente es perfecto para trabajar o relajarse.',
    name: 'María González',
    rating: 5
  },
  {
    quote: 'Café Aroma se ha convertido en mi lugar favorito. El programa de fidelización es genial y los baristas conocen exactamente cómo me gusta mi café.',
    name: 'Carlos Ramírez',
    rating: 5
  },
  {
    quote: 'La calidad del café es incomparable. Cada visita es una experiencia única y el personal siempre está dispuesto a recomendar nuevas opciones.',
    name: 'Ana Martínez',
    rating: 5
  },
  {
    quote: 'Desde que descubrí Café Aroma, no he vuelto a otro lugar. El sabor del café colombiano auténtico y el ambiente acogedor hacen la diferencia.',
    name: 'Luis Hernández',
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
            Lo que dicen nuestros clientes
          </h2>
        </motion.div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              quote={testimonial.quote}
              name={testimonial.name}
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
