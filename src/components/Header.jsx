import { Coins, Star } from 'lucide-react';

function Header({ logo = '☀️ SolarCast', coins = 0, level = 1 }) {
  return (
    <div className="sticky top-0 z-40 bg-pure-white border-b-4 border-slate-900">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        <div className="font-black text-2xl">{logo}</div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-sunny-yellow border-4 border-slate-900 rounded-full px-3 py-1 shadow-[2px_2px_0px_0px_#0f172a]">
            <Coins className="w-4 h-4" />
            <span className="font-black text-sm">{coins}</span>
          </div>
          <div className="flex items-center gap-2 bg-mint-green border-4 border-slate-900 rounded-full px-3 py-1 shadow-[2px_2px_0px_0px_#0f172a]">
            <Star className="w-4 h-4" />
            <span className="font-black text-sm">Lv.{level}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;