import { useId } from 'react'

const MIN_PCT = 5
const MAX_PCT = 100
const STEP_PCT = 5

function clampPct(n) {
  const snapped = Math.round(n / STEP_PCT) * STEP_PCT
  return Math.min(MAX_PCT, Math.max(MIN_PCT, snapped))
}

/**
 * Depodan satılacak pay (%5 adımlar). Yalnızca slider / ilerleme çubuğu.
 *
 * @param {object} props
 * @param {number} props.valuePct — 5, 10, … 100
 * @param {(n: number) => void} props.onChangePct
 * @param {boolean} [props.disabled]
 */
export default function PercentSellSelector({ valuePct, onChangePct, disabled = false }) {
  const labelId = useId()
  const safe = clampPct(Number(valuePct))

  return (
    <div className="space-y-2">
      <div id={labelId} className="text-xs font-black text-shade-2 uppercase tracking-wide">
        Satılacak depo yüzdesi (adım %{STEP_PCT})
      </div>
      <div
        className="rounded-2xl border-4 border-slate-900 bg-breeze/40 px-4 py-3 shadow-[inset_0_0_0_2px_rgba(42,42,51,0.06)]"
        aria-labelledby={labelId}
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-3xl font-black tabular-nums">%{safe}</span>
        </div>

        <div className="h-7 rounded-xl border-[3px] border-slate-900 bg-background overflow-hidden relative">
          <div
            className="absolute inset-y-0 left-0 bg-sprout-deep transition-[width] duration-75 ease-out"
            style={{
              width: `${((safe - MIN_PCT) / (MAX_PCT - MIN_PCT)) * 100}%`,
            }}
            aria-hidden
          />
          <input
            type="range"
            min={MIN_PCT}
            max={MAX_PCT}
            step={STEP_PCT}
            disabled={disabled}
            value={safe}
            onChange={(e) => onChangePct(clampPct(Number(e.target.value)))}
            aria-valuemin={MIN_PCT}
            aria-valuemax={MAX_PCT}
            aria-valuenow={safe}
            className="absolute inset-0 w-full opacity-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 z-10 h-full"
          />
        </div>
      </div>
    </div>
  )
}
