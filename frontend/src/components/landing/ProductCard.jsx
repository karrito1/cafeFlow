import { motion } from 'framer-motion';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(price);
};

const ProductCard = ({ product, categoryName }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={product.image || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
        </div>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-xl">{product.name}</CardTitle>
            {categoryName && (
              <Badge variant="secondary" className="shrink-0">
                {categoryName}
              </Badge>
            )}
          </div>
          <CardDescription className="line-clamp-2">
            {product.description}
          </CardDescription>
        </CardHeader>
        <CardFooter className="mt-auto">
          <p className="text-2xl font-semibold text-landing-primary">
            {formatPrice(product.price?.M ?? product.price)}
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
