import { useNavigate } from 'react-router-dom'
import Header from '../components/landing/Header'
import HeroSection from '../components/landing/HeroSection'
import ProblemSolutionSection from '../components/landing/ProblemSolutionSection'
import HowItWorksSection from '../components/landing/HowItWorksSection'
import FeaturesSection from '../components/landing/FeaturesSection'
import ContactSection from '../components/landing/ContactSection'
import FooterSection from '../components/landing/FooterSection'

function HomePage() {
  const navigate = useNavigate()

  const handlePlayClick = () => {
    navigate('/play')
  }

  return (
    <div className="min-h-screen bg-background font-['Nunito'] text-shade">
      <Header onPlayClick={handlePlayClick} />
      <HeroSection onPlayClick={handlePlayClick} />
      <ProblemSolutionSection />
      <HowItWorksSection />
      <FeaturesSection />
      <ContactSection />
      <FooterSection onPlayClick={handlePlayClick} />
    </div>
  )
}

export default HomePage