import { create } from 'zustand'

const SOUND_STORAGE_KEY = 'solarcast_sound_settings'
const DEFAULT_MASTER_VOLUME = 80

const clampVolume = (value) => Math.max(0, Math.min(100, value))

const getInitialVolume = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_MASTER_VOLUME
  }

  try {
    const raw = window.localStorage.getItem(SOUND_STORAGE_KEY)
    if (!raw) {
      return DEFAULT_MASTER_VOLUME
    }

    const parsed = JSON.parse(raw)
    if (typeof parsed.masterVolume !== 'number') {
      return DEFAULT_MASTER_VOLUME
    }

    return clampVolume(parsed.masterVolume)
  } catch {
    return DEFAULT_MASTER_VOLUME
  }
}

const persistVolume = (masterVolume) => {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(
      SOUND_STORAGE_KEY,
      JSON.stringify({ masterVolume }),
    )
  } catch {
    // no-op: app should continue even if storage is unavailable
  }
}

const useSoundStore = create((set) => ({
  masterVolume: getInitialVolume(),
  setMasterVolume: (value) => {
    const safeVolume = clampVolume(value)
    persistVolume(safeVolume)
    set({ masterVolume: safeVolume })
  },
}))

export default useSoundStore
