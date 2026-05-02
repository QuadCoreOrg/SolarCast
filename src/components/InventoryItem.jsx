import Card from './Card';
import Button from './Button';

function InventoryItem({ icon: Icon, name, detail, price, onBuy, disabled = false }) {
  return (
    <Card variant="dashboard" className="p-4">
      <div className="flex items-center gap-4">
        <div className="shrink-0 w-12 h-12 bg-sunlit-deep border-4 border-shade rounded-2xl flex items-center justify-center text-shade">
          {Icon && <Icon className="w-6 h-6" />}
        </div>
        <div className="flex-1">
          <div className="font-bold text-lg text-shade">{name}</div>
          <div className="font-bold text-sm text-shade-soft">{detail}</div>
        </div>
        <Button variant="primary" onClick={onBuy} disabled={disabled} className="text-sm py-2 px-4">
          {price} 🪙
        </Button>
      </div>
    </Card>
  );
}

export default InventoryItem;
