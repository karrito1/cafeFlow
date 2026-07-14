import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Star } from 'lucide-react';

const TestimonialCard = ({ quote, name, role, rating, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="mb-6"
    >
      <Card className="bg-landing-card hover:shadow-lg transition-all duration-300">
        <CardContent className="pt-6">
          <div className="flex gap-1 mb-4">
            {[...Array(rating)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-landing-accent text-landing-accent" />
            ))}
          </div>
          <blockquote className="text-landing-card-fg leading-relaxed mb-4">
            &ldquo;{quote}&rdquo;
          </blockquote>
          <p className="font-medium text-landing-card-fg">
            &mdash; {name}
            {role && <span className="text-sm text-landing-muted-fg block mt-1">{role}</span>}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TestimonialCard;
