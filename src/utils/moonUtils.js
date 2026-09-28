import { moonTypes } from '../libraries/moons.js';
import { planetNames } from '../libraries/planets.js';
import { moonEconomies, moonIndustries, moonThemes, moonSettlementNames } from '../libraries/moonFringe.js';
import { hashString, mulberry32, getRandomItem, generateDeterministicUUID } from './randomUtils.js';
import { generateConditions, generateResources } from './planetPropertiesUtils.js';

const namedMoonProbability = 0.6;

export function generateMoons(starId, planetId, planetName, planetType, planetSize, rngPlanet) {
    const numMoons = Math.floor(Math.pow(rngPlanet(), 2) * 11);
    const moons = [];
    const availableUniqueNames = [...planetNames];

    for (let i = 0; i < numMoons; i++) {
        const moonSeed = hashString(`${planetId}_M${i}`);
        const rngMoon = mulberry32(moonSeed);
        const moonId = generateDeterministicUUID(rngMoon);

        const isNamed = rngMoon() < namedMoonProbability;
        let moonName = `${planetName} ${toRoman(i + 1)}`;

        if (isNamed && availableUniqueNames.length > 0) {
            const nameIndex = Math.floor(rngMoon() * availableUniqueNames.length);
            moonName = availableUniqueNames.splice(nameIndex, 1)[0];
        }

        const moonType = getRandomItem(moonTypes, rngMoon);
        const moonSize = parseFloat((rngMoon() * 0.3 + 0.1).toFixed(2));

        // Generate the fringe civilization data if the moon is named
        const fringeCiv = isNamed ? generateMoonCivilization(moonName, rngMoon) : null;

        moons.push({
            starId: starId,
            planetId: planetId,
            moonId: moonId,
            moonName: moonName,
            moonType: moonType,
            moonSize: moonSize,
            moonConditions: generateConditions(moonType, rngMoon),
            moonResources: generateResources(moonType, rngMoon),

            // Unpack the fringe civ data if it exists, otherwise default to null/empty
            moonEconomy: fringeCiv ? fringeCiv.economy : null,
            moonIndustry: fringeCiv ? fringeCiv.industry : null,
            moonSettlements: fringeCiv ? fringeCiv.settlements : []
        });
    }

    return moons;
}

function generateMoonCivilization(moonName, rng) {
    const economy = getRandomItem(moonEconomies, rng);
    const industry = getRandomItem(moonIndustries, rng);

    // 1 to 2 settlements maximum for a moon
    const numSettlements = rng() < 0.8 ? 1 : 2;
    const settlements = [];
    const themeKeys = Object.keys(moonThemes);
    const availableNames = [...moonSettlementNames];

    for (let i = 0; i < numSettlements; i++) {
        let name = "Outpost";
        if (availableNames.length > 0) {
            const nameIdx = Math.floor(rng() * availableNames.length);
            name = availableNames.splice(nameIdx, 1)[0];
        }

        const themeName = getRandomItem(themeKeys, rng);
        const themeData = moonThemes[themeName];
        const condition = getRandomItem(themeData.condition, rng);

        // Moons only get 2 to 3 buildings
        const numBuildings = Math.floor(rng() * 2) + 2;
        const availableBuildings = [...themeData.buildings];
        const selectedBuildings = [];

        for (let b = 0; b < numBuildings && availableBuildings.length > 0; b++) {
            const bIdx = Math.floor(rng() * availableBuildings.length);
            selectedBuildings.push(availableBuildings.splice(bIdx, 1)[0]);
        }

        // Extremely low population caps (50 to 550 people)
        const population = Math.floor(rng() * 500) + 50;

        settlements.push({
            name: `${moonName} ${name}`, // e.g., "Aegis Dust Hole"
            isCapital: i === 0,
            population: population,
            theme: themeName,
            condition: condition,
            buildings: selectedBuildings
        });
    }

    return { economy, industry, settlements };
}

function toRoman(num) {
    const romans = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    return romans[num - 1] || `${num}`;
}