import { motion } from 'framer-motion'
import { ArrowLeft, Store } from 'lucide-react'
import useGameStore from '../store/useGameStore'

function MarketScreen() {
  const setScreen = useGameStore((s) => s.setScreen)

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      className="h-screen bg-background flex flex-col items-center justify-center p-6 font-['Nunito'] text-shade"
    >
      <div className="max-w-sm w-full border-4 border-slate-900 rounded-3xl bg-breeze p-6 shadow-[8px_8px_0px_0px_var(--shade)] text-center">
        <Store className="w-14 h-14 mx-auto mb-4 text-shade" strokeWidth={2} />
        <h1 className="font-black text-2xl mb-2">Market</h1>
        <p className="text-shade-2 text-sm font-bold mb-6">
          Upgrade ve mağaza içeriği çok yakında.
        </p>
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setScreen('dashboard')}
          className="w-full flex items-center justify-center gap-2 rounded-xl border-4 border-slate-900 bg-sunlit-deep py-3 font-black shadow-[4px_4px_0px_0px_var(--shade)] cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          Panele dön
        </motion.button>
      </div>
    </motion.div>
  )
}

export default MarketScreen
