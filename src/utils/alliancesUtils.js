import { alliances } from '../libraries/alliances.js';
import { hashString, mulberry32, getRandomItem } from './randomUtils.js';

/**
 * Deterministically assigns a faction to an alliance based on its ID and alignment.
 * @param {object} faction - The faction object, which must have an 'id' and 'alignment'.
 * @returns {object|null} The assigned alliance object, or null if independent.
 */
export const assignFactionToAlliance = (faction) => {
    // 1. Create a universal seed based on the faction's ID
    const factionSeed = hashString(faction.id);
    const rngFaction = mulberry32(factionSeed);

    // 2. 70% chance that this faction belongs to a major alliance
    if (rngFaction() > 0.7) {
        return null;
    }

    // 3. Find alliances that are a good political match
    const potentialAlliances = alliances.filter(a => a.alignment === faction.alignment);

    if (potentialAlliances.length > 0) {
        // Return the full alliance object rather than just the ID for richer UI data
        return getRandomItem(potentialAlliances, rngFaction);
    }

    // 4. Fallback to True Neutral
    if (rngFaction() < 0.5) {
        const neutralAlliance = alliances.find(a => a.alignment === 'True Neutral');
        return neutralAlliance ? neutralAlliance : null;
    }

    return null; // The faction remains independent.
};