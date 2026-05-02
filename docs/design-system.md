# SolarCast - Design System & UI Guidelines

You are an expert Frontend Developer. We are building a gamified solar energy web application using React (Vite), Tailwind CSS, and Framer Motion.

Follow these strict "Cartoonish UI" design rules for every component you generate:

## 1. Typography
- Use `Nunito` for all text.
- Use thick font weights (`font-bold`, `font-black`) for headings and numbers.

## 2. Global Styling Rules (Cartoonish & Neo-Brutalist)
- **Borders:** Every main element (cards, buttons, modals, badges) MUST have thick, dark borders. Use `border-4 border-slate-900`.
- **Corners:** Everything must be heavily rounded. Use `rounded-2xl`, `rounded-3xl`, or `rounded-full`.
- **Shadows:** Do not use soft drop shadows. Use hard/solid offset shadows to create a 3D comic effect. Use `shadow-[4px_4px_0px_0px_#0f172a]`. When a button is clicked, it should translate down and the shadow should disappear (simulate pressing).

## 3. Color Palette (Soft & Friendly)
- **Background:** Pure White (`bg-pure-white` or `bg-white`)
- **Primary (Sun/Energy):** Sunny Yellow (`bg-sunny-yellow`)
- **Secondary (Battery/Eco):** Mint Green (`bg-mint-green`)
- **Accent (Peach/Soft):** Soft Peach (`bg-soft-peach`)
- **Text:** Dark Slate (`text-slate-900`) for high contrast.

## 4. Custom Colors (Tailwind v4)
```css
@theme {
  --color-soft-peach: #FFE5D0;
  --color-mint-green: #B8F4E3;
  --color-sunny-yellow: #FFE066;
  --color-pure-white: #FFFFFF;
}
```

## 5. Component Blueprints (Tailwind Classes)
- **Primary Button:** `bg-sunny-yellow border-4 border-slate-900 rounded-full font-bold text-slate-900 px-6 py-3 shadow-[4px_4px_0px_0px_#0f172a] active:translate-y-1 active:shadow-none transition-all`
- **Secondary Button:** `bg-mint-green border-4 border-slate-900 rounded-full font-bold text-slate-900 px-6 py-3 shadow-[4px_4px_0px_0px_#0f172a] active:translate-y-1 active:shadow-none transition-all`
- **Dashboard Card:** `bg-white border-4 border-slate-900 rounded-3xl p-6 shadow-[6px_6px_0px_0px_#0f172a]`
- **Accent Card:** `bg-soft-peach border-4 border-slate-900 rounded-3xl p-6 shadow-[6px_6px_0px_0px_#0f172a]`
- **Energy Bar (Container):** `w-full h-8 bg-slate-100 border-4 border-slate-900 rounded-full overflow-hidden`
- **Energy Bar (Fill):** `h-full bg-mint-green`

## 6. Animations (Framer Motion)
- Use bouncy animations.
- Pop-ups should scale from `0.8` to `1` with a `spring` transition.