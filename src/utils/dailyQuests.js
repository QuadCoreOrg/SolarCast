import { DAILY_QUEST_GEMINI_REWARD } from '../constants/castAi'

export { DAILY_QUEST_GEMINI_REWARD }

/** Yerel takvim günü (YYYY-MM-DD) — günlük görev yenilemesi için */
export function getLocalDateKey(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const KINDS = ['sell_kwh', 'sell_coins', 'storage_expand', 'clean_panel']

function randInt(min, max, rng) {
  return Math.floor(rng() * (max - min + 1)) + min
}

/** [0,1) üreten deterministik olmayan RNG — batch çeşitliliği */
function createRng() {
  return () => Math.random()
}

function shuffleInPlace(arr, rng) {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function titleForQuest(kind, target) {
  switch (kind) {
    case 'sell_kwh':
      return `Depodan toplam ${target} kWh enerji sat`
    case 'sell_coins':
      return `Enerji satarak toplam ${target} Coin kazan`
    case 'storage_expand':
      return target <= 1
        ? 'Depolama kapasitesini bir kez genişlet'
        : `Depolama kapasitesini ${target} kez genişlet`
    case 'clean_panel':
      return target <= 1 ? 'Bir paneli temizle' : `${target} paneli temizle`
    default:
      return 'Görev'
  }
}

function makeQuest(kind, rng) {
  let target
  switch (kind) {
    case 'sell_kwh':
      target = randInt(8, 22, rng)
      break
    case 'sell_coins':
      target = randInt(250, 650, rng)
      // coin round to tens for readability
      target = Math.round(target / 10) * 10
      break
    case 'storage_expand':
      target = randInt(1, 2, rng)
      break
    case 'clean_panel':
      target = randInt(1, 2, rng)
      break
    default:
      target = 1
  }

  const id =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `q_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

  return {
    id,
    kind,
    target,
    progress: 0,
    completed: false,
    title: titleForQuest(kind, target),
  }
}

/** Aynı anda tek örnek: çeşitli 3 görev */
export function generateDailyQuestBatch() {
  const rng = createRng()
  const kinds = shuffleInPlace([...KINDS], rng).slice(0, 3)
  return kinds.map((k) => makeQuest(k, rng))
}

/**
 * Oyun durumu + olay → yeni görev listesi, verilecek CastAI kredisi toplamı, tamamlanan görev id’leri
 */
export function reduceDailyQuestsOnEvent(quests, event) {
  if (!Array.isArray(quests) || quests.length === 0) {
    return { nextQuests: quests, geminiToAdd: 0, justCompletedIds: [], newlyCompletedTitles: [] }
  }

  let geminiToAdd = 0
  const justCompletedIds = []
  const newlyCompletedTitles = []
  const nextQuests = quests.map((q) => {
    if (q.completed) return q

    let nextProgress = q.progress
    switch (event.type) {
      case 'energy_sold':
        if (q.kind === 'sell_kwh') {
          nextProgress += typeof event.kwh === 'number' ? event.kwh : 0
        }
        if (q.kind === 'sell_coins') {
          nextProgress += typeof event.coins === 'number' ? event.coins : 0
        }
        break
      case 'storage_expanded':
        if (q.kind === 'storage_expand') nextProgress += 1
        break
      case 'panel_cleaned':
        if (q.kind === 'clean_panel') nextProgress += 1
        break
      default:
        break
    }

    const capped = Math.min(nextProgress, q.target)
    const completed = capped >= q.target
    if (completed && !q.completed) {
      geminiToAdd += DAILY_QUEST_GEMINI_REWARD
      justCompletedIds.push(q.id)
      newlyCompletedTitles.push(String(q.title ?? 'Görev'))
    }

    return {
      ...q,
      progress: capped,
      completed,
    }
  })

  return { nextQuests, geminiToAdd, justCompletedIds, newlyCompletedTitles }
}

export function allQuestsCompleted(quests) {
  return Array.isArray(quests) && quests.length > 0 && quests.every((q) => q.completed)
}
