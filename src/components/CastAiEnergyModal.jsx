import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Sparkles } from 'lucide-react'
import Modal from './Modal'
import { CAST_AI_REQUEST_CREDITS } from '../constants/castAi'
import { fetchGeminiSellAdvice, geminiConfigured } from '../services/geminiSellAdvisor'

export default function CastAiEnergyModal({
  isOpen,
  onClose,
  gameSnapshot,
  geminiCredits,
  spendGeminiCredits,
  canNavigateToSellFlow,
  onNavigateToSell,
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [advice, setAdvice] = useState(null)

  const configured = geminiConfigured()
  const canAffordRequest = geminiCredits >= CAST_AI_REQUEST_CREDITS

  const handleRequest = async () => {
    if (!configured) {
      setError('Danışman şu an açılamıyor. Bu sürümde öneri servisi yapılandırılmamış olabilir.')
      return
    }
    if (!canAffordRequest) {
      setError(`Bu analiz için en az ${CAST_AI_REQUEST_CREDITS} CastAI kredisi gerekir.`)
      return
    }
    setLoading(true)
    setError('')
    try {
      const result = await fetchGeminiSellAdvice(gameSnapshot)
      const spend = spendGeminiCredits(CAST_AI_REQUEST_CREDITS)
      if (!spend?.ok) {
        setAdvice(null)
        setError(spend?.reason ?? 'Krediler güncellenemedi, bir daha dene.')
        return
      }
      setAdvice(result)
    } catch (e) {
      setAdvice(null)
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  const isSell = advice?.recommendation === 'SAT'

  function handleGoSell() {
    const pct =
      typeof advice?.suggestedSellPct === 'number' && Number.isFinite(advice.suggestedSellPct)
        ? advice.suggestedSellPct
        : undefined
    onNavigateToSell(pct)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      preventClose={loading}
      title="Enerji satışı için öneri"
      className="max-w-lg"
    >
      <div className="space-y-4 font-bold text-shade">
        <div className="rounded-2xl border-3 border-slate-900 bg-breeze/40 p-3 space-y-1">
          <p className="text-[11px] font-black uppercase tracking-wide text-shade-2">
            Nasıl çalışır?
          </p>
          <p className="text-sm font-black">
            Bir öneri: <span className="tabular-nums">{CAST_AI_REQUEST_CREDITS}</span> CastAI kredisi
          </p>
          <p className="text-xs font-bold text-shade-2 leading-snug">
            Analizi sadece sen başlatırsın. Öneri hazırlanırken oyundaki gün durur; böylece fiyatların kaçmasından veya zamanın
            ilerlemesinden endişelenmezsin.
          </p>
          <p className="text-xs font-black mt-2">
            Kredin:{' '}
            <span className="tabular-nums text-blossom-deep">{geminiCredits.toLocaleString('tr-TR')}</span>
          </p>
          {!configured && (
            <p className="text-[11px] font-bold text-rose-700 mt-1">
              Bu ortamda danışman kapalı — öneri alınamaz.
            </p>
          )}
        </div>

        <button
          type="button"
          disabled={loading || !configured || !canAffordRequest}
          onClick={() => void handleRequest()}
          className="w-full rounded-2xl border-4 border-slate-900 bg-sunlit-deep px-4 py-3 font-black shadow-[4px_4px_0px_0px_var(--shade)] active:translate-y-1 active:shadow-none disabled:opacity-45 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin shrink-0" aria-hidden />
              Önerin hazırlanıyor…
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5 shrink-0" strokeWidth={2.25} />
              {CAST_AI_REQUEST_CREDITS} kredi ile öneri iste
            </>
          )}
        </button>

        {error && (
          <p className="text-xs font-bold text-rose-800 rounded-xl border-2 border-rose-300 bg-rose-50 px-2 py-1.5">
            {error}
          </p>
        )}

        {advice && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl border-4 p-3 shadow-[4px_4px_0px_0px_var(--shade)] ${
              isSell ? 'border-emerald-900 bg-emerald-50/90' : 'border-amber-900 bg-amber-50/90'
            }`}
          >
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="rounded-full border-2 border-slate-900 bg-background px-2.5 py-0.5 text-xs font-black">
                {advice.recommendation === 'SAT' ? 'SAT' : 'SATMA'}
              </span>
              <span className="rounded-full border-2 border-slate-900 px-2.5 py-0.5 text-[10px] font-black bg-background tabular-nums">
                Güven derecesi %{advice.confidencePct}
              </span>
            </div>
            <p className="font-black text-base">{advice.headlineTr}</p>
            <p className="text-xs font-bold text-shade-2 mt-2 leading-snug">{advice.detailTr}</p>
            {advice.reasoningShortTr?.length ? (
              <p className="text-[11px] font-bold text-shade-soft mt-2 leading-snug">{advice.reasoningShortTr}</p>
            ) : null}
            {advice.tagsTr?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {advice.tagsTr.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-slate-900/70 bg-background/90 px-2 py-0.5 text-[10px] font-black"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
            {advice.suggestedSellPct != null && advice.recommendation === 'SAT' && (
              <p className="text-[11px] font-black text-shade-2 mt-2">
                Modelin önerdiği yüzdelik başlangıcı: %{advice.suggestedSellPct} (satış ekranında uygulanabilir)
              </p>
            )}
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
          {advice?.recommendation === 'SAT' && canNavigateToSellFlow && (
            <button
              type="button"
              disabled={loading}
              onClick={handleGoSell}
              className="sm:col-span-2 rounded-2xl border-4 border-emerald-900 bg-emerald-200 px-4 py-2 font-black shadow-[3px_3px_0px_0px_var(--shade)] active:translate-y-1 active:shadow-none"
            >
              SAT — satış ekranına geç
            </button>
          )}
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="rounded-2xl border-4 border-slate-900 bg-background px-4 py-2 font-black shadow-[3px_3px_0px_0px_var(--shade)] active:translate-y-1 active:shadow-none disabled:opacity-55"
          >
            Kapat
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="rounded-2xl border-4 border-slate-900 bg-blossom-deep px-4 py-2 font-black shadow-[3px_3px_0px_0px_var(--shade)] active:translate-y-1 active:shadow-none"
          >
            SATMA — kapat
          </button>
        </div>

        <p className="text-[9px] font-bold text-shade-soft leading-snug">
          Öneriler yol gösterir; karar hep sende. Depoda enerji varsa gösterge panelinden “Enerji sat” ile yüzdeliği kendin
          seçerek onaylarsın.
        </p>
      </div>
    </Modal>
  )
}
