import React from 'react';
import { Navbar } from './components/LandingPage/Navbar';
import { Hero } from './components/LandingPage/Hero';
import { Sponsors } from './components/LandingPage/Sponsors';
import { About } from './components/LandingPage/About';
import { HowItWorks } from './components/LandingPage/HowItWorks';
import { Features } from './components/LandingPage/Features';
import { Services } from './components/LandingPage/Services';
import { Cta } from './components/LandingPage/Cta';
import { Testimonials } from './components/LandingPage/Testimonials';
import { Team } from './components/LandingPage/Team';
import { Pricing } from './components/LandingPage/Pricing';
import { Newsletter } from './components/LandingPage/Newsletter';
import { FAQ } from './components/LandingPage/FAQ';
import { Footer } from './components/LandingPage/Footer';
import { ScrollToTop } from './components/LandingPage/ScrollToTop';

const LandingPage: React.FC = () => {
  return (
    <div className='overflow-hidden'>
      {/* Navbar */}
      <Navbar />

      {/* First screen wrapper: evenly spread on mobile, normal flow on desktop */}
      <div className="min-h-screen min-h-[100dvh] flex flex-col justify-evenly pt-14 pb-4 lg:min-h-0 lg:block lg:pb-0">
        <Hero />
        <Sponsors />
      </div>

      {/* About Section */}
      <About />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Features Section */}
      <Features />

      {/* Services Section */}
      <Services />

      {/* Call to Action Section */}
      <Cta />

      {/* Testimonials Section */}
      <Testimonials />

      {/* Team Section */}
      <Team />

      {/* Pricing Section */}
      <Pricing />

      {/* Newsletter Section */}
      <Newsletter />

      {/* FAQ Section */}
      <FAQ />

      {/* Footer Section */}
      <Footer />

      {/* Scroll To Top Button */}
      <ScrollToTop />
    </div>
  );
};

export default LandingPage;
