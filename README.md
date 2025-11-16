# Dirt Clicker 🟫

<h3 align="left">Funny clicker game built with React!</h3>

<p align="left">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=react,vite,ts" />
  </a>
</p>

A modern clicker game built with React, TypeScript, and Vite where you collect dirt blocks and unlock various upgrades!

## 🎮 Features

- **Click to Collect**: Click the dirt block to earn dirt
- **Passive Income**: Purchase upgrades that automatically generate dirt
- **Multiple Upgrades**:
  - Click Power - Increases manual click strength
  - Wood Shovel - Generates 1 dirt/second (with level scaling)
  - Enchanted Wood Shovel - Multiplies auto-clicker efficiency
  - Friendly Enderman - Generates 5 dirt/second
  - Allay - Multiplies all passive income by 1.2x per Allay
  - Lucky Cat - Adds 10% chance for 10x click bonus (max 10 cats)
  - Pirate Parrot - Generates 30 dirt/second
  - Fox - Generates 20 dirt/second
- **Level Scaling**: All upgrades get 15% more powerful with each level
- **Offline Progress**: Earn dirt even when away from the game
- **Promo Codes**: Special codes for bonus rewards
- **Audio System**: Background music and sound effects
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Zustand** - State management with persistence
- **Framer Motion** - Smooth animations
- **PWA** - Progressive Web App support
- **IndexedDB** - Local data storage

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm/yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Vergusha/dirt-clicker.git

# Navigate to project directory
cd dirt-clicker

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/         # React components
│   ├── AllayHelper/   # Allay animation component
│   ├── AudioPlayer/   # Background music player
│   ├── AutoDigger/    # Wood shovel animations
│   ├── DirtBlock/     # Main clickable dirt block
│   ├── Fox/           # Fox helper component
│   ├── GameHeader/    # Header with dirt counter
│   ├── InfoPanel/     # Upgrade info modal
│   ├── LuckyCat/      # Lucky cat animation
│   ├── OfflineProgress/ # Offline earnings display
│   ├── PirateParrot/  # Pirate parrot component
│   ├── Settings/      # Settings panel
│   ├── Upgrades/      # Upgrades panel and buttons
│   └── ...
├── constants/         # Game constants and config
│   └── gameConstants.ts
├── hooks/             # Custom React hooks
├── store/             # Zustand state management
│   └── gameStore.ts
├── types/             # TypeScript type definitions
│   └── index.ts
├── utils/             # Utility functions
│   └── formatNumber.ts
├── App.tsx            # Main app component
└── main.tsx           # Entry point
```

## 🎯 Game Mechanics

### Economy Balance

- **Click Power**: Base cost 10, increases 15% per level
- **Wood Shovel**: Base cost 50, generates 1 dirt/s
- **Friendly Enderman**: Base cost 1,000, generates 5 dirt/s
- **Allay**: Base cost 5,000, multiplies income by 1.2x
- **Lucky Cat**: Base cost 10,000, adds 10% luck chance
- **Pirate Parrot**: Base cost 20,000, generates 30 dirt/s
- **Fox**: Base cost 30,000, generates 20 dirt/s

All upgrades use geometric growth (15%) and benefit from level scaling multipliers.

### Promo Codes

- `Dead` - Reset all progress
- `Sasha` - Receive bc (10^99) dirt
- `1zz` - Receive zz (10^2040) dirt
- `get50trilliondirt` - Receive 50 trillion dirt
- Standard promo codes for smaller bonuses

## 🔧 Configuration

Game constants are centralized in `src/constants/gameConstants.ts`:

- `GROWTH_RATE` - Upgrade cost increase rate (15%)
- `BASE_COSTS` - Initial costs for all upgrades
- `PRODUCTION_RATES` - Dirt generation rates
- `MULTIPLIERS` - Various game multipliers
- `LIMITS` - Max levels and restrictions
- `ANIMATION` - Animation durations

## 🎨 Code Quality Improvements

Recent improvements include:

- ✅ Removed unused imports and variables
- ✅ Fixed Pirate Parrot calculation consistency (30 dirt/s)
- ✅ Centralized magic numbers into constants
- ✅ Improved TypeScript typing (removed `any` usage)
- ✅ Optimized cost calculation using geometric series formula
- ✅ Added input validation for promo codes
- ✅ Better code organization and documentation
- ✅ Consistent use of constants across components

## 🤖 AI Development

<h3 align="left">I actively use such AI:</h3>
<p align="left">
  <a href="" target="_blank" rel="noreferrer"> <img src="https://img.icons8.com/?size=192&id=TUk7vxvtu6hX&format=png" alt="chatgpt" width="45" height="45"/> </a>
  <a href="" target="_blank" rel="noreferrer"> <img src="https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/claude-color.png" width="40" height="40"/> </a>
</p>

## 📝 License

This project is open source and available for educational purposes.

## 👤 Author

**Vergusha**

- GitHub: [@Vergusha](https://github.com/Vergusha)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Made with ❤️ and lots of dirt blocks
