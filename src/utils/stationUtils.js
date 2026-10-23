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

        const factionName = faction ? faction.name : "League of Unaligned Worlds";

        if (rngStation() < 0.7) {
            const adjArray = thematicAdjectives[factionName] || thematicAdjectives["League of Unaligned Worlds"];
            const adj = getRandomItem(adjArray, rngStation) || "Neutral";
            const suffixArray = stationNameSuffixes[factionName] || stationNameSuffixes["League of Unaligned Worlds"];
            const suffix = getRandomItem(suffixArray, rngStation) || "Outpost";
            stationName = `${adj} ${suffix}`;
        } else {
            const prefix = getRandomItem(stationNamePrefixes, rngStation);
            const suffixArray = stationNameSuffixes[factionName] || stationNameSuffixes["League of Unaligned Worlds"];
            const suffix = getRandomItem(suffixArray, rngStation) || "Station";
            stationName = `${starName} ${prefix} ${suffix}`;
        }

        let stationSize = 10;
        let alignment = faction ? faction.alignment : "Neutral";

        if (["Lawful Good", "Lawful Neutral"].includes(alignment)) {
            stationSize = 12;
        } else if (["Chaotic Evil", "Neutral Evil"].includes(alignment)) {
            stationSize = 8;
        } else if (alignment === "True Neutral") {
            stationSize = 15;
        }

        let stationType = 'general';
        if (faction && factionName !== "League of Unaligned Worlds") {
            if (factionName === "The Solar Accord") stationType = 'bureaucratic';
            else if (factionName === "The Obsidian Syndicate") stationType = 'covert';
            else if (factionName === "The Luma Ascendancy") stationType = 'scientific';
            else if (factionName === "The Ember Crown") stationType = 'military';
            else if (factionName === "The Vireli Swarm") stationType = 'biological';
        } else {
            // Unaligned/Neutral stations pull from the civilian economy pool
            const civilianThemes = ["industrial", "luxury", "mining", "research", "trade", "transportation", "general"];
            const index = Math.floor(rngStation() * civilianThemes.length);
            stationType = civilianThemes[index];
        }

        // --- NEW DETERMINISTIC ATTRIBUTES ---
        const crew = Math.floor(stationSize * 15 * rngStation()) + 25;
        const inhabitants = Math.floor(stationSize * 80 * rngStation());
        const fuelLevel = Math.floor(rngStation() * 100);
        const storageCapacity = Math.floor(stationSize * 5000 * rngStation()) + 1000;
        const dockingRings = Math.floor((stationSize / 4) + (rngStation() * 4)) + 1;

        // Defensive Systems (Non-offensive)
        const possibleDefenses = [
            "Aegis Deflector Shields",
            "Point-Defense Chaff Grids",
            "ECM Jamming Array",
            "Reinforced Ablative Plating",
            "Thermal Decoy Launchers",
            "Sensor Scramblers",
            "EMP Hardening"
        ];

        const defenseCount = Math.floor(rngStation() * 3) + 1; // 1 to 3 systems
        const defenseSystems = [];
        const availableDefenses = [...possibleDefenses];

        for (let j = 0; j < defenseCount; j++) {
            const index = Math.floor(rngStation() * availableDefenses.length);
            defenseSystems.push(availableDefenses[index]);
            availableDefenses.splice(index, 1);
        }

        stations.push({
            starId: starId,
            stationId: stationId,
            stationName: stationName,
            stationSize: stationSize,
            stationType: stationType,
            factionId: faction ? faction.id : null,
            factionColor: faction ? faction.color : '#888888',

            // Expanded metrics
            crew,
            inhabitants,
            fuelLevel,
            storageCapacity,
            dockingRings,
            defenseSystems
        });
    }

    return stations;
};