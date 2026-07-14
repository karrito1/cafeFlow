import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { Coffee } from 'lucide-react';
import ProductCard from './ProductCard';

const ProductsSection = ({ products, categories, loading, error }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = useMemo(() => {
    return selectedCategory === 'all'
      ? products
      : products.filter(p => p.categoryId === selectedCategory);
  }, [products, selectedCategory]);

  const getCategoryName = useMemo(() => {
    return (categoryId) => {
      const category = categories.find(c => (c._id ?? c.id) === categoryId);
      return category ? category.name : '';
    };
  }, [categories]);

  return (
    <section id="funcionalidades" className="py-20 bg-landing-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-landing-fg mb-4">
            Funcionalidades
          </h2>
          <p className="text-lg text-landing-muted-fg max-w-2xl mx-auto">
            Todo lo que necesitas para gestionar tu negocio en una sola plataforma
          </p>
        </motion.div>

        {!loading && categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              className="transition-all duration-200 active:scale-[0.98]"
            >
              Todos
            </Button>
            {categories.map((category) => (
              <Button
                key={category._id ?? category.id}
                variant={selectedCategory === (category._id ?? category.id) ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category._id ?? category.id)}
                className="transition-all duration-200 active:scale-[0.98]"
              >
                {category.name}
              </Button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-8 w-1/3" />
                </div>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-landing-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Reintentar
            </Button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Coffee className="w-16 h-16 text-landing-muted-fg mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-landing-fg mb-2">
              No hay productos disponibles
            </h3>
            <p className="text-landing-muted-fg">
              Pronto agregaremos nuevos productos a esta categoría
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                categoryName={getCategoryName(product.categoryId)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;
