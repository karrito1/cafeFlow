import { motion } from 'framer-motion';
import GalleryImage from './GalleryImage';

const galleryImages = [
  {
    src: 'https://images.unsplash.com/photo-1655982525388-a3fb03fa9275',
    alt: 'Espresso recién preparado con crema perfecta'
  },
  {
    src: 'https://images.unsplash.com/photo-1696724111302-232a3a10c9f6',
    alt: 'Barista experto preparando café con arte latte'
  },
  {
    src: 'https://images.unsplash.com/photo-1547218554-703953332c3b',
    alt: 'Negocio gestionado eficientemente con CaféFlow'
  },
  {
    src: 'https://images.unsplash.com/photo-1672976794949-0b6a1612b860',
    alt: 'Granos de café colombiano premium recién tostados'
  }
];

const GallerySection = () => {
  return (
    <section className="py-20 bg-landing-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-landing-fg mb-4">
            Galería
          </h2>
          <p className="text-lg text-landing-muted-fg">
            Así se ve la gestión inteligente con CaféFlow
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {galleryImages.map((image, index) => (
            <GalleryImage
              key={index}
              src={image.src}
              alt={image.alt}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
