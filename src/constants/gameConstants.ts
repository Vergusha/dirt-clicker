/**
 * Game constants for Dirt Clicker
 * Centralizes all magic numbers and configuration values
 */

// Growth rate for all upgrades (15%)
export const GROWTH_RATE = 0.15;

// Base costs for upgrades
export const BASE_COSTS = {
    CLICK_POWER: 10,
    AUTO_CLICKER: 50,
    MULTI_AUTO_CLICK: 250,
    FRIENDLY_ENDERMAN: 1000,
    ALLAY: 5000,
    LUCKY_CAT: 10000,
    PIRATE_PARROT: 20000,
    FOX: 30000,
} as const;

// Production rates per second
export const PRODUCTION_RATES = {
    AUTO_CLICKER: 1,           // Dirt per second per Wood Shovel
    FRIENDLY_ENDERMAN: 5,       // Dirt per second per Enderman
    PIRATE_PARROT: 30,          // Dirt per second per Parrot
    FOX: 20,                    // Dirt per second per Fox
} as const;

// Multipliers
export const MULTIPLIERS = {
    LEVEL_SCALING: 0.15,        // 15% increase per level
    ALLAY: 0.2,                 // 20% multiplier per Allay
    LUCKY_CAT_CHANCE: 0.1,      // 10% chance per Lucky Cat
    LUCKY_CAT_MULTIPLIER: 10,   // 10x multiplier when lucky
} as const;

// Limits
export const LIMITS = {
    LUCKY_CAT_MAX: 10,          // Maximum Lucky Cats
    OFFLINE_MIN_SECONDS: 30,    // Minimum offline time to show progress
} as const;

// Animation durations (ms)
export const ANIMATION = {
    CLICK_DURATION: 800,
    AUTO_CLICK_DURATION: 800,
} as const;

// Audio default settings
export const AUDIO_DEFAULTS = {
    MUSIC_VOLUME: 0.5,
    EFFECTS_VOLUME: 1.0,
    CREATURE_VOLUME: 0.5,
} as const;
