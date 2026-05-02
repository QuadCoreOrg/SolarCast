import { motion } from "framer-motion";
import { AlertTriangle, Sparkles } from "lucide-react";

const problems = [
  "Güneşlenme saatleri takip etmek sıkıcı ve zordur.",
  "Batarya kapasitesi hesabı karmaşıktır.",
  "EPİAŞ anlık fiyatları anlamak uzmanlık ister.",
];

const solutions = [
  "Konumunu seç, gerçek güneş verisi otomatik gelsin.",
  "Bataryanı görsel olarak yönet, ne zaman dolacağını bil.",
  "Piyasa fiyatları yükselince oyun seni uyarır — sat!",
];

function ProblemSolutionSection() {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-0 border-4 border-slate-900 rounded-3xl overflow-hidden shadow-[8px_8px_0px_0px_#2A2A33]">
          {/* Problem side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-blossom p-8 md:p-10 border-b-4 md:border-b-0 md:border-r-4 border-slate-900"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blossom-deep border-4 border-slate-900 rounded-full flex items-center justify-center">
                <AlertTriangle size={18} className="text-shade" />
              </div>
              <span className="font-black text-sm tracking-widest uppercase text-blossom-deep">
                Problem
              </span>
            </div>

            <h3 className="font-black text-2xl md:text-3xl mb-6 text-shade leading-tight">
              Yenilenebilir enerji
              <br />
              karmaşıktır.
            </h3>

            <ul className="space-y-4">
              {problems.map((p, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 mt-0.5 bg-blossom-deep border-2 border-slate-900 rounded-full flex items-center justify-center font-black text-xs text-white flex-shrink-0">
                    ✕
                  </span>
                  <span className="font-bold text-shade-soft">{p}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Solution side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-sprout p-8 md:p-10"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-sprout-deep border-4 border-slate-900 rounded-full flex items-center justify-center">
                <Sparkles size={18} className="text-shade" />
              </div>
              <span className="font-black text-sm tracking-widest uppercase text-sprout-deep">
                Çözüm
              </span>
            </div>

            <h3 className="font-black text-2xl md:text-3xl mb-6 text-shade leading-tight">
              Her şey
              <br />
              oyunlaştırıldı.
            </h3>

            <ul className="space-y-4">
              {solutions.map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 mt-0.5 bg-sprout-deep border-2 border-slate-900 rounded-full flex items-center justify-center font-black text-xs text-white flex-shrink-0">
                    ✓
                  </span>
                  <span className="font-bold text-shade-soft">{s}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default ProblemSolutionSection;
