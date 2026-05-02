import {
  BatteryCharging,
  BrushCleaning,
  FlaskConical,
  Gauge,
  Settings,
  Zap,
} from "lucide-react";
import useGameStore from "../store/useGameStore";
import { BATTERY_DEF_BY_TYPE_ID, PANEL_DEF_BY_TYPE_ID } from "../constants/gameData";

const tabs = [
  { id: "dashboard", label: "Gösterge Paneli", icon: Gauge, bg: "bg-sunlit" },
  {
    id: "power_center",
    label: "Güç Merkezi",
    icon: Zap,
    bg: "bg-breeze-deep",
    iconFill: true,
    badgeDirtyPanels: true,
  },
  {
    id: "storage_area",
    label: "Depolama Alanı",
    icon: BatteryCharging,
    bg: "bg-sprout",
    badgeStorageFull: true,
  },
  // Mağaza (market) sekmesi şimdilik gizli — tekrar açmak için satırı listeye ekleyin + Store importunu geri ekleyin.
  // { id: "market", label: "Mağaza", icon: Store, bg: "bg-sprout" },
  { id: "research", label: "Araştırma", icon: FlaskConical, bg: "bg-blossom" },
  { id: "settings", label: "Ayarlar", icon: Settings, bg: "bg-sunlit-deep" },
];

function TabBar({ activeScreen = "dashboard", onChange }) {
  const needsDirtyPanelAttention = useGameStore((s) =>
    s.activePanels.some((panel) => {
      const def = PANEL_DEF_BY_TYPE_ID[panel.type];
      const limit = def?.dirtyDaysLimit ?? 0;
      return limit > 0 && (panel.daysSinceCleaned ?? 0) >= limit;
    }),
  );

  const batteryStorageFull = useGameStore((s) => {
    const total = (s.activeBatteries ?? []).reduce((acc, batt) => {
      const cap = BATTERY_DEF_BY_TYPE_ID[batt.type]?.capacity ?? 0;
      return acc + cap;
    }, 0);
    if (total <= 0) return false;
    return (s.currentEnergy ?? 0) >= total;
  });

  const dirtyPanelsLabel = needsDirtyPanelAttention
    ? "Temizlenmesi gereken panel var"
    : undefined;
  const storageFullLabel = batteryStorageFull ? "Depolama dolu (%100)" : undefined;

  return (
    <nav className="shrink-0 border-t-4 border-slate-900 bg-background p-3">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeScreen === tab.id;
          const isDisabled = tab.disabled;

          const showDirtyBadge =
            tab.badgeDirtyPanels && needsDirtyPanelAttention;
          const showStorageBadge =
            tab.badgeStorageFull && batteryStorageFull;

          const caution =
            tab.id === "power_center"
              ? dirtyPanelsLabel
              : tab.id === "storage_area"
                ? storageFullLabel
                : undefined;
          const tabTitleAndHint =
            caution != null ? `${tab.label} — ${caution}` : tab.label;

          return (
            <div key={tab.id} className="relative shrink-0">
              <button
                type="button"
                onClick={() => !isDisabled && onChange(tab.id)}
                title={tabTitleAndHint}
                aria-label={caution != null ? `${tab.label}. ${caution}` : undefined}
                className={`shrink-0 flex items-center justify-center gap-2 rounded-2xl border-4 border-slate-900 ${tab.bg} px-4 py-2.5 font-black text-shade shadow-[4px_4px_0px_0px_var(--shade)] whitespace-nowrap transition-colors ${
                  isDisabled
                    ? "cursor-not-allowed opacity-75"
                    : "cursor-pointer hover:brightness-95 active:translate-y-1 active:shadow-none"
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

              {showDirtyBadge && (
                <span
                  className="pointer-events-none absolute -right-1 -top-1 z-[1] flex h-7 w-7 items-center justify-center rounded-full border-[3px] border-slate-900 bg-amber-400 shadow-[2px_2px_0px_0px_var(--shade)]"
                  aria-hidden
                >
                  <BrushCleaning className="h-[14px] w-[14px] text-slate-900" strokeWidth={2.5} />
                </span>
              )}

              {showStorageBadge && (
                <span
                  className="pointer-events-none absolute -right-1 -top-1 z-[1] flex items-center gap-px rounded-full border-[3px] border-rose-800 bg-rose-600 px-1 py-1 text-[10px] font-black leading-none text-white shadow-[2px_2px_0px_0px_var(--shade)] min-w-[26px] justify-center"
                  aria-hidden
                >
                  <BatteryCharging className="h-3 w-3 text-white" strokeWidth={2.5} />
                </span>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}

export default TabBar;
