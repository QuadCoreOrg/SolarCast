import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import GameContainer from './screens/GameContainer'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/play" element={<GameContainer />} />
    </Routes>
  )
}

export default App
