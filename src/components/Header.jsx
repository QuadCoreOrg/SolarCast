import { useState } from 'react'
import logo from '../assets/solarcast-logo.png'
import { FastForward, Pause, Play } from 'lucide-react'
import useGameStore from '../store/useGameStore'
import { formatGameCalendarDayMonthTr } from '../utils/gameCalendar'
import PlayerProgressModal from './PlayerProgressModal'

function Header({ coins: coinsProp, credits: creditsLegacy, level: levelProp }) {
  const [progressOpen, setProgressOpen] = useState(false)
  const hasStartedGame = useGameStore((s) => s.hasStartedGame)
  const gameLoopMode = useGameStore((s) => s.gameLoopMode)
  const setGameLoopMode = useGameStore((s) => s.setGameLoopMode)
  const day = useGameStore((s) => s.day)
  const startedAt = useGameStore((s) => s.startedAt)
  const hour = useGameStore((s) => s.hour)
  const isDayActive = useGameStore((s) => s.isDayActive)
  const coinsFromStore = useGameStore((s) => s.coins)
  const geminiCreditsFromStore = useGameStore((s) => s.geminiCredits)
  const levelFromStore = useGameStore((s) => s.level)
  const experienceFromStore = useGameStore((s) => s.experience)

  const coins = coinsProp ?? creditsLegacy ?? coinsFromStore
  const level = levelProp ?? levelFromStore
  const geminiCredits =
    typeof geminiCreditsFromStore === 'number' && Number.isFinite(geminiCreditsFromStore)
      ? geminiCreditsFromStore
      : 0
  const experience = experienceFromStore
  const calendarLabel = formatGameCalendarDayMonthTr(day, startedAt)

  return (
    <div className="sticky top-0 z-40 bg-background border-b-4 border-shade">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          <img src={logo} alt="SolarCast" className="w-8 h-8 object-contain shrink-0" />
          <span className="font-black text-2xl leading-none">
            <span className="text-shade">solar</span>
            <span className="text-blossom-deep">cast</span>
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 justify-end">
          {hasStartedGame && (
            <>
              <div className="rounded-full border-3 border-slate-900 bg-background p-1 shadow-[2px_2px_0px_0px_var(--shade)] flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setGameLoopMode(gameLoopMode === 'pause' ? 'play' : 'pause')}
                  className={`rounded-full border-2 px-2 py-1 transition-colors ${
                    gameLoopMode === 'pause'
                      ? 'border-slate-900 bg-blossom'
                      : 'border-transparent bg-transparent hover:bg-breeze'
                  }`}
                  title={gameLoopMode === 'pause' ? 'Devam et' : 'Durdur'}
                  aria-label={gameLoopMode === 'pause' ? 'Devam et' : 'Durdur'}
                >
                  {gameLoopMode === 'pause' ? (
                    <Play className="w-3.5 h-3.5" />
                  ) : (
                    <Pause className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setGameLoopMode(gameLoopMode === 'fast' ? 'play' : 'fast')}
                  className={`rounded-full border-2 px-2 py-1 transition-colors ${
                    gameLoopMode === 'fast'
                      ? 'border-slate-900 bg-sunlit'
                      : 'border-transparent bg-transparent hover:bg-breeze'
                  }`}
                  title={gameLoopMode === 'fast' ? 'Normal hıza dön' : 'Hızlandır'}
                  aria-label={gameLoopMode === 'fast' ? 'Normal hıza dön' : 'Hızlandır'}
                >
                  <FastForward className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="rounded-full border-2 border-slate-900 bg-blossom px-2.5 py-1 text-[11px] font-black whitespace-nowrap">
                {calendarLabel}
              </span>
              <span className="rounded-full border-2 border-slate-900 bg-breeze px-2.5 py-1 text-[11px] font-black whitespace-nowrap">
                Gün {day} • Saat {String(hour).padStart(2, '0')}:00
              </span>
            </>
          )}
          {hasStartedGame ? (
            <button
              type="button"
              onClick={() => setProgressOpen(true)}
              className="flex items-center gap-2 bg-sunlit-deep border-4 border-shade rounded-full px-3 py-1 shadow-[2px_2px_0px_0px_var(--shade)] cursor-pointer hover:brightness-95 active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shade"
              aria-label="Coin ve ilerleme özeti"
            >
              <span aria-hidden="true">🪙</span>
              <span className="font-black text-sm tabular-nums">
                {coins.toLocaleString('tr-TR')} Coin
              </span>
              <span
                aria-hidden="true"
                className="h-7 w-px bg-shade/40 shrink-0"
              />
              <span className="font-black text-xs tabular-nums text-shade whitespace-nowrap" title="CastAI kredisi">
                ✦ {geminiCredits.toLocaleString('tr-TR')}
              </span>
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-sunlit-deep border-4 border-shade rounded-full px-3 py-1 shadow-[2px_2px_0px_0px_var(--shade)]">
              <span aria-hidden="true">🪙</span>
              <span className="font-black text-sm tabular-nums">
                {coins.toLocaleString('tr-TR')} Coin
              </span>
            </div>
          )}
          {hasStartedGame ? (
            <button
              type="button"
              onClick={() => setProgressOpen(true)}
              className="flex items-center gap-2 bg-sprout-deep border-4 border-shade rounded-full px-3 py-1 shadow-[2px_2px_0px_0px_var(--shade)] cursor-pointer hover:brightness-95 active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shade"
              aria-label="Seviye ve deneyim özeti"
            >
              <span aria-hidden="true">⭐</span>
              <span className="font-black text-sm">Lv.{level}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-sprout-deep border-4 border-shade rounded-full px-3 py-1 shadow-[2px_2px_0px_0px_var(--shade)]">
              <span aria-hidden="true">⭐</span>
              <span className="font-black text-sm">Lv.{level}</span>
            </div>
          )}
        </div>
      </div>

      <PlayerProgressModal
        isOpen={progressOpen && hasStartedGame}
        onClose={() => setProgressOpen(false)}
        coins={coins}
        level={level}
        experience={experience}
        day={day}
        startedAt={startedAt}
        hour={hour}
        isDayActive={isDayActive}
      />
    </div>
  )
}

export default Header
