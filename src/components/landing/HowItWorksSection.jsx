import { motion } from "framer-motion";
import { ArrowRight, ArrowDown, Sun } from "lucide-react";
import Badge from "../Badge";
import Card from "../Card";

const steps = [
  {
    number: 1,
    color: "bg-sprout-deep",
    title: "🗺️ Şehrini Seç",
    description:
      "Türkiye haritasından şehrini seç. Open-Meteo ile gerçek güneş verilerini çekiyoruz.",
  },
  {
    number: 2,
    color: "bg-sunlit-deep",
    title: "☀️ Panelleri Kur",
    description:
      "Başlangıç bütçenle ilk panellerini satın al ve enerji üretmeye başla.",
  },
  {
    number: 3,
    color: "bg-background",
    title: "🔋 Depola ve Sat",
    description:
      "Enerjiyi bataryanda biriktir. EPİAŞ verileriyle fiyatlar yükseldiğinde şebekeye sat!",
  },
];

function HowItWorksSection() {
  return (
    <section id="howto" className="py-16 px-4 bg-breeze">
      <div className="max-w-4xl mx-auto text-center">
        <Badge color="bg-sprout-deep">NASIL ÇALIŞIR?</Badge>
        <h2 className="text-4xl font-black mt-4 mb-10">
          Dört adım, tek imparatorluk.
        </h2>

        <div className="space-y-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col md:flex-row items-center gap-4"
            >
              <Card variant="dashboard" className="flex-1 text-left w-full">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 ${step.color} border-4 border-shade rounded-full flex items-center justify-center font-black flex-shrink-0`}
                  >
                    {step.number}
                  </div>
                  <div>
                    <div className="font-bold text-lg">{step.title}</div>
                    <div className="text-sm text-shade-soft">
                      {step.description}
                    </div>
                  </div>
                </div>
              </Card>
              {/* Down on mobile, right on desktop */}
              <ArrowDown className="w-8 h-8 text-shade md:hidden" />
              <ArrowRight className="w-8 h-8 text-shade hidden md:block" />
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Card
              variant="accent"
              className="text-left border-4 border-shade"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-breeze-deep border-4 border-shade rounded-full flex items-center justify-center font-black flex-shrink-0">
                  4
                </div>
                <div>
                  <div className="font-bold text-lg">📈 Sistemini Büyüt</div>
                  <div className="text-sm text-shade-soft">
                    Kazandığın paralarla yeni nesil paneller al, bataryanı
                    geliştir, seviye atla.
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
