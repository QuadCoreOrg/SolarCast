import { Sun } from "lucide-react";
import logo from "../../assets/solarcast-logo.png";

function Header({ onPlayClick }) {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="bg-background border-b-4 border-slate-900 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={logo} alt="SolarCast" className="w-8 h-8 object-contain" />
          <span className="font-black text-2xl">
            <span className="text-sunlit-deep">solar</span>
            <span className="text-shade">cast</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={() => scrollTo("howto")}
            className="font-bold hover:text-breeze-deep transition-colors bg-transparent border-0 cursor-pointer"
          >
            Nasıl Oynanır?
          </button>
          <button
            onClick={() => scrollTo("features")}
            className="font-bold hover:text-breeze-deep transition-colors bg-transparent border-0 cursor-pointer"
          >
            Özellikler
          </button>
          <button
            onClick={() => scrollTo("contact")}
            className="font-bold hover:text-breeze-deep transition-colors bg-transparent border-0 cursor-pointer"
          >
            İletişim
          </button>
        </nav>

        <button
          onClick={onPlayClick}
          className="border-4 border-slate-900 rounded-full font-bold px-6 py-2 bg-sunlit shadow-[4px_4px_0px_0px_#2A2A33] hover:bg-sunlit-deep transition-colors cursor-pointer text-shade"
        >
          Oyuna Başla →
        </button>
      </div>
    </header>
  );
}

export default Header;
