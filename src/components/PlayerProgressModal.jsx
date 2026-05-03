import Modal from './Modal'
import { Wallet, Gauge, Clock, Zap } from 'lucide-react'
import { levelProgressPercent, xpRequiredForLevel } from '../utils/progression'
import { formatGameCalendarDayMonthTr } from '../utils/gameCalendar'

export default function PlayerProgressModal({
  isOpen,
  onClose,
  coins,
  level,
  experience,
  day,
  startedAt,
  hour,
  isDayActive,
}) {
  const needXp = xpRequiredForLevel(level)
  const pct = levelProgressPercent(experience, level)
  const calendarLabel = formatGameCalendarDayMonthTr(typeof day === 'number' ? day : 1, startedAt)

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="İlerleme özeti" className="max-w-md">
      <div className="space-y-4 font-bold text-shade">
        <div className="rounded-2xl border-3 border-slate-900 bg-sunlit-deep/80 p-3 flex gap-3 items-start">
          <div className="w-11 h-11 rounded-xl border-3 border-slate-900 bg-background flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5" strokeWidth={2.25} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black text-shade-2 uppercase tracking-wide">Coin</p>
            <p className="text-2xl font-black tabular-nums break-all">
              {typeof coins === 'number' ? coins.toLocaleString('tr-TR') : '—'} Coin
            </p>
          </div>
        </div>

        <div className="rounded-2xl border-3 border-slate-900 bg-breeze/70 p-3 flex gap-3 items-start">
          <div className="w-11 h-11 rounded-xl border-3 border-slate-900 bg-background flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" strokeWidth={2.25} />
          </div>
          <div>
            <p className="text-xs font-black text-shade-2 uppercase tracking-wide">Oyun takvimi</p>
            <p className="text-lg font-black">{calendarLabel}</p>
            <p className="text-sm font-black text-shade-2 mt-0.5">
              <span className="text-shade">Gün {day}</span>
              {isDayActive ? (
                <span>{' · '}Simülasyon saati {String(hour ?? 0).padStart(2, '0')}:00</span>
              ) : (
                <span className="font-bold">{` · Beklemede (henüz gün içi saat işlemiyor)`}</span>
              )}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border-4 border-slate-900 bg-sprout-deep/70 p-3">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl border-3 border-slate-900 bg-background flex items-center justify-center shrink-0">
              <Gauge className="w-5 h-5" strokeWidth={2.25} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-shade-2 uppercase tracking-wide">
                Seviye ve deneyim
              </p>
              <div className="flex items-baseline justify-between gap-2 flex-wrap mt-1">
                <p className="text-2xl font-black leading-none">Lv. {level}</p>
                <p className="text-xs font-black text-shade-2 tabular-nums whitespace-nowrap">
                  {experience} / {needXp} XP
                </p>
              </div>
              <div className="mt-2 h-4 rounded-full border-3 border-slate-900 bg-background overflow-hidden">
                <div
                  className="h-full bg-blossom transition-[width] duration-200 ease-out"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-[11px] font-bold text-shade-2 mt-1">
                Bu seviye çubuğu: mevcut Lv.{level} için {needXp} XP gerekiyor (formül: seviye × 100).
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border-3 border-slate-900 bg-background p-3">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 shrink-0" strokeWidth={2.25} />
            <p className="text-xs font-black uppercase tracking-wide">XP nereden gelir?</p>
          </div>
          <ul className="text-[11px] font-bold text-shade-2 space-y-1.5 list-disc pl-4">
            <li>Enerji satışı (satılan kWh başına + taban)</li>
            <li>Yeni panel veya depolama ünitesi satın alma</li>
            <li>Panel temizliği (verim geri kazanımı)</li>
            <li>Birleşik yuva kilidi açma</li>
            <li>Pazar veya laboratuvarda araştırma tamamlama</li>
          </ul>
        </div>
      </div>
    </Modal>
  )
}
