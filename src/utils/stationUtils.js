import { stationNamePrefixes, stationNameSuffixes, thematicAdjectives } from '../libraries/stations.js';
import { hashString, mulberry32, getRandomItem, generateDeterministicUUID } from './randomUtils.js';

/**
 * Deterministically generates 1 to 5 orbital/deep-space stations for a system.
 */
export const generateStations = (faction, starId, starName, rngStar) => {
    // Heavily weighted toward 1 station, but possible to hit 5
    const numStations = Math.floor(Math.pow(rngStar(), 2) * 5) + 1;
    const stations = [];

    for (let i = 0; i < numStations; i++) {
        // Cascade the seed down to the individual station level
        const stationSeed = hashString(`${starId}_ST${i}`);
        const rngStation = mulberry32(stationSeed);

        const stationId = generateDeterministicUUID(rngStation);
        let stationName;

        // Handle names whether the system has a faction or is Unclaimed
        const factionName = faction ? faction.name : "League of Unaligned Worlds";

        if (rngStation() < 0.7) {
            // 70% chance of "Faction_Adjective Structure_Type"
            const adjArray = thematicAdjectives[factionName] || thematicAdjectives["League of Unaligned Worlds"];
            const adj = getRandomItem(adjArray, rngStation) || "Neutral";

            const suffixArray = stationNameSuffixes[factionName] || stationNameSuffixes["League of Unaligned Worlds"];
            const suffix = getRandomItem(suffixArray, rngStation) || "Outpost";

            stationName = `${adj} ${suffix}`;
        } else {
            // 30% chance of "Star_Name [Prefix] Structure_Type"
            const prefix = getRandomItem(stationNamePrefixes, rngStation);

            const suffixArray = stationNameSuffixes[factionName] || stationNameSuffixes["League of Unaligned Worlds"];
            const suffix = getRandomItem(suffixArray, rngStation) || "Station";

            stationName = `${starName} ${prefix} ${suffix}`;
        }

        // Determine size based on alignment
        let stationSize = 10;
        let alignment = faction ? faction.alignment : "Neutral";

        if (["Lawful Good", "Lawful Neutral"].includes(alignment)) {
            stationSize = 12;
        } else if (["Chaotic Evil", "Neutral Evil"].includes(alignment)) {
            stationSize = 8;
        } else if (alignment === "True Neutral") {
            stationSize = 15;
        }

        // Determine visual type
        let stationType = 'general';
        if (faction) {
            if (factionName === "The Solar Accord") stationType = 'bureaucratic';
            if (factionName === "The Obsidian Syndicate") stationType = 'covert';
            if (factionName === "The Luma Ascendancy") stationType = 'scientific';
            if (factionName === "The Ember Crown") stationType = 'military';
            if (factionName === "The Vireli Swarm") stationType = 'biological';
        }

        stations.push({
            starId: starId,
            stationId: stationId,
            stationName: stationName,
            stationSize: stationSize,
            stationType: stationType,
            factionId: faction ? faction.id : null,
            factionColor: faction ? faction.color : '#888888'
        });
    }

    return stations;
};