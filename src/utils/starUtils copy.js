// utils/starUtils.js
import { starPrefixes, starSuffixes, starClasses, starTemperatures, starDescriptions } from '../libraries/stars.js';
import { hashString, mulberry32, getRandomItem, getWeightedItem, generateDeterministicUUID } from './randomUtils.js';
import { synthesizePlanets } from './planetUtils.js';

// Import the new generators
import { generateSystemFaction } from './factionUtils.js';
import { generateStations } from './stationUtils.js';

export function synthesizeStar(starCoordinate) {
    const starSeed = hashString(starCoordinate);
    const rngStar = mulberry32(starSeed);

    const starId = generateDeterministicUUID(rngStar);
    const prefix = getRandomItem(starPrefixes, rngStar);
    const suffix = (rngStar() < 0.3) ? ` ${getRandomItem(starSuffixes, rngStar)}` : '';
    const starClassData = getWeightedItem(rngStar, starClasses);

    // 1. Generate the Faction first
    const starFaction = generateSystemFaction(rngStar);

    // 2. Generate the Stations using the faction data
    const starStations = generateStations(starFaction, starId, `${prefix}${suffix}`, rngStar);

    const star = {
        id: starId,
        coordinate: starCoordinate,
        name: `${prefix}${suffix}`,
        type: starClassData.type,
        color: starClassData.color,
        size: starClassData.size,
        temperatureRange: starClassData.temp,
        temperatureDesc: starTemperatures[starClassData.type],
        description: starDescriptions[starClassData.type],

        // Assign the new objects to the root of the system
        faction: starFaction,
        stations: starStations
    };

    // 3. Attach the planets (which will continue the rngStar sequence)
    star.planets = synthesizePlanets(starId, star.name, starCoordinate, rngStar);

    return star;
}