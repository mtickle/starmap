import { planetNames, planetTypes } from '../libraries/planets.js';
import { hashString, mulberry32, getWeightedItem, generateDeterministicUUID } from './randomUtils.js';
//import { getPlanetTexture } from '../utils/textureMap';
import { getPlanetTexture } from '@utils/planetTextures.js';

// Import the expanded generators we built previously
import {
    generateAtmosphere,
    generateConditions,
    generateFauna,
    generateFlora,
    generateResources,
    generateInhabitants,
    generateEconomy,
    generateIndustry,
    generateSettlements
} from './planetPropertiesUtils.js';
import { generateMoons } from './moonUtils.js';

export function synthesizePlanets(starId, starName, starCoordinate, rngStar) {
    const numPlanets = Math.floor(rngStar() * 13);
    const planets = [];
    const availableUniqueNames = [...planetNames];

    for (let i = 0; i < numPlanets; i++) {
        // Cascade the seed
        const planetSeed = hashString(`${starCoordinate}_P${i}`);
        const rngPlanet = mulberry32(planetSeed);

        const planetId = generateDeterministicUUID(rngPlanet);
        const planetTypeData = getWeightedItem(rngPlanet, planetTypes);
        const planetSize = Math.floor(rngPlanet() * 10) + 1;
        const orbitRadius = 20 + (i * 15);

        const hasCivilization = rngPlanet() > 0.3;
        const planetName = generatePlanetName(starName, i, availableUniqueNames, hasCivilization, rngPlanet);
        const isUniqueName = !planetName.includes(starName);

        // Fetch the corresponding texture using the planet's name as a deterministic seed
        const textureUrl = getPlanetTexture(planetTypeData.type, planetName);

        //Inhabitants
        const hasInhabitants = rngPlanet() > 0.6;
        const inhabitants = generateInhabitants(planetTypeData.type, hasInhabitants, rngPlanet);

        let isAdvancedCivilization = false;
        if (inhabitants && inhabitants.length > 0 && inhabitants[0].currentSociety) {
            const advancedSocieties = ['Civilization', 'Empire', 'Trade Guilds', 'Fallen Empire', 'Hive Mind'];
            isAdvancedCivilization = advancedSocieties.includes(inhabitants[0].currentSociety);
        }

        // Calculate Gravity and Orbit
        let gravityMultiplier = 1.0;
        if (['Rocky', 'Metallic', 'Artificial'].includes(planetTypeData.type)) gravityMultiplier = 1.2;
        if (['Ice World', 'Exotic'].includes(planetTypeData.type)) gravityMultiplier = 0.8;

        const gravity = parseFloat(((planetSize / 5.0) * gravityMultiplier * (rngPlanet() * 0.4 + 0.8)).toFixed(2));
        const rotationalPeriod = parseFloat((rngPlanet() * 92 + 8).toFixed(1));
        const orbitalPeriod = Math.round(Math.pow(orbitRadius, 1.5) * 0.2);

        const planet = {
            starId: starId,
            starName: starName,
            planetId: planetId,
            planetName: planetName,
            planetType: planetTypeData.type,
            planetColor: planetTypeData.color,
            textureUrl: textureUrl,
            planetSize: planetSize,
            gravity: gravity,
            orbitRadius: orbitRadius,
            orbitalPeriod: orbitalPeriod,
            rotationalPeriod: rotationalPeriod,
            isUniqueName: isUniqueName,
            hasCivilization: hasCivilization,

            // Replace the stubs with the imported functions
            atmosphere: generateAtmosphere(planetTypeData.type, rngPlanet),
            faunaList: generateFauna(planetTypeData.type, rngPlanet),
            floraList: generateFlora(planetTypeData.type, rngPlanet),
            planetConditions: generateConditions(planetTypeData.type, rngPlanet),
            resourceList: generateResources(planetTypeData.type, rngPlanet),

            // Civilization properties
            hasInhabitants: hasInhabitants,
            inhabitants: inhabitants,
            economy: generateEconomy(isAdvancedCivilization, rngPlanet),
            industry: generateIndustry(isAdvancedCivilization, rngPlanet),
            settlements: generateSettlements(isAdvancedCivilization, rngPlanet),

            // Moons calculated last to preserve sequence integrity
            moons: generateMoons(starId, planetId, planetName, planetTypeData.type, planetSize, rngPlanet)
        };

        console.log(`Generated planet: ${planetName} (Type: ${planetTypeData.type}, Size: ${planetSize}, Gravity: ${gravity}, Orbit Radius: ${orbitRadius}, Orbital Period: ${orbitalPeriod}, Rotational Period: ${rotationalPeriod})`);

        planets.push(planet);
    }

    return planets;
}

function generatePlanetName(starName, index, uniqueNames, forceUnique, rngPlanet) {
    const shouldUseUnique = forceUnique || (uniqueNames.length > 0 && rngPlanet() < 0.6);
    if (shouldUseUnique && uniqueNames.length > 0) {
        const nameIndex = Math.floor(rngPlanet() * uniqueNames.length);
        return uniqueNames.splice(nameIndex, 1)[0];
    }
    const letters = ['b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
    return `${starName} ${letters[index]}`;
}

// ==========================================
// MOON GENERATOR
// ==========================================
function toRoman(num) {
    const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
    return roman[num - 1] || String(num);
}

