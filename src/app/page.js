import Navbar from '@/components/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import StatsSection from '@/components/landing/StatsSection';
import SDGSection from '@/components/landing/SDGSection';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <>
      <Navbar variant="landing" />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <SDGSection />
      </main>
      <Footer />
    </>
  );
}
