import { AnimatePresence } from 'framer-motion'
import useGameStore from '../store/useGameStore'
import HowToScreen from './HowToScreen'
import CitySelectScreen from './CitySelectScreen'
import DashboardScreen from './DashboardScreen'
import MarketScreen from './MarketScreen'
import PowerCenterScreen from './PowerCenterScreen'
import SettingsScreen from './SettingsScreen'

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
        {currentScreen === 'dashboard' && (
          <DashboardScreen key="dashboard" />
        )}
        {currentScreen === 'market' && (
          <MarketScreen key="market" />
        )}
        {currentScreen === 'power_center' && (
          <PowerCenterScreen key="power_center" />
        )}
        {currentScreen === 'settings' && (
          <SettingsScreen key="settings" />
        )}
      </AnimatePresence>
    </div>
  )
}

export default GameContainer