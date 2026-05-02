import { motion } from 'framer-motion';
import { LayoutDashboard, ShoppingCart, Settings } from 'lucide-react';

const tabs = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'market', label: 'Shop', icon: ShoppingCart },
  { id: 'settings', label: 'Settings', icon: Settings },
];

function TabBar({ activeTab = 'dashboard', onChange }) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <motion.div
        className="bg-background border-4 border-shade rounded-full shadow-[8px_8px_0px_0px_var(--shade)] p-2 flex gap-2"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <motion.button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                flex items-center justify-center gap-2
                border-4 border-shade rounded-full
                ${isActive ? 'bg-sunlit-deep' : 'bg-background'}
              `}
              style={{
                width: isActive ? 120 : 52,
                height: 52,
              }}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? '' : 'text-shade-soft'}`} />
              {isActive && (
                <span className="font-bold text-sm whitespace-nowrap">{tab.label}</span>
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}

export default TabBar;
