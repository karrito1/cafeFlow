import { motion } from 'framer-motion';

const GalleryImage = ({ src, alt, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="overflow-hidden rounded-2xl shadow-lg"
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
      />
    </motion.div>
  );
};

export default GalleryImage;
