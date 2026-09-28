import { factions } from '../libraries/factions.js';
import { getAllianceForFaction } from './politicsUtils.js';
import { getRandomItem } from './randomUtils.js';
import { assignFactionToAlliance } from './alliancesUtils.js';

/**
 * Deterministically generates a controlling faction for a star system.
 */
export const generateSystemFaction = (rngStar) => {
    // 25% chance the system is completely Unclaimed
    if (rngStar() < 0.25) return null;

    const factionTemplate = getRandomItem(factions, rngStar);

    const newFaction = {
        ...factionTemplate,
    };

    // Deterministically fetch the universal alliance for this faction
    newFaction.alliance = assignFactionToAlliance(newFaction);

    return newFaction;
};

// --- Helper Functions ---
export const getFactionById = (id) => {
    return factions.find(f => f.id === id);
};

export const getFactionColor = (id) => getFactionById(id)?.color || '#888';
export const getFactionSymbol = (id) => getFactionById(id)?.symbol || '⚪';