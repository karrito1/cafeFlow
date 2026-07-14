import { motion } from 'framer-motion';
import { Coffee, Leaf, Star, Trophy, Gift } from 'lucide-react';
import BenefitCard from './BenefitCard';

const fallbackBenefits = [
  {
    icon: Coffee,
    title: 'Gestión de Pedidos',
    description: 'Administra pedidos en tiempo real, desde la toma hasta la entrega, optimizando tiempos y reduciendo errores.'
  },
  {
    icon: Leaf,
    title: 'Control de Inventario',
    description: 'Lleva el control de tu stock automáticamente, con alertas de reabastecimiento y reportes detallados.'
  },
  {
    icon: Star,
    title: 'Fidelización de Clientes',
    description: 'Programa de puntos y recompensas integrado que mantiene a tus clientes volviendo una y otra vez.'
  },
  {
    icon: Trophy,
    title: 'Reportes e Insights',
    description: 'Dashboards con métricas clave de ventas, clientes y productos para tomar decisiones inteligentes.'
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
            ¿Por qué CaféFlow?
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
