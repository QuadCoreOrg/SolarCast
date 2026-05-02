# SolarCast - Design System & UI Guidelines

React (Vite) + Tailwind CSS v4 + Framer Motion. **Renk tek kaynak:** `src/index.css` içindeki `@theme` blokları ile aşağıdaki token’lar birebir aynıdır.

## Tipografi

- `Nunito`, başlıklar ve sayılar için `font-black` / `font-bold`.

## Cartoon / neo-brutalist çerçeve

- Konteynerler: **`border-4 border-slate-900`** (kalın koyu çerçeve; eski comic stil).
- Metin ana rengi: **`text-shade`** (`#2A2A33`). İkinci kademe: `text-shade-2`, hafif: `text-shade-soft`.
- Sert görünümlü gölge (`ink` ile hizalı): **`shadow-[4px_4px_0px_0px_#2A2A33]`** vb. İnce ayar kullanıcı paletindeki **`--shade`** ile aynıdır.

## Resmi palet (CSS ile birebir)

```css
/* 🌸 Pink */
--color-blossom: #FFD3E2;
--color-blossom-deep: #FF8FB3;

/* 🌿 Green */
--color-sprout: #C8F3CC;
--color-sprout-deep: #6AD47A;

/* 🌊 Blue */
--color-breeze: #CDEAFF;
--color-breeze-deep: #6BBFF2;

/* 🌕 Yellow */
--color-sunlit: #FFEF9E;
--color-sunlit-deep: #F6C944;

/* 🪵 Neutral / Ink */
--color-shade: #2A2A33;
--color-shade-2: #555566;
--color-shade-soft: #8A8A99;

/* 📄 Paper / Background */
--color-background: #FFFDF7;
--color-border: #E4E2DA;
```

Tailwind kullanımları: `bg-blossom`, `text-shade`, **`border-slate-900`** (UI çerçevesi), `bg-border` (pasif track / nötr dolgu için palet `border` rengi), `bg-sunlit-deep`, …

## Semantik kılavuzu

| Amaç | Örnek token |
|------|-------------|
| Sayfa zemini | `bg-background` |
| Pembe blok / hero | `bg-blossom` |
| Pembe güçlü vurgu, “cast”, problem rozeti | `bg-blossom-deep`, `text-blossom-deep` |
| Güneş / ana CTA butonları | `bg-sunlit-deep`, bant yüzeyi `bg-sunlit` |
| Eko / ikincil buton / başarı | `bg-sprout-deep`, hafif alan `bg-sprout` |
| Gökyüzü bölüm / mavi blok | `bg-breeze`, vurgulu `bg-breeze-deep` |
| Kart içi yüzey (kontrast için) | `bg-white` (beyaz) — `Card` bileşeni |
| Nötre yakın yüzey / footer iyileştirme | `bg-border` + opacity veya düz `bg-background` |

## Bileşen özetleri

- **Primary button:** `bg-sunlit-deep` + `border-slate-900` + sert gölge + `text-shade`
- **Secondary button:** `bg-sprout-deep` + aynı çerçeve
- **Accent / şeftali varyant:** `accent` → `bg-breeze-deep`; `peach` → `bg-blossom-deep`
- **Progress track:** `bg-border` kenarları; dolgu: mint → `sprout-deep`, güneş → `sunlit-deep`
- **Badge varsayılanı:** `bg-sunlit-deep`
- **Modal:** zemin beyaz kart, kaplama `bg-shade/30`

## Animasyon

- Framer Motion: spring, pop-up için `scale: 0.8 → 1`.
