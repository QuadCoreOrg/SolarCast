import React, { useState } from "react";
import useGameStore from "./store/useGameStore";
import { motion } from "framer-motion";
import Button from "./components/Button";
import Card from "./components/Card";
import Badge from "./components/Badge";
import ProgressBar from "./components/ProgressBar";
import StatCard from "./components/StatCard";
import EnergyBar from "./components/EnergyBar";
import InventoryItem from "./components/InventoryItem";
import GoalCard from "./components/GoalCard";
import ToastContainer from "./components/ToastContainer";
import Modal from "./components/Modal";
import Header from "./components/Header";
import TabBar from "./components/TabBar";
import useToastStore from "./hooks/useToast";
import {
  Sun,
  Battery,
  Settings,
  Coins,
  Zap,
  Star,
  Trophy,
  SolarPanel,
} from "lucide-react";

function App() {
  const {
    energy,
    coins,
    level,
    experience,
    dailyGoal,
    currentProgress,
    addEnergy,
    consumeEnergy,
    addCoins,
    addExperience,
    updateProgress,
  } = useGameStore();

  const { addToast } = useToastStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

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
    <div className="min-h-screen bg-pure-white font-['Nunito'] text-slate-900">
      <Header logo="☀️ SolarCast" coins={coins} level={level} />
      <div className="max-w-md mx-auto space-y-6 p-6 pb-24">
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
            <span className="font-bold">
              {currentProgress} / {dailyGoal}
            </span>
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
            <span className="font-bold">
              {experience} / {expNeeded}
            </span>
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
          <span className="font-bold">
            🎮 Game Started! Tap Generate to earn energy & coins.
          </span>
        </motion.div>

        <div className="border-t-4 border-slate-900 pt-6 mt-6">
          <h2 className="font-black text-2xl mb-4 text-center">
            Button Variants
          </h2>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 justify-center">
              <Button
                variant="primary"
                onClick={() => alert("Primary clicked!")}
              >
                Primary Button
              </Button>
              <Button
                variant="secondary"
                onClick={() => alert("Secondary clicked!")}
              >
                Secondary Button
              </Button>
            </div>
            <div className="flex gap-4 justify-center">
              <Button variant="peach" onClick={() => alert("Peach clicked!")}>
                Peach Button
              </Button>
            </div>
            <div className="flex gap-4 justify-center">
              <Button
                icon={Sun}
                variant="primary"
                onClick={() => alert("Icon Primary!")}
              />
              <Button
                icon={Battery}
                variant="secondary"
                onClick={() => alert("Icon Secondary!")}
              />
              <Button
                icon={Settings}
                variant="peach"
                onClick={() => alert("Icon Peach!")}
              />
            </div>
          </div>
        </div>

        <div className="border-t-4 border-slate-900 pt-6 mt-6">
          <h2 className="font-black text-2xl mb-4 text-center">
            Card Variants
          </h2>
          <div className="flex flex-col gap-4">
            <Card variant="dashboard">
              <h3 className="font-bold text-xl mb-2">Dashboard Card</h3>
              <p className="text-slate-600">
                This is a white dashboard card with shadow.
              </p>
            </Card>
            <Card variant="accent">
              <h3 className="font-bold text-xl mb-2">Accent Card</h3>
              <p className="text-slate-600">
                This is a soft peach accent card with shadow.
              </p>
            </Card>
          </div>
        </div>

        <div className="border-t-4 border-slate-900 pt-6 mt-6">
          <h2 className="font-black text-2xl mb-4 text-center">
            Badge Variants
          </h2>
          <div className="flex flex-wrap gap-3 justify-center">
            <Badge color="bg-sunny-yellow">Level 5</Badge>
            <Badge color="bg-mint-green">+100 XP</Badge>
            <Badge color="bg-soft-peach">Achievement</Badge>
            <Badge color="bg-blue-400">New!</Badge>
            <Badge color="bg-orange-400">Top Seller</Badge>
          </div>
        </div>

        <div className="border-t-4 border-slate-900 pt-6 mt-6">
          <h2 className="font-black text-2xl mb-4 text-center">
            ProgressBar Variants
          </h2>
          <div className="flex flex-col gap-4">
            <ProgressBar value={75} max={100} color="mint" showLabel />
            <ProgressBar value={60} max={100} color="yellow" showLabel />
            <ProgressBar value={45} max={100} color="peach" showLabel />
            <ProgressBar value={90} max={100} color="blue" showLabel />
          </div>
        </div>

        <div className="border-t-4 border-slate-900 pt-6 mt-6">
          <h2 className="font-black text-2xl mb-4 text-center">
            StatCard Variants
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <StatCard icon={Coins} label="Coins" value="1,250" color="yellow" />
            <StatCard icon={Zap} label="Energy" value="85" color="mint" />
            <StatCard icon={Star} label="Level" value="12" color="peach" />
            <StatCard icon={Trophy} label="Rank" value="#5" color="blue" />
          </div>
        </div>

        <div className="border-t-4 border-slate-900 pt-6 mt-6">
          <h2 className="font-black text-2xl mb-4 text-center">EnergyBar</h2>
          <div className="flex flex-col gap-4">
            <EnergyBar current={450} max={1000} />
            <EnergyBar current={75} max={100} />
            <EnergyBar current={1200} max={2000} />
          </div>
        </div>

        <div className="border-t-4 border-slate-900 pt-6 mt-6">
          <h2 className="font-black text-2xl mb-4 text-center">
            InventoryItem
          </h2>
          <div className="flex flex-col gap-4">
            <InventoryItem
              icon={Sun}
              name="Solar Panel Lv.1"
              detail="+5⚡/sn"
              price={100}
              onBuy={() => alert("Bought Solar Panel!")}
            />
            <InventoryItem
              icon={Battery}
              name="Battery Lv.1"
              detail="+20 capacity"
              price={150}
              onBuy={() => alert("Bought Battery!")}
            />
            <InventoryItem
              icon={SolarPanel}
              name="Upgrade"
              detail="x2 efficiency"
              price={500}
              disabled
            />
          </div>
        </div>

        <div className="border-t-4 border-slate-900 pt-6 mt-6">
          <h2 className="font-black text-2xl mb-4 text-center">GoalCard</h2>
          <div className="flex flex-col gap-4">
            <GoalCard
              title="Daily Energy Goal"
              current={65}
              goal={100}
              reward={50}
              rewardType="XP"
            />
            <GoalCard
              title="Weekly Challenge"
              current={100}
              goal={100}
              reward={200}
              rewardType="Coins"
            />
          </div>
        </div>

        <div className="border-t-4 border-slate-900 pt-6 mt-6">
          <h2 className="font-black text-2xl mb-4 text-center">
            Toast / Alert
          </h2>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-3 justify-center">
              <span className="font-bold text-sm">Bottom Center:</span>
              <Button
                variant="primary"
                onClick={() =>
                  addToast("+100 Coins!", "success", 3000, "bottom-center")
                }
              >
                Success
              </Button>
              <Button
                variant="secondary"
                onClick={() =>
                  addToast("Goal Done!", "warning", 3000, "bottom-center")
                }
              >
                Warning
              </Button>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <span className="font-bold text-sm">Top Center:</span>
              <Button
                variant="primary"
                onClick={() => addToast("+50 XP", "info", 3000, "top-center")}
              >
                Info
              </Button>
              <Button
                variant="secondary"
                onClick={() => addToast("Error!", "error", 3000, "top-center")}
              >
                Error
              </Button>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <span className="font-bold text-sm">Top Right:</span>
              <Button
                variant="peach"
                onClick={() =>
                  addToast("New Item!", "success", 3000, "top-right")
                }
              >
                Notification
              </Button>
              <Button
                variant="primary"
                onClick={() =>
                  addToast("Level Up!", "success", 3000, "top-right")
                }
              >
                Achievement
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t-4 border-slate-900 pt-6 mt-6">
          <h2 className="font-black text-2xl mb-4 text-center">Modal</h2>
          <div className="flex justify-center">
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>
              Open Modal
            </Button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Solar Panel Upgraded!"
      >
        <div className="space-y-4">
          <p className="font-bold text-slate-700">
            Congratulations! You've upgraded your solar panel to Level 2.
          </p>
          <div className="bg-mint-green border-4 border-slate-900 rounded-2xl p-4">
            <div className="font-bold">+10 ⚡ Energy/sec</div>
            <div className="font-bold text-sm text-slate-600">
              Efficiency increased!
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="primary"
              onClick={() => {
                setIsModalOpen(false);
                addToast("Upgrade Complete!", "success", 3000, "top-right");
              }}
            >
              Confirm
            </Button>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      <div className="border-t-4 border-slate-900 pt-6 mt-6">
        <h2 className="font-black text-2xl mb-4 text-center">
          Header & TabBar
        </h2>
        <div className="bg-mint-green border-4 border-slate-900 rounded-2xl p-4 text-center mb-4">
          <span className="font-bold">Active Tab: </span>
          <span className="font-black uppercase">{activeTab}</span>
        </div>
        <div className="flex justify-center gap-4">
          <Button variant="primary" onClick={() => addCoins(100)}>
            +100 Coins
          </Button>
          <Button variant="secondary" onClick={() => addExperience(50)}>
            +50 XP
          </Button>
        </div>
      </div>

      <ToastContainer />
      <TabBar activeTab={activeTab} onChange={setActiveTab} />
    </div>
  );
}

export default App;
