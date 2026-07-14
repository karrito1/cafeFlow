import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Users, Gift, Award } from 'lucide-react';

const LoyaltySection = ({ customersCount = 2847, rewardsCount = 1234 }) => {
  return (
    <section id="fidelizacion" className="py-20 bg-landing-secondary text-landing-secondary-fg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Programa de Fidelización Integrado
          </h2>
          <p className="text-lg text-landing-secondary-fg/80 max-w-2xl mx-auto">
            Incluye un sistema de puntos y recompensas para que tus clientes se mantengan fieles a tu negocio
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="text-center">
              <CardContent className="pt-6">
                <Users className="w-12 h-12 text-landing-primary mx-auto mb-4" />
                <p className="text-3xl font-bold text-landing-card-fg mb-2">{customersCount.toLocaleString('es-CO')}</p>
                <p className="text-landing-muted-fg">Negocios Activos</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="text-center">
              <CardContent className="pt-6">
                <Gift className="w-12 h-12 text-landing-primary mx-auto mb-4" />
                <p className="text-3xl font-bold text-landing-card-fg mb-2">{rewardsCount.toLocaleString('es-CO')}</p>
                <p className="text-landing-muted-fg">Clientes Fidelizados</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="text-center">
              <CardContent className="pt-6">
                <Award className="w-12 h-12 text-landing-primary mx-auto mb-4" />
                <p className="text-3xl font-bold text-landing-card-fg mb-2">47.2k</p>
                <p className="text-landing-muted-fg">Pedidos Procesados</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-landing-card rounded-2xl p-8 max-w-3xl mx-auto"
        >
          <h3 className="text-2xl font-bold text-landing-card-fg mb-6 text-center">
            Cómo funciona
          </h3>
          <ul className="space-y-4 mb-8">
            <li className="flex items-start gap-3">
              <Badge variant="default" className="mt-1">1</Badge>
              <p className="text-landing-card-fg leading-relaxed">
                Tus clientes acumulan puntos automáticamente con cada compra que realizan
              </p>
            </li>
            <li className="flex items-start gap-3">
              <Badge variant="default" className="mt-1">2</Badge>
              <p className="text-landing-card-fg leading-relaxed">
                Configura recompensas personalizadas: descuentos, productos gratis o beneficios exclusivos
              </p>
            </li>
            <li className="flex items-start gap-3">
              <Badge variant="default" className="mt-1">3</Badge>
              <p className="text-landing-card-fg leading-relaxed">
                Envía notificaciones automáticas para mantener a tus clientes informados y comprometidos
              </p>
            </li>
            <li className="flex items-start gap-3">
              <Badge variant="default" className="mt-1">4</Badge>
              <p className="text-landing-card-fg leading-relaxed">
                Analiza el comportamiento de tus clientes con reportes detallados del programa
              </p>
            </li>
          </ul>
          <div className="text-center">
            <Button size="lg" className="transition-all duration-200 active:scale-[0.98]">
              Comenzar Ahora
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LoyaltySection;
