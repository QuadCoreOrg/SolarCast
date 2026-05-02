import { motion } from 'framer-motion';

const containerClasses =
  'w-full h-8 bg-border border-4 border-shade rounded-full overflow-hidden';

const colorClasses = {
  mint: 'bg-sprout-deep',
  eco: 'bg-sprout-deep',
  yellow: 'bg-sunlit-deep',
  solar: 'bg-sunlit-deep',
  peach: 'bg-blossom-deep',
  sky: 'bg-breeze-deep',
  blue: 'bg-breeze-deep',
};

function ProgressBar({ value = 0, max = 100, color = 'mint', showLabel = false, className = '' }) {
  const percentage = Math.min((value / max) * 100, 100);
  const fillColor = colorClasses[color] || colorClasses.mint;

  return (
    <div className={`${className}`}>
      {showLabel && (
        <div className="flex justify-between mb-2">
          <span className="font-bold text-sm text-shade-2">{value}</span>
          <span className="font-bold text-sm text-shade-2">{max}</span>
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
