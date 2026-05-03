import { GoogleGenAI } from '@google/genai'
import { DEFAULT_GEMINI_MODEL } from '../constants/castAi'

function getApiKey() {
  const key = typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY
  return typeof key === 'string' && key.trim().length > 0 ? key.trim() : null
}

function getModelName() {
  const m =
    typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_MODEL != null
      ? String(import.meta.env.VITE_GEMINI_MODEL).trim()
      : ''
  return m || DEFAULT_GEMINI_MODEL
}

function parseAdvisorJson(raw) {
  let t = String(raw ?? '').trim()
  const fence = /^```(?:json)?\s*([\s\S]*?)```$/im.exec(t)
  if (fence) t = fence[1].trim()
  const o = JSON.parse(t)

  const rec = String(o.recommendation ?? '')
    .trim()
    .toUpperCase()
  const recommendation =
    rec === 'SAT' || rec === 'SELL'
      ? 'SAT'
      : rec === 'SATMA' || rec === 'WAIT' || rec === 'HOLD' || rec === 'BEKLE'
        ? 'SATMA'
        : null

  if (!recommendation) {
    throw new Error('Öneri SAT veya SATMA olmalı')
  }

  const confidencePct = Math.round(
    Math.min(98, Math.max(40, Number(o.confidence_pct ?? o.confidencePct ?? 70))),
  )

  const suggested = o.suggested_sell_pct ?? o.suggestedSellPct ?? null
  const suggestedSellPct =
    suggested == null || suggested === ''
      ? null
      : Math.min(100, Math.max(5, Math.round(Number(suggested) / 5) * 5))

  const tagsRaw = o.tags_tr ?? o.tags ?? []
  const tagsTr = Array.isArray(tagsRaw)
    ? tagsRaw.map((x) => String(x)).filter(Boolean).slice(0, 8)
    : []

  return {
    recommendation,
    confidencePct,
    headlineTr: String(o.headline_tr ?? o.headline ?? '').slice(0, 200),
    detailTr: String(o.detail_tr ?? o.detail ?? '').slice(0, 1200),
    reasoningShortTr: String(o.reasoning_short_tr ?? o.reasoning ?? '').slice(0, 400),
    suggestedSellPct,
    tagsTr,
  }
}

function buildPrompt(snapshot) {
  const ctxJson = JSON.stringify(snapshot, null, 2)
  return [
    'SolarCast mobil/web oyununda gömülüsün — oyuncunun depolanan güneş enerjisini spot piyasadan Coin karşılığında satmasına Türkçe ve kısa tavsiye veriyorsun. Bu gerçek finans değildir.',
    '',
    'Oyuncu bağlamı (JSON):',
    ctxJson,
    '',
    'KURALLAR:',
    '1) Tek bir JSON nesnesi döndür — başlık, markdown veya ek metin yok.',
    '2) Öneri anahtarı recommendation sadece SAT veya SATMA (büyük harf) olabilir.',
    '3) Depoda satılabilir enerji yoksa veya batarya yoksa SATMA de ve açıkla.',
    '4) Güven confidence_pct 40–98 arası tamsayı.',
    '5) Türkçe alanlar headline_tr, detail_tr, reasoning_short_tr, tags_tr doldur.',
    '6) SAT ise suggested_sell_pct 5–100 arası 5’in katları; SATMA ise null.',
    '',
    'Örnek biçim:',
    '{"recommendation":"SATMA","confidence_pct":70,"headline_tr":"Başlık","detail_tr":"Açıklama.","reasoning_short_tr":"Özet gerekçe.","tags_tr":["etiket"],"suggested_sell_pct":null}',
  ].join('\n')
}

export async function fetchGeminiSellAdvice(gameSnapshot) {
  const apiKey = getApiKey()
  if (!apiKey) {
    throw new Error(
      'Danışman bağlantısı ayarlı değil — bu sürümde öneri alınamıyor.',
    )
  }

  const model = getModelName()
  const ai = new GoogleGenAI({ apiKey })

  const response = await ai.models.generateContent({
    model,
    contents: buildPrompt(gameSnapshot),
    config: {
      responseMimeType: 'application/json',
    },
  })

  const raw = typeof response?.text === 'string' ? response.text : ''
  if (!raw) throw new Error('Şu an yanıt gelmedi — kısa bir süre sonra tekrar deneyebilirsin.')

  try {
    return parseAdvisorJson(raw)
  } catch (e) {
    throw new Error('Öneri okunamadı — bağlantını kontrol et veya tekrar dene.', {
      cause: e,
    })
  }
}

export function geminiConfigured() {
  return Boolean(getApiKey())
}
