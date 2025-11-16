# Changelog

All notable changes to the Dirt Clicker project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Centralized game constants in `src/constants/gameConstants.ts`
- Input validation for promo codes
- Comprehensive README documentation
- CHANGELOG file for tracking changes

### Changed
- **BREAKING**: Pirate Parrot now generates 30 dirt/s (was inconsistent between 10 and 30)
- Optimized `calculateCost` function using geometric series formula for better performance
- Improved TypeScript typing throughout the codebase (removed all `any` usage)
- Better code organization and structure
- Enhanced offline progress calculation with proper constants

### Fixed
- Removed unused imports (FriendlyEnderman, Allay components that don't exist)
- Removed unused `multiAutoClickPower` variable from App.tsx
- Fixed inconsistent Pirate Parrot dirt generation rates
- Fixed typing issues in `fixFloatingPointNumbers` function
- Improved error handling in promo code system

### Removed
- All magic numbers replaced with named constants
- Unused variables and imports

## [1.0.0] - Initial Release

### Added
- Core clicker gameplay mechanics
- Multiple upgrade types (Click Power, Wood Shovel, Enchanted Wood Shovel, etc.)
- Passive dirt generation system
- Level scaling system (15% increase per level)
- Offline progress tracking
- Audio system with background music and sound effects
- Lucky Cat system with 10% chance for 10x clicks
- Allay multiplier system (1.2x per Allay)
- Promo code system
- Progressive Web App (PWA) support
- State persistence using Zustand and localStorage
- Responsive design for desktop and mobile
- Animated creatures (Enderman, Allay, Lucky Cat, Pirate Parrot, Fox)
- Settings panel for audio controls
- Info panels for upgrade details
- Tab navigation (Game, Upgrades, Settings)

### Game Upgrades
- **Click Power**: Manual click strength (+1 per level)
- **Wood Shovel**: Automatic dirt mining (1 dirt/s, base cost 50)
- **Enchanted Wood Shovel**: Auto-clicker efficiency multiplier
- **Friendly Enderman**: Teleports dirt (5 dirt/s, base cost 1,000)
- **Allay**: Income multiplier (1.2x per Allay, base cost 5,000)
- **Lucky Cat**: Luck chance for 10x clicks (max 10, base cost 10,000)
- **Pirate Parrot**: Treasure generation (30 dirt/s, base cost 20,000)
- **Fox**: Additional collection (20 dirt/s, base cost 30,000)
