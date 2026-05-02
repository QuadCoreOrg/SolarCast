import { SOUND_LIBRARY } from './soundConfig'

class SoundManager {
  constructor() {
    this.masterVolume = 0.8
    this.cache = new Map()
  }

  setMasterVolume(value) {
    const normalized = Number.isFinite(value) ? value : 80
    const clamped = Math.max(0, Math.min(100, normalized))
    this.masterVolume = clamped / 100
  }

  getMasterVolume() {
    return Math.round(this.masterVolume * 100)
  }

  preload(ids = Object.keys(SOUND_LIBRARY)) {
    ids.forEach((id) => {
      const config = SOUND_LIBRARY[id]
      if (!config || this.cache.has(id)) {
        return
      }

      const audio = new Audio(config.src)
      audio.preload = 'auto'
      this.cache.set(id, audio)
    })
  }

  play(id, options = {}) {
    const config = SOUND_LIBRARY[id]
    if (!config) {
      return
    }

    if (!this.cache.has(id)) {
      this.preload([id])
    }

    const cachedAudio = this.cache.get(id)
    if (!cachedAudio) {
      return
    }

    const volumeBoost = Number.isFinite(options.gain) ? options.gain : 1
    const finalVolume = Math.max(
      0,
      Math.min(1, this.masterVolume * config.gain * volumeBoost),
    )

    const audio = options.allowOverlap ? cachedAudio.cloneNode() : cachedAudio
    audio.volume = finalVolume
    audio.currentTime = 0
    audio.play().catch(() => {})
  }

  stop(id) {
    const audio = this.cache.get(id)
    if (!audio) {
      return
    }

    audio.pause()
    audio.currentTime = 0
  }

  stopAll() {
    this.cache.forEach((audio) => {
      audio.pause()
      audio.currentTime = 0
    })
  }
}

export const soundManager = new SoundManager()
