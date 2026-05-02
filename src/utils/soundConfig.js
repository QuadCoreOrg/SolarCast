export const SOUND_IDS = {
  CLICK: 'click',
  BUYING: 'buying',
  ERROR: 'error',
  LEVEL_UP: 'level_up',
}

export const SOUND_LIBRARY = {
  [SOUND_IDS.CLICK]: {
    src: '/sounds/click.mp3',
    gain: 1,
  },
  [SOUND_IDS.BUYING]: {
    src: '/sounds/buying.mp3',
    gain: 0.95,
  },
  [SOUND_IDS.ERROR]: {
    src: '/sounds/error.mp3',
    gain: 0.9,
  },
  [SOUND_IDS.LEVEL_UP]: {
    src: '/sounds/level_up.mp3',
    gain: 1,
  },
}
