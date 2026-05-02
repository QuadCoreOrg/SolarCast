import { motion } from 'framer-motion';

const containerClasses = 'w-full h-8 bg-slate-100 border-4 border-slate-900 rounded-full overflow-hidden';

const colorClasses = {
  mint: 'bg-mint-green',
  yellow: 'bg-sunny-yellow',
  peach: 'bg-soft-peach',
  blue: 'bg-blue-400',
};

function ProgressBar({ value = 0, max = 100, color = 'mint', showLabel = false, className = '' }) {
  const percentage = Math.min((value / max) * 100, 100);
  const fillColor = colorClasses[color] || colorClasses.mint;

  return (
    <div className={`${className}`}>
      {showLabel && (
        <div className="flex justify-between mb-2">
          <span className="font-bold text-sm">{value}</span>
          <span className="font-bold text-sm">{max}</span>
        </div>
      )}
      <div className={containerClasses}>
        <motion.div
          className={`h-full ${fillColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: 'spring', stiffness: 200 }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;