import React, { useState } from "react";
import { motion } from "framer-motion";
import Button from "./components/Button";
import Card from "./components/Card";
import Badge from "./components/Badge";
import {
  ArrowDown,
  Play,
  Mail,
  Cloud,
  Sun,
  Star,
  Zap,
  Trophy,
  CloudSun,
  TrendingUp,
  Link,
  Code,
  MessageCircle
} from "lucide-react";

function App() {
  const [showGame, setShowGame] = useState(false);

  if (showGame) {
    return <GameView />;
  }

  return (
    <div className="min-h-screen bg-background font-['Nunito'] text-shade">
      {/* Header */}
      <header className="bg-background border-b-4 border-slate-900 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sun width={32} height={32} className="text-sunlit-deep" />
            <span className="font-black text-2xl text-shade">solarcast</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#howto" className="font-bold hover:text-breeze-deep transition-colors">
              Nasıl Oynanır?
            </a>
            <a href="#features" className="font-bold hover:text-breeze-deep transition-colors">
              Özellikler
            </a>
            <a href="#contact" className="font-bold hover:text-breeze-deep transition-colors">
              İletişim
            </a>
          </nav>
          <Button variant="primary" onClick={() => setShowGame(true)}>
            Oyuna Başla →
          </Button>
        </div>
      </header>

      {/* Hero Section */}
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

          {/* Hero Title with brand styling */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="hero-title flex items-center justify-center gap-4 mb-8"
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(60px, 16vw, 140px)",
              lineHeight: 1,
              letterSpacing: "-0.04em",
            }}
          >
            <span
              className="brand"
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
              className="brand-cross text-sunlit-deep"
              style={{ display: "inline-flex" }}
              aria-hidden="true"
            >
              <Zap
                size={60}
                className="md:scale-125"
              />
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
            <Button
              variant="accent"
              onClick={() =>
                document
                  .getElementById("demo")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="flex items-center gap-2"
            >
              <Play /> Oyunu İncele
            </Button>
            <Button variant="secondary" onClick={() => setShowGame(true)}>
              Oyuna Başla →
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <Card variant="dashboard">
              <Badge color="bg-blossom-deep">PROBLEM</Badge>
              <h3 className="font-black text-xl mt-3 mb-2">
                Yenilenebilir enerji karmaşıktır.
              </h3>
              <p className="font-bold text-shade-soft">
                Güneşlenme süreleri, batarya kapasiteleri ve anlık elektrik
                piyasası (EPİAŞ) fiyatlarını takip etmek sıkıcı ve zordur.
              </p>
            </Card>
            <Card variant="accent">
              <Badge color="bg-sprout-deep">ÇÖZÜM</Badge>
              <h3 className="font-black text-xl mt-3 mb-2">
                Her şey oyunlaştırıldı.
              </h3>
              <p className="font-bold text-shade-soft">
                Konumunu seç, hava durumuna göre enerjini üret ve piyasa
                fiyatları yükseldiğinde satarak güneş imparatorluğunu kur.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-16 px-4 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <Badge color="bg-sunlit-deep">DEMO - 3 DK</Badge>
          <h2 className="text-4xl font-black mt-4 mb-6">
            Güneş çiftliğin çalışırken gör.
          </h2>
          <p className="font-bold text-shade-soft mb-8 max-w-xl mx-auto">
            Panellerini kurduğunda, havanın bulutlanmasının üretimi nasıl
            etkilediğini ve bataryanın ne kadar hızlı dolduğunu izle.
          </p>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative bg-breeze border-4 border-slate-900 rounded-3xl p-8 shadow-[8px_8px_0px_0px_#2A2A33] cursor-pointer"
            onClick={() => setShowGame(true)}
          >
            <div className="aspect-video bg-background rounded-2xl border-4 border-slate-900 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center gap-4">
                <Sun width={60} height={60} className="text-sunlit-deep" />
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        delay: i * 0.1,
                      }}
                      className="w-12 h-16 bg-sunlit-deep border-4 border-slate-900 rounded-t-lg"
                    />
                  ))}
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute w-20 h-20 bg-sunlit-deep border-4 border-slate-900 rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_#2A2A33]"
              >
                <Play className="w-8 h-8 ml-1" />
              </motion.button>
            </div>
          </motion.div>

          <Button variant="accent" className="mt-6">
            Simülasyonu Aç →
          </Button>
        </div>
      </section>

      {/* How to Play Section */}
      <section id="howto" className="py-16 px-4 bg-breeze">
        <div className="max-w-4xl mx-auto text-center">
          <Badge color="bg-sprout-deep">NASIL ÇALIŞIR?</Badge>
          <h2 className="text-4xl font-black mt-4 mb-10">
            Dört adım, tek imparatorluk.
          </h2>

          <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <Card variant="dashboard" className="flex-1 text-left">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-sprout-deep border-4 border-slate-900 rounded-full flex items-center justify-center font-black">
                    1
                  </div>
                  <div>
                    <div className="font-bold text-lg">🗺️ Şehrini Seç</div>
                    <div className="text-sm text-shade-soft">
                      Türkiye haritasından şehrini seç. Open-Meteo ile gerçek
                      güneş verilerini çekiyoruz.
                    </div>
                  </div>
                </div>
              </Card>
              <ArrowDown className="w-8 h-8 text-shade rotate-0 md:rotate-90" />
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4">
              <Card variant="dashboard" className="flex-1 text-left">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-sunlit-deep border-4 border-slate-900 rounded-full flex items-center justify-center font-black">
                    2
                  </div>
                  <div>
                    <div className="font-bold text-lg flex items-center gap-2">
                      <Sun width={20} height={20} /> Panelleri Kur
                    </div>
                    <div className="text-sm text-shade-soft">
                      Başlangıç bütçenle ilk panellerini satın al ve enerji
                      üretmeye başla.
                    </div>
                  </div>
                </div>
              </Card>
              <ArrowDown className="w-8 h-8 text-shade rotate-0 md:rotate-90" />
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4">
              <Card variant="dashboard" className="flex-1 text-left">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-background border-4 border-slate-900 rounded-full flex items-center justify-center font-black">
                    3
                  </div>
                  <div>
                    <div className="font-bold text-lg">🔋 Depola ve Sat</div>
                    <div className="text-sm text-shade-soft">
                      Enerjiyi bataryanda biriktir. EPİAŞ verileriyle fiyatlar
                      yükseldiğinde şebekeye sat!
                    </div>
                  </div>
                </div>
              </Card>
              <ArrowDown className="w-8 h-8 text-shade rotate-0 md:rotate-90" />
            </div>

            <Card
              variant="accent"
              className="flex-1 text-left border-4 border-slate-900"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-breeze-deep border-4 border-slate-900 rounded-full flex items-center justify-center font-black">
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
          </div>
        </div>
      </section>

      {/* Features Section */}
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

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4 bg-breeze">
        <div className="max-w-4xl mx-auto text-center">
          <Badge color="bg-sunlit-deep">İLETİŞİM</Badge>
          <h2 className="text-4xl font-black mt-4 mb-6">
            Geliştiricilerle tanışın.
          </h2>
          <p className="font-bold text-shade-soft mb-8">
            Bu proje 8 saatlik bir hackathon kapsamında Vibe Coding ile
            geliştirilmiştir.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Mail, label: "E-Posta", color: "bg-sunlit-deep text-shade" },
              { icon: Code, label: "GitHub", color: "bg-background text-shade" },
              { icon: Link, label: "LinkedIn", color: "bg-breeze-deep text-shade" },
              {
                icon: MessageCircle,
                label: "X / Twitter",
                color: "bg-blossom text-shade",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className={`${item.color} border-4 border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0px_0px_#2A2A33] cursor-pointer`}
              >
                <item.icon className="w-8 h-8 mx-auto mb-2" />
                <span className="font-bold text-sm">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
              onClick={() => setShowGame(true)}
            >
              Oyuna Başla →
            </Button>
            <Button
              variant="secondary"
              className="text-lg px-8 py-4 flex items-center gap-2"
            >
              <Star width={20} height={20} /> GitHub'da Yıldız Ver
            </Button>
          </div>
        </div>
      </section>

      {/* Bottom Footer */}
      <footer className="bg-border/40 border-t-4 border-slate-900 text-shade-2 py-6 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap width={28} height={28} className="text-sunlit-deep" />
            <span className="font-black text-xl text-shade">SolarCast</span>
          </div>
          <div className="font-bold text-sm text-shade-soft">
            © 2026 SolarCast Ekibi
          </div>
        </div>
      </footer>
    </div>
  );
}

function GameView() {
  return (
    <div className="min-h-screen bg-background font-['Nunito'] text-shade flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-black mb-4">🚀 Oyun Alanı</h1>
        <p className="font-bold text-shade-soft mb-6">
          Yakında burada oyun olacak!
        </p>
        <Button variant="primary" onClick={() => window.location.reload()}>
          ← Landing Page'e Dön
        </Button>
      </div>
    </div>
  );
}

export default App;
