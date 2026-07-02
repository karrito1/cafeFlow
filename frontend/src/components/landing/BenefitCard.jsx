import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const BenefitCard = ({ icon: Icon, title, description, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="h-full bg-landing-card hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <div className="mb-4">
            <Icon className="w-12 h-12 text-landing-primary" />
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-landing-muted-fg leading-relaxed">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BenefitCard;
