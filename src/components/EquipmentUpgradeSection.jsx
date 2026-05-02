import { TrendingUp } from 'lucide-react'
import { sfxError } from '../utils/soundManager'

function targetLine(variant, targetDef) {
  if (!targetDef) return ''
  if (variant === 'panel') {
    const eff = typeof targetDef.efficiency === 'number' ? `${(targetDef.efficiency * 100).toFixed(0)}%` : '—'
    return `${targetDef.name} · Alan ${targetDef.area} m² · Verim ${eff} · Üretim +${targetDef.area} kWh (1000 W/m²)`
  }
  return `${targetDef.name} · Kapasite ${targetDef.capacity} kWh`
}

/** Panel veya batarya detay modalında retrofit yükseltme alanı (maliyet + araştırma şartları). */
export default function EquipmentUpgradeSection({ variant, projection, coins, onUpgrade, error }) {
  if (!projection) {
    return (
      <div className="rounded-2xl border-3 border-slate-900 bg-breeze/50 p-3 shadow-[inset_0_0_0_1px_rgba(42,42,51,0.06)]">
        <p className="text-[11px] font-black uppercase tracking-wide text-shade-soft">Retrofit yükseltme</p>
        <p className="text-sm font-bold text-shade mt-2">Bu ekipman zaten en üst sınıfta.</p>
      </div>
    )
  }

  const affordable = coins >= projection.coinCost
  const canActivate = projection.canPurchase && affordable
  const subtitle = targetLine(variant, projection.targetDef)

  return (
    <div className="rounded-2xl border-3 border-slate-900 bg-blossom/30 p-3 shadow-[2px_2px_0px_0px_var(--shade)]">
      <div className="flex items-start gap-2">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-3 border-slate-900 bg-background">
          <TrendingUp className="h-5 w-5 text-shade" strokeWidth={2.25} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-black uppercase tracking-wide text-shade-soft">Bir üst modele yükselt</p>
          <p className="text-xs font-bold text-shade-2 mt-1 leading-snug">{subtitle}</p>
          <p className="text-sm font-black text-shade mt-2 tabular-nums">
            Bedel: {projection.coinCost.toLocaleString('tr-TR')} Coin
          </p>
        </div>
      </div>

      {projection.blockerLines.length > 0 && (
        <ul className="mt-3 space-y-1 rounded-xl border-2 border-rose-200 bg-rose-50/70 px-2.5 py-2 text-[11px] font-bold text-rose-900">
          {projection.blockerLines.map((line, i) => (
            <li key={i} className="leading-snug">
              • {line}
            </li>
          ))}
        </ul>
      )}

      {projection.canPurchase && !affordable && (
        <p className="mt-2 text-xs font-bold text-rose-700">Bu işlem için yeterli coin yok.</p>
      )}

      {error && <p className="mt-2 text-xs font-bold text-rose-800">{error}</p>}

      <button
        type="button"
        onClick={() => {
          if (!projection.canPurchase) return
          if (!affordable) {
            sfxError()
            return
          }
          onUpgrade()
        }}
        className={`mt-3 w-full rounded-xl border-3 border-slate-900 px-3 py-2 text-sm font-black text-shade shadow-[2px_2px_0px_0px_var(--shade)] active:translate-y-0.5 active:shadow-none ${
          canActivate
            ? 'bg-sunlit-deep cursor-pointer'
            : 'bg-border opacity-65 cursor-pointer'
        }`}
      >
        {projection.coinCost.toLocaleString('tr-TR')} Coin öde — yükselt
      </button>
    </div>
  )
}
