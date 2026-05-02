import Card from './Card';
import Button from './Button';

function InventoryItem({ icon: Icon, name, detail, price, onBuy, disabled = false }) {
  return (
    <Card variant="dashboard" className="p-4">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-sunny-yellow border-4 border-slate-900 rounded-2xl flex items-center justify-center">
          {Icon && <Icon className="w-6 h-6" />}
        </div>
        <div className="flex-1">
          <div className="font-bold text-lg">{name}</div>
          <div className="font-bold text-sm text-slate-600">{detail}</div>
        </div>
        <Button 
          variant="primary" 
          onClick={onBuy} 
          disabled={disabled}
          className="text-sm py-2 px-4"
        >
          {price} 🪙
        </Button>
      </div>
    </Card>
  );
}

export default InventoryItem;