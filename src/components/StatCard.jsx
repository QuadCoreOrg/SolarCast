import Card from './Card';

const colorClasses = {
  yellow: 'bg-sunny-yellow',
  mint: 'bg-mint-green',
  peach: 'bg-soft-peach',
  blue: 'bg-blue-400',
  white: 'bg-white',
};

function StatCard({ icon: Icon, label, value, color = 'yellow', className = '' }) {
  return (
    <Card variant="dashboard" className={`p-3 ${className}`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${colorClasses[color] || colorClasses.yellow} border-2 border-slate-900`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
        <div>
          <div className="font-bold text-sm text-slate-600">{label}</div>
          <div className="font-black text-xl">{value}</div>
        </div>
      </div>
    </Card>
  );
}

export default StatCard;