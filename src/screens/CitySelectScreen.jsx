import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { MapPin, HelpCircle, ArrowLeft, Play } from 'lucide-react'
import useGameStore from '../store/useGameStore'
import TurkeyMap from '../components/TurkeyMap'

function CitySelectScreen() {
  const navigate = useNavigate()
  const setScreen = useGameStore((state) => state.setScreen)
  const selectedCity = useGameStore((state) => state.selectedCity)
  const setSelectedCity = useGameStore((state) => state.setSelectedCity)

  const handleBack = () => {
    navigate('/')
  }

  const handleHowTo = () => {
    setScreen('how_to')
  }

  const handleCitySelect = (cityName, cityData) => {
    setSelectedCity(cityName)
    console.log('Selected city details:', cityData)
  }

  const handleStart = () => {
    if (selectedCity) {
      setScreen('dashboard')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="h-screen bg-breeze p-4 flex flex-col"
    >
      <div className="shrink-0 flex items-center justify-between mb-2">
        <button
          onClick={handleBack}
          className="border-3 border-shade rounded-full font-bold px-3 py-1.5 bg-background shadow-[3px_3px_0px_0px_var(--shade)] hover:opacity-90 transition-opacity cursor-pointer text-shade text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blossom-deep" />
          <h1 className="font-black text-lg text-shade">Turkiye Haritasi</h1>
        </div>
        <button
          onClick={handleHowTo}
          className="border-2 border-shade rounded-full w-8 h-8 flex items-center justify-center bg-background shadow-[2px_2px_0px_0px_var(--shade)] hover:opacity-90 transition-opacity cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-shade" />
        </button>
      </div>

      <div className="shrink-0">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm font-bold text-shade-soft text-center mb-2"
        >
          Haritadan bir şehir seç
        </motion.p>
      </div>

      <div className="flex-1 relative bg-background/50 rounded-2xl border-3 border-shade overflow-hidden shadow-[4px_4px_0px_0px_var(--shade)]">
        <TurkeyMap onSelectCity={handleCitySelect} selectedCity={selectedCity} />
        <AnimatePresence>
          {selectedCity && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-3 left-3 right-3"
            >
              <div className="bg-background/95 backdrop-blur border-3 border-shade rounded-xl px-3 py-2 shadow-[3px_3px_0px_0px_var(--shade)]">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-black text-shade text-xs">Secilen Sehir</span>
                  <span className="inline-flex items-center rounded-full border-2 border-slate-900 bg-sunlit px-3 py-0.5 text-sm font-black text-shade shadow-[2px_2px_0px_0px_var(--shade)]">
                    {selectedCity}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="shrink-0 mt-3">
        <motion.button
          whileHover={{ scale: selectedCity ? 1.02 : 1 }}
          whileTap={{ scale: selectedCity ? 0.98 : 1 }}
          onClick={handleStart}
          disabled={!selectedCity}
          className={`w-full border-4 border-shade rounded-xl font-black text-base py-3 shadow-[4px_4px_0px_0px_var(--shade)] transition-all cursor-pointer flex items-center justify-center gap-2 ${
            selectedCity
              ? 'bg-sunlit-deep text-shade hover:shadow-[6px_6px_0px_0px_var(--shade)] hover:-translate-y-1'
              : 'bg-shade/20 text-shade-soft cursor-not-allowed'
          }`}
        >
          <Play className="w-5 h-5" />
          Oyuna Başla
        </motion.button>
      </div>
    </motion.div>
  )
}

export default CitySelectScreen