import logo from '../assets/solarcast-logo.png'

function Header({ coins, level }) {
  return (
    <div className="sticky top-0 z-40 bg-background border-b-4 border-shade">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src={logo} alt="SolarCast" className="w-8 h-8 object-contain" />
          <span className="font-black text-2xl leading-none">
            <span className="text-sunlit-deep">solar</span>
            <span className="text-shade">cast</span>
          </span>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 bg-sunlit-deep border-4 border-shade rounded-full px-3 py-1 shadow-[2px_2px_0px_0px_var(--shade)]">
            <span>🪙</span>
            <span className="font-black text-sm">{coins}</span>
          </div>
          <div className="flex items-center gap-2 bg-sprout-deep border-4 border-shade rounded-full px-3 py-1 shadow-[2px_2px_0px_0px_var(--shade)]">
            <span>⭐</span>
            <span className="font-black text-sm">Lv.{level}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
