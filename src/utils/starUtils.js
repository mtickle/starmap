import { generateSystemFaction } from './factionUtils.js';
import {
    generateAtmosphere, generateConditions, generateFauna,
    generateFlora, generateResources, generateEconomy,
    generateIndustry, generateInhabitants, generateSettlements
} from './planetPropertiesUtils.js';
import { starClasses } from '../libraries/stars.js';
import { planetTypes } from '../libraries/planets.js';
import { nameSyllables, romanNumerals } from '../libraries/names.js';


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
    // 1. Initialize System-Level PRNG with a unique salt
    const systemSeed = hashString(`${coordinate}_sys`);
    const rng = mulberry32(systemSeed);

    // 2. Generate Star Properties using the new "weight" property
    const roll = rng() * 1.1;
    let cumulative = 0;

    // Set a safe fallback to Class M (the last item in the array) just in case
    let selectedStarClass = starClasses[starClasses.length - 1];

    for (const sc of starClasses) {
        cumulative += sc.weight; // <- This must be .weight, not .probability
        if (roll <= cumulative) {
            selectedStarClass = sc;
            break;
        }
    }

    const nameLen = Math.floor(rng() * 3) + 2;
    let starName = '';
    for (let i = 0; i < nameLen; i++) {
        starName += getRandomItem(nameSyllables, rng);
    }
    starName = starName.charAt(0).toUpperCase() + starName.slice(1);

    const starSize = Math.floor(rng() * 10) + 5; // Canvas rendering size

    // 3. Factions & Stations
    const faction = generateSystemFaction(rng);
    const hasStation = rng() > 0.4;
    const stations = hasStation ? [{
        name: `${starName} Prime`,
        type: getRandomItem(['Trading Post', 'Pirate Den', 'Research Hub'], rng)
    }] : [];

    // 4. Generate Planets
    const numPlanets = Math.floor(rng() * 9); // 0 to 8 planets
    const planets = [];

    for (let i = 0; i < numPlanets; i++) {
        const planetSeed = hashString(`${coordinate}_P${i}`);
        const pRng = mulberry32(planetSeed);

        // ROLL FOR PLANET TYPE USING WEIGHTS
        const pRoll = pRng(); // Total weights equal exactly 1.0
        let cumulativeP = 0;
        let selectedPlanetObj = planetTypes[planetTypes.length - 1]; // Fallback

        for (const pt of planetTypes) {
            cumulativeP += pt.weight;
            if (pRoll <= cumulativeP) {
                selectedPlanetObj = pt;
                break;
            }
        }

        const planetType = selectedPlanetObj.type;

        // ROLL FOR CIVILIZATION FIRST
        const hasCivilization = pRng() > 0.7;

        let pName = '';
        if (hasCivilization) {
            for (let j = 0; j < (Math.floor(pRng() * 2) + 2); j++) {
                pName += getRandomItem(nameSyllables, pRng);
            }
            pName = pName.charAt(0).toUpperCase() + pName.slice(1);
        } else {
            const suffix = romanNumerals[i] || (i + 1);
            pName = `${starName} ${suffix}`;
        }

        const numMoons = (planetType === 'Gas Giant') ? Math.floor(pRng() * 6) + 1 : Math.floor(pRng() * 3);
        const moons = Array.from({ length: numMoons }, (_, mIdx) => `Moon ${mIdx + 1}`);

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