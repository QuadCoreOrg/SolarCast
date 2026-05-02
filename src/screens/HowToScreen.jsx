import { motion } from 'framer-motion'
import { Sun, Zap, Battery, Coins, TrendingUp, X } from 'lucide-react'
import useGameStore from '../store/useGameStore'

function HowToScreen() {
  const setScreen = useGameStore((state) => state.setScreen)

  const handleStart = () => {
    setScreen('city_select')
  }

  const steps = [
    {
      icon: Sun,
      title: 'Güneş Paneli Kur',
      description: 'Şehrini seç ve güneş paneli satın al. Hava durumuna göre enerji üretimi değişir!'
    },
    {
      icon: Battery,
      title: 'Enerjiyi Depola',
      description: 'Bataryalar ile fazla enerjiyi depola. Gece veya bulutlu günler için kullan!'
    },
    {
      icon: Zap,
      title: 'Enerjiyi Sat',
      description: 'Ürettiğin enerjiyi şebekeye sat ve coins kazan. Fiyatlar saatlik değişir!'
    },
    {
      icon: TrendingUp,
      title: 'Geliştir & Büyü',
      description: 'Kazandığın coins ile daha fazla panel ve batarya al. Seviyeni yükselt!'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-shade/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="w-full max-w-sm bg-background border-4 border-shade rounded-3xl shadow-[8px_8px_0px_0px_var(--shade)] overflow-hidden"
      >
        <div className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">☀️</span>
              <span className="font-black text-lg text-shade">Nasıl Oynanır?</span>
            </div>
            <button
              onClick={handleStart}
              className="border-2 border-shade rounded-full w-8 h-8 flex items-center justify-center bg-background shadow-[2px_2px_0px_0px_var(--shade)] hover:opacity-80 transition-opacity cursor-pointer"
            >
              <X className="w-4 h-4 text-shade" />
            </button>
          </div>

          <div className="space-y-3 mb-4">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
                className="flex items-start gap-3"
              >
                <div className="w-8 h-8 bg-sunlit-deep rounded-lg border-2 border-shade flex items-center justify-center flex-shrink-0">
                  <step.icon className="w-4 h-4 text-shade" />
                </div>
                <div>
                  <h3 className="font-bold text-shade text-sm">{step.title}</h3>
                  <p className="text-shade-soft text-xs leading-tight">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-2 bg-blossom rounded-xl p-2 mb-4"
          >
            <Coins className="w-4 h-4 text-shade" />
            <span className="font-bold text-shade text-xs">
              Günlük hedefini doldurarak ekstra coins kazan!
            </span>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStart}
            className="w-full bg-sunlit-deep border-3 border-shade rounded-xl font-black text-base py-3 shadow-[3px_3px_0px_0px_var(--shade)] hover:shadow-[4px_4px_0px_0px_var(--shade)] hover:-translate-y-0.5 transition-all cursor-pointer text-shade"
          >
            Başla →
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default HowToScreen