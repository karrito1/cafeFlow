import { motion } from 'framer-motion';
import { Coffee, Leaf, Star, Trophy, Gift } from 'lucide-react';
import BenefitCard from './BenefitCard';

const fallbackBenefits = [
  {
    icon: Coffee,
    title: 'Café Premium',
    description: 'Granos seleccionados de las mejores fincas colombianas, tostados artesanalmente para garantizar el sabor perfecto.'
  },
  {
    icon: Leaf,
    title: 'Ingredientes Frescos',
    description: 'Utilizamos solo ingredientes naturales y frescos en cada preparación, sin aditivos ni conservantes artificiales.'
  },
  {
    icon: Star,
    title: 'Atención Personalizada',
    description: 'Nuestro equipo de baristas expertos está dedicado a crear la experiencia perfecta para cada cliente.'
  },
  {
    icon: Trophy,
    title: 'Calidad Garantizada',
    description: 'Cada taza pasa por rigurosos controles de calidad para asegurar la excelencia en cada sorbo.'
  }
];

const BenefitsSection = ({ rewards = [] }) => {
  const benefitItems = rewards.length > 0
    ? rewards.map(r => ({
        icon: Gift,
        title: r.name || r.title,
        description: r.description
      }))
    : fallbackBenefits;

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
            ¿Por qué elegirnos?
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefitItems.map((benefit, index) => (
            <BenefitCard
              key={index}
              icon={benefit.icon}
              title={benefit.title}
              description={benefit.description}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
