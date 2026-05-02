import { Star, Zap } from "lucide-react";
import Badge from "../Badge";
import Button from "../Button";
import { GITHUB_REPO } from "../../constants/links";

function FooterSection({ onPlayClick }) {
  return (
    <>
      {/* Footer CTA */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-2xl mx-auto text-center">
          <Badge color="bg-sprout-deep">HAZIR MISIN?</Badge>
          <h2 className="text-4xl font-black mt-4 mb-6">
            Güneş tarlana adım at.
          </h2>
          <p className="font-bold text-shade-soft mb-8">
            Kayıt yok. Sadece şehrini seç ve ilk panelini kur.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              className="text-lg px-8 py-4"
              onClick={onPlayClick}
            >
              Oyuna Başla →
            </Button>
            <a
              href={GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="border-4 border-shade rounded-full font-bold text-lg px-8 py-4 bg-background shadow-[4px_4px_0px_0px_var(--shade)] hover:bg-border transition-colors flex items-center justify-center gap-2 text-shade"
            >
              <Star className="w-5 h-5" /> GitHub'da Yıldız Ver
            </a>
          </div>
        </div>
      </section>

      {/* Bottom Footer */}
      <footer className="bg-border/40 border-t-4 border-shade text-shade-2 py-6 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap width={28} height={28} className="text-sunlit-deep" />
            <span className="font-black text-xl text-shade">SolarCast</span>
          </div>
          <div className="font-bold text-sm text-shade-soft">
            © 2026 SolarCast Ekibi — Kode X Hackathon
          </div>
        </div>
      </footer>
    </>
  );
}

export default FooterSection;
