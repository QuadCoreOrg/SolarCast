import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { MapPin, HelpCircle, ArrowLeft, Play, Sun, TrendingUp, CircleDollarSign } from 'lucide-react'
import useGameStore from '../store/useGameStore'
import TurkeyMap from '../components/TurkeyMap'
import { getCitySolarStats } from '../utils/citySolarStats'

function CitySelectScreen() {
  const navigate = useNavigate()
  const setScreen = useGameStore((state) => state.setScreen)
  const selectedCity = useGameStore((state) => state.selectedCity)
  const setSelectedCity = useGameStore((state) => state.setSelectedCity)
  const startGame = useGameStore((state) => state.startGame)

  const solarStats = useMemo(() => getCitySolarStats(selectedCity), [selectedCity])

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
      startGame()
    }
  }

  const formatCost = (n) => n.toLocaleString('tr-TR')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="h-screen bg-breeze p-4 flex flex-col font-['Nunito']"
    >
      <div className="shrink-0 flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={handleBack}
          className="border-3 border-shade rounded-full font-bold px-3 py-1.5 bg-background shadow-[3px_3px_0px_0px_var(--shade)] hover:opacity-90 transition-opacity cursor-pointer text-shade text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blossom-deep" />
          <h1 className="font-black text-lg text-shade">Türkiye haritası</h1>
        </div>
        <button
          type="button"
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

      <div className="flex-1 relative min-h-0 bg-background/50 rounded-2xl border-4 border-slate-900 overflow-hidden shadow-[4px_4px_0px_0px_var(--shade)]">
        <TurkeyMap onSelectCity={handleCitySelect} selectedCity={selectedCity} />

        <AnimatePresence>
          {selectedCity && solarStats && (
            <motion.aside
              initial={{ opacity: 0, x: 16, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 16, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="absolute top-3 right-3 z-20 w-[min(calc(100%-1.5rem),17.5rem)] pointer-events-auto"
            >
              <div className="rounded-2xl border-4 border-slate-900 bg-background shadow-[6px_6px_0px_0px_var(--shade)] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-sunlit px-3 pt-3 pb-2 border-b-4 border-slate-900">
                  <h2 className="font-black text-xl text-shade leading-tight tracking-tight">
                    {selectedCity}
                  </h2>
                  <div className="mt-2 inline-flex">
                    <span className="rounded-full border-2 border-slate-900 bg-white px-3 py-0.5 text-xs font-bold text-shade shadow-[2px_2px_0px_0px_var(--shade)] capitalize">
                      {solarStats.badge}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="bg-background px-0">
                  <div className="flex items-center gap-2 px-3 py-2.5 border-b-2 border-slate-900">
                    <Sun className="w-4 h-4 text-shade shrink-0" strokeWidth={2.25} />
                    <span className="text-xs font-bold text-shade-2 flex-1 min-w-0">
                      Güneş saati / gün
                    </span>
                    <span className="text-base font-black text-shade tabular-nums">
                      {solarStats.sunHoursPerDay}sa
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2.5 border-b-2 border-slate-900">
                    <TrendingUp className="w-4 h-4 text-sprout-deep shrink-0" strokeWidth={2.25} />
                    <span className="text-xs font-bold text-shade-2 flex-1 min-w-0">
                      Potansiyel verim
                    </span>
                    <span className="text-base font-black text-shade tabular-nums">
                      %{solarStats.efficiencyPct}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2.5">
                    <CircleDollarSign className="w-4 h-4 text-shade shrink-0" strokeWidth={2.25} />
                    <span className="text-xs font-bold text-shade-2 flex-1 min-w-0">
                      Kurulum maliyeti
                    </span>
                    <span className="text-base font-black text-shade tabular-nums">
                      {formatCost(solarStats.setupCost)} ₺
                    </span>
                  </div>
                </div>

                {/* Footer CTA */}
                <div className="bg-background px-3 pb-3 pt-1 border-t-4 border-slate-900">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleStart}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border-4 border-slate-900 bg-sprout-deep py-2.5 font-black text-sm text-shade shadow-[4px_4px_0px_0px_var(--shade)] hover:shadow-[5px_5px_0px_0px_var(--shade)] hover:-translate-y-px transition-all cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-shade text-shade" />
                    Enerji çiftliğine başla
                  </motion.button>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {!selectedCity && (
        <p className="shrink-0 mt-2 text-center text-xs font-bold text-shade-soft">
          Seçim yapınca sağ üstte özet kartı açılır.
        </p>
      )}
    </motion.div>
  )
}

export default CitySelectScreen
