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
            Nuestra Historia
          </h2>
          <p className="text-lg text-landing-muted-fg leading-relaxed mb-6">
            Café Aroma nació de la pasión por el café colombiano auténtico y el deseo de crear un espacio donde cada taza cuenta una historia. Seleccionamos cuidadosamente granos de las mejores fincas cafeteras de Colombia, trabajando directamente con productores locales que comparten nuestra visión de calidad y sostenibilidad.
          </p>
          <p className="text-lg text-landing-muted-fg leading-relaxed">
            Nuestro equipo de baristas expertos se dedica a perfeccionar cada preparación, combinando técnicas tradicionales con innovación moderna. Creemos que el café es más que una bebida: es una experiencia sensorial que merece atención personalizada y un ambiente acogedor donde cada cliente se sienta como en casa.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
