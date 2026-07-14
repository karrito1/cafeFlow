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
        <title>CaféFlow - Gestión inteligente para tu negocio</title>
        <meta name="description" content="Plataforma SaaS todo-en-uno para gestionar pedidos, clientes, pagos, productos y programas de fidelización. Impulsa tu negocio con CaféFlow." />
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
