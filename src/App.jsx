import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import GameContainer from './screens/GameContainer'
import { SOUND_IDS } from './utils/soundConfig'
import { sfxClick, soundManager } from './utils/soundManager'

function App() {
  useEffect(() => {
    soundManager.preload([SOUND_IDS.CLICK])
    const onClickCapture = (e) => {
      if (typeof e.button === 'number' && e.button !== 0) return
      sfxClick()
    }
    document.addEventListener('mousedown', onClickCapture, true)
    return () => document.removeEventListener('mousedown', onClickCapture, true)
  }, [])

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/play" element={<GameContainer />} />
    </Routes>
  )
}

export default App