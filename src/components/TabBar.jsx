import { BatteryCharging, FlaskConical, Gauge, Settings, Store, Zap } from "lucide-react";

const tabs = [
  { id: "dashboard", label: "Gösterge Paneli", icon: Gauge, bg: "bg-sunlit" },
  {
    id: "power_center",
    label: "Güç Merkezi",
    icon: Zap,
    bg: "bg-breeze-deep",
    iconFill: true,
  },
  { id: "storage_area", label: "Depolama Alanı", icon: BatteryCharging, bg: "bg-sprout" },
  { id: "market", label: "Mağaza", icon: Store, bg: "bg-sprout" },
  { id: "research", label: "Araştırma", icon: FlaskConical, bg: "bg-blossom" },
  { id: "settings", label: "Ayarlar", icon: Settings, bg: "bg-sunlit-deep" },
];

function TabBar({ activeScreen = "dashboard", onChange }) {
  return (
    <nav className="shrink-0 border-t-4 border-slate-900 bg-background p-3">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeScreen === tab.id;
          const isDisabled = tab.disabled;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => !isDisabled && onChange(tab.id)}
              className={`shrink-0 flex items-center justify-center gap-2 rounded-2xl border-4 border-slate-900 ${tab.bg} px-4 py-2.5 font-black text-shade shadow-[4px_4px_0px_0px_var(--shade)] whitespace-nowrap transition-colors ${
                isDisabled
                  ? "cursor-not-allowed opacity-75"
                  : "cursor-pointer hover:brightness-95"
              } ${isActive ? "ring-2 ring-slate-900 ring-offset-1" : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                className="w-5 h-5 text-current"
                fill={tab.iconFill ? "currentColor" : "none"}
                strokeWidth={tab.iconFill ? 0 : 2.25}
              />
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default TabBar;
