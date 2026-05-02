import ProgressBar from './ProgressBar';

function EnergyBar({ current, max, className = '' }) {
  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-lg">⚡ Energy</span>
        <span className="font-black text-xl">{current} / {max} ⚡</span>
      </div>
      <ProgressBar value={current} max={max} color="mint" />
    </div>
  );
}

export default EnergyBar;