import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import Badge from "../Badge";
import Card from "../Card";

const steps = [
  {
    number: 1,
    color: "bg-sprout-deep",
    title: "🗺️ Şehrini Seç",
    description:
      "Türkiye haritasından şehrini seç. Open-Meteo ile gerçek güneş verilerini çekiyoruz.",
    variant: "dashboard",
  },
  {
    number: 2,
    color: "bg-sunlit-deep",
    title: "☀️ Panelleri Kur",
    description:
      "Başlangıç bütçenle ilk panellerini satın al ve enerji üretmeye başla.",
    variant: "dashboard",
  },
  {
    number: 3,
    color: "bg-background",
    title: "🔋 Depola ve Sat",
    description:
      "Enerjiyi bataryanda biriktir. EPİAŞ verileriyle fiyatlar yükseldiğinde şebekeye sat!",
    variant: "dashboard",
  },
  {
    number: 4,
    color: "bg-breeze-deep",
    title: "📈 Sistemini Büyüt",
    description:
      "Kazandığın paralarla yeni nesil paneller al, bataryanı geliştir, seviye atla.",
    variant: "accent",
  },
];

function HowItWorksSection() {
  return (
    <section id="howto" className="py-16 px-4 bg-breeze">
      <div className="max-w-2xl mx-auto text-center">
        <Badge color="bg-sprout-deep">NASIL ÇALIŞIR?</Badge>
        <h2 className="text-4xl font-black mt-4 mb-10">
          Dört adım, tek imparatorluk.
        </h2>

        <div className="flex flex-col items-center gap-3">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="flex flex-col items-center gap-3 w-full"
            >
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="w-full"
              >
                <Card
                  variant={step.variant}
                  className={
                    step.variant === "accent"
                      ? "text-left border-4 border-shade"
                      : "text-left w-full"
                  }
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 ${step.color} border-4 border-shade rounded-full flex items-center justify-center font-black flex-shrink-0`}
                    >
                      {step.number}
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-lg">{step.title}</div>
                      <div className="text-sm text-shade-soft">
                        {step.description}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
              {i < steps.length - 1 && (
                <ArrowDown
                  className="w-8 h-8 text-shade flex-shrink-0"
                  aria-hidden
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
