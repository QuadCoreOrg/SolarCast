import { useState } from "react";
import HomePage from "./pages/HomePage";

function GameView() {
  return (
    <div className="min-h-screen bg-background font-['Nunito'] text-shade flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-black mb-4">🚀 Oyun Alanı</h1>
        <p className="font-bold text-shade-soft mb-6">
          Yakında burada oyun olacak!
        </p>
        <button
          className="border-4 border-shade rounded-full font-bold px-6 py-3 bg-sunlit-deep shadow-[4px_4px_0px_0px_var(--shade)] hover:opacity-90 transition-opacity cursor-pointer"
          onClick={() => window.location.reload()}
        >
          ← Landing Page'e Dön
        </button>
      </div>
    </div>
  );
}

function App() {
  const [showGame, setShowGame] = useState(false);

  if (showGame) {
    return <GameView />;
  }

  return <HomePage onPlayClick={() => setShowGame(true)} />;
}

export default App;
