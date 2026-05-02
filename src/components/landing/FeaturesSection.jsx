import { CloudSun, TrendingUp } from "lucide-react";
import Badge from "../Badge";
import Card from "../Card";

function FeaturesSection() {
  return (
    <section id="features" className="py-16 px-4 bg-sunlit">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <Badge color="bg-background">İÇERİDE NELER VAR?</Badge>
          <h2 className="text-4xl font-black mt-4">
            Gerçek Veriler, Gerçekçi Ekonomi.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card variant="dashboard">
            <Badge color="bg-breeze-deep">CANLI VERİ</Badge>
            <h3 className="font-black text-xl mt-3 mb-2 flex items-center gap-2">
              <CloudSun className="w-6 h-6" /> Open-Meteo Entegrasyonu
            </h3>
            <p className="font-bold text-shade-soft mb-4">
              Hava bulutluysa üretimin düşer. Gerçek dünyadaki hava durumu,
              oyun içi stratejini doğrudan etkiler.
            </p>
            <ul className="font-bold text-sm text-shade-2 space-y-1">
              <li>✔ Anlık bulut kapalılığı</li>
              <li>✔ Güneş radyasyonu katsayısı</li>
            </ul>
          </Card>

          <Card variant="dashboard">
            <Badge color="bg-sprout-deep">TİCARET</Badge>
            <h3 className="font-black text-xl mt-3 mb-2 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" /> Dinamik Enerji Piyasası
            </h3>
            <p className="font-bold text-shade-soft mb-4">
              Elektrik fiyatları günün saatine göre değişir (EPİAŞ
              simülasyonu). Enerjini ne zaman satacağına sen karar ver.
            </p>
            <ul className="font-bold text-sm text-shade-2 space-y-1">
              <li>✔ Saatlik fiyat dalgalanmaları</li>
              <li>✔ Batarya kapasite yönetimi</li>
            </ul>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
