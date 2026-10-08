import { generateSystemFaction } from './factionUtils.js';
import {
    generateAtmosphere, generateConditions, generateFauna,
    generateFlora, generateResources, generateEconomy,
    generateIndustry, generateInhabitants, generateSettlements
} from './planetPropertiesUtils.js';
import { starClasses } from '../libraries/stars.js';
import { planetTypes } from '../libraries/planets.js';
// Removed the static libraries/names.js import
import { generateName } from './proceduralLanguage.js';


// --- SEEDING & PRNG UTILS ---
export function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = Math.imul(31, hash) + str.charCodeAt(i) | 0;
    }
    return hash;
}

export function mulberry32(a) {
    return function () {
        var t = a += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

function getRandomItem(arr, rng) {
    return arr[Math.floor(rng() * arr.length)];
}


// --- CORE GENERATOR ---
export function synthesizeStar(coordinate) {
    // 1. Initialize System-Level PRNG
    const systemSeed = hashString(`${coordinate}_sys`);
    const rng = mulberry32(systemSeed);

    // 2. Generate Star Properties
    const roll = rng() * 1.1;
    let cumulative = 0;
    let selectedStarClass = starClasses[starClasses.length - 1];

    for (const sc of starClasses) {
        cumulative += sc.weight;
        if (roll <= cumulative) {
            selectedStarClass = sc;
            break;
        }
    }

    // THE VORTEX: Replaced the manual loop with a single engine call
    const starName = generateName(rng, 'star');

    const starSize = Math.floor(rng() * 10) + 5;

    // 3. Factions & Stations
    const faction = generateSystemFaction(rng);
    const hasStation = rng() > 0.4;
    const stations = hasStation ? [{
        name: `${starName} Prime`,
        type: getRandomItem(['Trading Post', 'Pirate Den', 'Research Hub'], rng)
    }] : [];

    // 4. Generate Planets
    const numPlanets = Math.floor(rng() * 9);
    const planets = [];

    // Tiny inline fallback for lifeless planets
    const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];

    for (let i = 0; i < numPlanets; i++) {
        const planetSeed = hashString(`${coordinate}_P${i}`);
        const pRng = mulberry32(planetSeed);

        // ROLL FOR PLANET TYPE USING WEIGHTS
        const pRoll = pRng();
        let cumulativeP = 0;
        let selectedPlanetObj = planetTypes[planetTypes.length - 1];

        for (const pt of planetTypes) {
            cumulativeP += pt.weight;
            if (pRoll <= cumulativeP) {
                selectedPlanetObj = pt;
                break;
            }
        }

        const planetType = selectedPlanetObj.type;
        const hasCivilization = pRng() > 0.7;

        // THE VORTEX: Replaced the planet naming loop
        let pName = '';
        if (hasCivilization) {
            // Dynamically pass the planet type so toxic planets sound different from paradise planets
            pName = generateName(pRng, `planet_${planetType.toLowerCase()}`);
        } else {
            const suffix = romanNumerals[i] || (i + 1);
            pName = `${starName} ${suffix}`;
        }

        const numMoons = (planetType === 'Gas Giant') ? Math.floor(pRng() * 6) + 1 : Math.floor(pRng() * 3);

        // THE VORTEX: Generating actual names for moons instead of "Moon 1"
        const moons = Array.from({ length: numMoons }, () => generateName(pRng, 'moon'));

        planets.push({
            planetId: `${coordinate}_P${i}`,
            planetName: pName,
            planetType: planetType,
            planetColor: selectedPlanetObj.color,
            gravity: (pRng() * 2 + 0.5).toFixed(2),
            orbitalPeriod: Math.floor(pRng() * 800) + 50,
            atmosphere: generateAtmosphere(planetType, pRng),
            conditions: generateConditions(planetType, pRng),
            faunaList: generateFauna(planetType, pRng),
            floraList: generateFlora(planetType, pRng),
            resourceList: generateResources(planetType, pRng),
            inhabitants: generateInhabitants(planetType, hasCivilization, pRng),
            settlements: generateSettlements(hasCivilization, pRng),
            economy: generateEconomy(hasCivilization, pRng),
            industry: generateIndustry(hasCivilization, pRng),
            moons: moons
        });
    }
    return {
        id: coordinate,
        name: starName,
        type: selectedStarClass.type,
        color: selectedStarClass.color,
        size: selectedStarClass.size,
        temperatureDesc: selectedStarClass.temp,
        economy: hasStation ? getRandomItem(['Booming', 'Destitute', 'Developing', 'Black Market'], rng) : 'None',
        faction: faction,
        stations: stations,
        planets: planets
    };
}