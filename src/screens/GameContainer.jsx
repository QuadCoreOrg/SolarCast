import { AnimatePresence } from 'framer-motion'
import useGameStore from '../store/useGameStore'
import HowToScreen from './HowToScreen'
import CitySelectScreen from './CitySelectScreen'

function GameContainer() {
  const currentScreen = useGameStore((state) => state.currentScreen)

  return (
    <div className="game-wrapper h-screen bg-breeze">
      <AnimatePresence mode="wait">
        {currentScreen === 'how_to' && (
          <HowToScreen key="how_to" />
        )}
        {currentScreen === 'city_select' && (
          <CitySelectScreen key="city_select" />
        )}
      </AnimatePresence>
    </div>
  )
}

export default GameContainer