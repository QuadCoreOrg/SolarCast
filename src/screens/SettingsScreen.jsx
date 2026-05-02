import { motion } from 'framer-motion'
import { Mail, Settings } from 'lucide-react'
import useGameStore from '../store/useGameStore'
import Header from '../components/Header'
import TabBar from '../components/TabBar'
import useSoundStore from '../store/useSoundStore'

function SettingsScreen() {
  const setScreen = useGameStore((s) => s.setScreen)
  const credits = useGameStore((s) => s.credits)
  const level = useGameStore((s) => s.level)
  const masterVolume = useSoundStore((s) => s.masterVolume)
  const setMasterVolume = useSoundStore((s) => s.setMasterVolume)

  return (
    <div className="h-screen bg-breeze flex flex-col font-['Nunito'] text-shade overflow-hidden">
      <Header credits={credits} level={level} />

      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6"
      >
        <section className="max-w-5xl mx-auto space-y-4">
          <article className="rounded-2xl border-4 border-slate-900 bg-blossom p-4 sm:p-5 shadow-[5px_5px_0px_0px_var(--shade)]">
            <div className="flex items-center gap-2">
              <Settings className="w-6 h-6" strokeWidth={2.25} />
              <h1 className="text-2xl font-black">Ayarlar</h1>
            </div>
            <p className="mt-2 text-sm font-bold text-shade-2">
              Oyun sesini tek merkezden kolayca yönet.
            </p>
          </article>

          <article className="rounded-2xl border-4 border-slate-900 bg-background p-4 sm:p-5 shadow-[5px_5px_0px_0px_var(--shade)]">
            <h2 className="font-black text-lg mb-3">Ses Ayarları</h2>
            <div className="rounded-xl border-3 border-slate-900 bg-background p-3">
              <div className="mb-2 flex items-center justify-between text-sm font-black">
                <span>Global Ses</span>
                <span>%{masterVolume}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={masterVolume}
                onChange={(event) => setMasterVolume(Number(event.target.value))}
                className="w-full h-3 cursor-pointer appearance-none rounded-full border-2 border-slate-900"
                aria-label="Global Ses"
                style={{
                  background: `linear-gradient(to right, #f6c944 0%, #f6c944 ${masterVolume}%, #fffdf7 ${masterVolume}%, #fffdf7 100%)`,
                }}
              />
            </div>
          </article>

          <article className="rounded-2xl border-4 border-slate-900 bg-breeze p-4 sm:p-5 shadow-[5px_5px_0px_0px_var(--shade)]">
            <h2 className="font-black text-lg mb-2">Bize Ulaşın</h2>
            <p className="text-sm font-bold text-shade-2 mb-3">
              Öneri ve destek taleplerini ekibimize iletebilirsin.
            </p>
            <div className="grid grid-cols-1 gap-2">
              <a
                href="mailto:recepdr1906@gmail.com"
                className="flex items-center gap-2 rounded-xl border-3 border-slate-900 bg-background px-3 py-2 font-black text-sm shadow-[3px_3px_0px_0px_var(--shade)] hover:bg-sunlit transition-colors"
              >
                <Mail className="w-4 h-4" />
                recepdr1906@gmail.com
              </a>
            </div>
          </article>
        </section>
      </motion.main>

      <TabBar activeScreen="settings" onChange={setScreen} />
    </div>
  )
}

export default SettingsScreen
