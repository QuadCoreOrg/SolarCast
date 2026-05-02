import { motion } from "framer-motion";
import { Trophy, Zap } from "lucide-react";
import Badge from "../Badge";
import Button from "../Button";

function HeroSection({ onPlayClick }) {
  return (
    <section className="py-16 px-4 bg-blossom">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="inline-block mb-4"
        >
          <Badge color="bg-sunlit-deep" className="flex items-center gap-2">
            <Trophy width={20} height={20} /> Hackathon Projesi • Gerçek
            Zamanlı API
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-center gap-4 mb-8"
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(60px, 16vw, 140px)",
            lineHeight: 1,
            letterSpacing: "-0.04em",
          }}
        >
          <span
            style={{
              color: "#FFFFFF",
              WebkitTextStroke: "4px #2A2A33",
              paintOrder: "stroke fill",
              textShadow: "0 8px 0 #2A2A33",
            }}
          >
            solar<span className="text-blossom-deep">cast</span>
          </span>
          <span
            className="text-sunlit-deep"
            style={{ display: "inline-flex" }}
            aria-hidden="true"
          >
            <Zap size={60} className="md:scale-125" />
          </span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-xl md:text-2xl font-bold text-shade-soft mb-8 max-w-2xl mx-auto"
        >
          Güneş enerjisini yönetmeyi ve satmayı öğreten, gerçek verilere
          dayalı en eğlenceli simülasyon.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button variant="primary" onClick={onPlayClick}>
            Oyuna Başla →
          </Button>
          <button
            onClick={() =>
              document
                .getElementById("howto")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="border-4 border-slate-900 rounded-full font-bold px-6 py-3 bg-white/50 backdrop-blur-sm shadow-[4px_4px_0px_0px_#2A2A33] hover:bg-white/70 transition-colors cursor-pointer text-shade flex items-center justify-center gap-2"
          >
            Nasıl Çalışır?
          </button>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
