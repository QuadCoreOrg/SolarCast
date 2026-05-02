import React from "react";
import useGameStore from "./store/useGameStore";
import { motion } from "framer-motion";
import Button from "./components/Button";
import Card from "./components/Card";
import { Sun, Battery, Settings } from "lucide-react";

function App() {
  const { 
    energy, coins, level, experience,
    dailyGoal, currentProgress,
    addEnergy, consumeEnergy,
    addCoins, addExperience,
    updateProgress
  } = useGameStore();

  const handleGenerateEnergy = () => {
    addEnergy(10);
    addCoins(5);
    addExperience(15);
    updateProgress(currentProgress + 10);
  };

  const handleConsumeEnergy = () => {
    consumeEnergy(5);
  };

  const expNeeded = level * 100;
  const progressPercent = (currentProgress / dailyGoal) * 100;

  return (
    <div className="min-h-screen bg-pure-white font-['Nunito'] text-slate-900 p-6">
      <div className="max-w-md mx-auto space-y-6">
        
        <motion.h1 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="text-4xl font-black text-center"
        >
          ☀️ SolarCast
        </motion.h1>

        <div className="bg-white border-4 border-slate-900 rounded-3xl p-6 shadow-[6px_6px_0px_0px_#0f172a]">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-xl">⚡ Energy</span>
            <span className="font-black text-2xl">{energy}</span>
          </div>
          <div className="w-full h-8 bg-slate-100 border-4 border-slate-900 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-mint-green"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(energy, 100)}%` }}
              transition={{ type: "spring", stiffness: 200 }}
            />
          </div>
        </div>

        <div className="bg-soft-peach border-4 border-slate-900 rounded-3xl p-6 shadow-[6px_6px_0px_0px_#0f172a]">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-xl">🎯 Daily Goal</span>
            <span className="font-bold">{currentProgress} / {dailyGoal}</span>
          </div>
          <div className="w-full h-8 bg-white border-4 border-slate-900 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-sunny-yellow"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progressPercent, 100)}%` }}
              transition={{ type: "spring", stiffness: 200 }}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 bg-mint-green border-4 border-slate-900 rounded-3xl p-4 shadow-[4px_4px_0px_0px_#0f172a] text-center">
            <div className="font-bold text-lg">🪙 Coins</div>
            <div className="font-black text-3xl">{coins}</div>
          </div>
          <div className="flex-1 bg-sunny-yellow border-4 border-slate-900 rounded-3xl p-4 shadow-[4px_4px_0px_0px_#0f172a] text-center">
            <div className="font-bold text-lg">⭐ Level</div>
            <div className="font-black text-3xl">{level}</div>
          </div>
        </div>

        <div className="bg-slate-100 border-4 border-slate-900 rounded-2xl p-4">
          <div className="flex justify-between mb-2">
            <span className="font-bold">Experience</span>
            <span className="font-bold">{experience} / {expNeeded}</span>
          </div>
          <div className="w-full h-4 bg-white border-2 border-slate-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-400"
              style={{ width: `${(experience / expNeeded) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95, y: 2 }}
            onClick={handleGenerateEnergy}
            className="flex-1 bg-sunny-yellow border-4 border-slate-900 rounded-full font-bold text-slate-900 px-6 py-4 shadow-[4px_4px_0px_0px_#0f172a] active:translate-y-1 active:shadow-none transition-all text-lg"
          >
            ☀️ Generate
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95, y: 2 }}
            onClick={handleConsumeEnergy}
            className="flex-1 bg-soft-peach border-4 border-slate-900 rounded-full font-bold text-slate-900 px-6 py-4 shadow-[4px_4px_0px_0px_#0f172a] active:translate-y-1 active:shadow-none transition-all text-lg"
          >
            🔋 Use
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-mint-green border-4 border-slate-900 rounded-2xl p-4 text-center"
        >
          <span className="font-bold">🎮 Game Started! Tap Generate to earn energy & coins.</span>
        </motion.div>

        <div className="border-t-4 border-slate-900 pt-6 mt-6">
          <h2 className="font-black text-2xl mb-4 text-center">Button Variants</h2>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 justify-center">
              <Button variant="primary" onClick={() => alert('Primary clicked!')}>
                Primary Button
              </Button>
              <Button variant="secondary" onClick={() => alert('Secondary clicked!')}>
                Secondary Button
              </Button>
            </div>
            <div className="flex gap-4 justify-center">
              <Button variant="peach" onClick={() => alert('Peach clicked!')}>
                Peach Button
              </Button>
            </div>
            <div className="flex gap-4 justify-center">
              <Button icon={Sun} variant="primary" onClick={() => alert('Icon Primary!')} />
              <Button icon={Battery} variant="secondary" onClick={() => alert('Icon Secondary!')} />
              <Button icon={Settings} variant="peach" onClick={() => alert('Icon Peach!')} />
            </div>
          </div>
        </div>

        <div className="border-t-4 border-slate-900 pt-6 mt-6">
          <h2 className="font-black text-2xl mb-4 text-center">Card Variants</h2>
          <div className="flex flex-col gap-4">
            <Card variant="dashboard">
              <h3 className="font-bold text-xl mb-2">Dashboard Card</h3>
              <p className="text-slate-600">This is a white dashboard card with shadow.</p>
            </Card>
            <Card variant="accent">
              <h3 className="font-bold text-xl mb-2">Accent Card</h3>
              <p className="text-slate-600">This is a soft peach accent card with shadow.</p>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;