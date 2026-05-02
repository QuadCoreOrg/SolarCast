import { AnimatePresence } from 'framer-motion'
import useGameStore from '../store/useGameStore'
import HowToScreen from './HowToScreen'

function GameContainer() {
  const currentScreen = useGameStore((state) => state.currentScreen)

  return (
    <div className="game-wrapper h-screen bg-breeze">
      <AnimatePresence mode="wait">
        {currentScreen === 'how_to' && (
          <HowToScreen key="how_to" />
        )}
      </AnimatePresence>
    </div>
  )
}

export default GameContainer