import { useLayoutEffect } from 'react'
import { CheckCircle2, CircleDashed, ListChecks, Sparkles } from 'lucide-react'
import useGameStore from '../store/useGameStore'
import { DAILY_QUEST_GEMINI_REWARD } from '../constants/castAi'

function formatProgressLabel(kind, progress, target) {
  const p = typeof progress === 'number' ? progress : 0
  const t = typeof target === 'number' ? target : 0
  switch (kind) {
    case 'sell_kwh':
      return `${Math.round(p * 10) / 10} / ${t} kWh`
    case 'sell_coins':
      return `${Math.round(p).toLocaleString('tr-TR')} / ${t.toLocaleString('tr-TR')} Coin`
    default:
      return `${Math.min(Math.round(p), t)} / ${t}`
  }
}

export default function DailyQuestsPanel({ className = '' }) {
  const dailyQuests = useGameStore((s) => s.dailyQuests)
  const ensureDailyQuestsForToday = useGameStore((s) => s.ensureDailyQuestsForToday)
  const hasStartedGame = useGameStore((s) => s.hasStartedGame)

  useLayoutEffect(() => {
    if (hasStartedGame) ensureDailyQuestsForToday()
  }, [hasStartedGame, ensureDailyQuestsForToday])

  if (!hasStartedGame) return null

  return (
    <article
      className={`rounded-2xl border-4 border-slate-900 bg-background p-4 shadow-[4px_4px_0px_0px_var(--shade)] min-w-0 ${className}`.trim()}
    >
      <div className="mb-4 flex flex-col items-center gap-2 text-center">
        {/* Tek düz sıra: ikon + başlık + ödül rozetleri, ortalı */}
        <div className="flex w-full min-w-0 flex-wrap items-center justify-center gap-x-2 gap-y-1 sm:gap-x-3 sm:gap-y-1">
          <div className="shrink-0 rounded-xl border-3 border-slate-900 bg-sprout/60 p-1.5 shadow-[2px_2px_0px_0px_var(--shade)] sm:p-2">
            <ListChecks className="h-[1.125rem] w-[1.125rem] sm:h-5 sm:w-5" strokeWidth={2.25} aria-hidden />
          </div>
          <h2 className="shrink-0 text-center font-black text-sm leading-tight text-shade sm:text-base sm:whitespace-nowrap">
            Bugünün görevleri
          </h2>
          <span
            className="hidden sm:block h-4 w-0.5 shrink-0 rounded-full bg-slate-900/25"
            aria-hidden
          />
          <span className="shrink-0 rounded-full border-2 border-slate-900 bg-sunlit/80 px-2.5 py-0.5 text-center text-[10px] font-black text-shade tabular-nums shadow-[2px_2px_0px_0px_var(--shade)] sm:px-3 sm:py-1 sm:text-xs">
            {DAILY_QUEST_GEMINI_REWARD} CastAI · görev başına
          </span>
        </div>

        <p className="w-full max-w-lg text-[11px] font-bold leading-relaxed text-shade-2 px-1 xl:max-w-none">
          Her tamamlanan görev bu ödülü verir. Üç görevi bitirince liste yenilenir; her yerel takvim günü de baştan başlar.
        </p>
      </div>

      {dailyQuests.length === 0 ? (
        <p className="text-xs font-bold text-shade-2">Görevler yükleniyor…</p>
      ) : (
        <ul className="space-y-3">
          {dailyQuests.map((q) => {
            const pct = q.target > 0 ? Math.min(100, (q.progress / q.target) * 100) : 0
            const done = Boolean(q.completed)
            return (
              <li
                key={q.id}
                className={`rounded-2xl border-3 border-slate-900 px-3 py-2.5 shadow-[2px_2px_0px_0px_var(--shade)] ${
                  done ? 'bg-sprout/45' : 'bg-breeze/35'
                }`}
              >
                <div className="flex items-start gap-2">
                  {done ? (
                    <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-800 mt-0.5" aria-hidden />
                  ) : (
                    <CircleDashed className="w-5 h-5 shrink-0 text-shade-2 mt-0.5" aria-hidden />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-black leading-snug ${done ? 'text-shade-2 line-through' : ''}`}>
                      {q.title}
                    </p>
                    <p className="text-[11px] font-bold text-shade-2 mt-1 tabular-nums">
                      {formatProgressLabel(q.kind, q.progress, q.target)}
                      {done ? (
                        <span className="ml-2 font-black text-emerald-900">
                          +{DAILY_QUEST_GEMINI_REWARD} kredi
                        </span>
                      ) : null}
                    </p>
                    <div className="mt-2 h-2 rounded-full border-2 border-slate-900 bg-background overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-[width] duration-300 ${
                          done ? 'bg-emerald-600' : 'bg-sprout-deep'
                        }`}
                        style={{ width: `${done ? 100 : pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </article>
  )
}
