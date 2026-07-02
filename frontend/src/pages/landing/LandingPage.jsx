import { Helmet } from 'react-helmet-async';
import { useLandingData } from '../../components/landing/useLandingData';
import HeroSection from '../../components/landing/HeroSection';
import AboutSection from '../../components/landing/AboutSection';
import ProductsSection from '../../components/landing/ProductsSection';
import BenefitsSection from '../../components/landing/BenefitsSection';
import LoyaltySection from '../../components/landing/LoyaltySection';
import TestimonialsSection from '../../components/landing/TestimonialsSection';
import GallerySection from '../../components/landing/GallerySection';
import ContactSection from '../../components/landing/ContactSection';

const LandingPage = () => {
  const { products, categories, loading, error, customersCount, rewardsCount, rewards } = useLandingData();

  return (
    <div>
      <Helmet>
        <title>Café Aroma - El mejor café colombiano para cada momento</title>
        <meta name="description" content="Descubre sabores únicos, café de origen colombiano y una experiencia diseñada para los verdaderos amantes del café. Programa de fidelización y atención personalizada." />
      </Helmet>

      <HeroSection />
      <AboutSection />
      <ProductsSection
        products={products}
        categories={categories}
        loading={loading}
        error={error}
      />
      <BenefitsSection rewards={rewards} />
      <LoyaltySection
        customersCount={customersCount}
        rewardsCount={rewardsCount}
      />
      <TestimonialsSection />
      <GallerySection />
      <ContactSection />
    </div>
  );
};

export default LandingPage;
