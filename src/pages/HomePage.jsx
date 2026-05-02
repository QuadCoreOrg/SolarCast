import Header from "../components/landing/Header";
import HeroSection from "../components/landing/HeroSection";
import ProblemSolutionSection from "../components/landing/ProblemSolutionSection";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import ContactSection from "../components/landing/ContactSection";
import FooterSection from "../components/landing/FooterSection";

function HomePage({ onPlayClick }) {
  return (
    <div className="min-h-screen bg-background font-['Nunito'] text-shade">
      <Header onPlayClick={onPlayClick} />
      <HeroSection onPlayClick={onPlayClick} />
      <ProblemSolutionSection />
      <HowItWorksSection />
      <FeaturesSection />
      <ContactSection />
      <FooterSection onPlayClick={onPlayClick} />
    </div>
  );
}

export default HomePage;
