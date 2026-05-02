import Card from './Card';
import ProgressBar from './ProgressBar';
import Badge from './Badge';

function GoalCard({ title, current, goal, reward, rewardType = 'XP' }) {
  const isCompleted = current >= goal;

  return (
    <Card variant="accent">
      <div className="flex justify-between items-center mb-3">
        <span className="font-bold text-lg">{title}</span>
        <Badge color={isCompleted ? 'bg-sprout-deep' : 'bg-sunlit-deep'}>
          {isCompleted ? '✓' : `+${reward} ${rewardType}`}
        </Badge>
      </div>
      <ProgressBar value={current} max={goal} color={isCompleted ? 'mint' : 'yellow'} showLabel />
    </Card>
  );
}

export default GoalCard;
