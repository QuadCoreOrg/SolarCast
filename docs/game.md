# SolarCast - Game Design Document

## 1. Game Overview

SolarCast is a gamified solar energy management game where players build and manage their own solar power ecosystem. Players generate energy from the sun, store it in batteries, and earn coins to expand their solar farm.

## 2. Core Mechanics

### 2.1 Energy System
- **Energy Generation:** Players click to generate energy from solar panels
- **Energy Storage:** Batteries store excess energy for later use
- **Energy Consumption:** Devices and upgrades consume energy

### 2.2 Currency System
- **Coins:** Earned by generating energy, used to buy upgrades
- **Experience (XP):** Earned through actions, used for leveling up

### 2.3 Progression System
- **Levels:** Gain XP to level up (Level = XP / 100)
- **Daily Goals:** Complete daily energy targets for bonus rewards

## 3. Game Loop

```
Generate Energy → Earn Coins/XP → Buy Upgrades → Generate More Energy
```

## 4. Features

### 4.1 Solar Panels
- Generate passive energy over time
- Upgradeable for higher output

### 4.2 Batteries
- Store excess energy
- Different capacities available

### 4.3 Upgrades
- Boost energy generation
- Increase coin earnings
- Expand storage capacity

### 4.4 Daily Goals
- Random daily energy targets
- Bonus rewards on completion

## 5. Technical Stack
- React (Vite)
- Tailwind CSS
- Framer Motion
- Zustand (State Management)
- Lucide React (Icons)
- Axios (API Calls)

## 6. UI/UX Guidelines
- Cartoonish & Neo-Brutalist design
- Thick dark borders (border-4 border-slate-900)
- Heavy rounding (rounded-3xl, rounded-full)
- Hard offset shadows
- Nunito font family
- Vibrant but soft color palette