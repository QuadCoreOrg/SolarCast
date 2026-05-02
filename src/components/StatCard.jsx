import Card from './Card';

const colorClasses = {
  yellow: 'bg-sunlit-deep',
  mint: 'bg-sprout-deep',
  peach: 'bg-breeze-deep',
  blue: 'bg-breeze-deep',
  white: 'bg-background',
};

function StatCard({ icon: Icon, label, value, color = 'yellow', className = '' }) {
  return (
    <Card variant="dashboard" className={`p-3 ${className}`}>
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-full ${colorClasses[color] || colorClasses.yellow} border-4 border-shade`}
        >
          {Icon && <Icon className="w-5 h-5" />}
        </div>
        <div>
          <div className="font-bold text-sm text-shade-soft">{label}</div>
          <div className="font-black text-xl text-shade">{value}</div>
        </div>
      </div>
    </Card>
  );
}

export default StatCard;
