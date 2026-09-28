import { generateSystemFaction } from './factionUtils.js';
import {
    generateAtmosphere, generateConditions, generateFauna,
    generateFlora, generateResources, generateEconomy,
    generateIndustry, generateInhabitants, generateSettlements
} from './planetPropertiesUtils.js';

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

// --- STAR GENERATION DATA ---
const starClasses = [
    { type: 'O', color: '#3B82F6', temp: '>30,000K', size: 10, weight: 0.05 }, // Brilliant Blue
    { type: 'B', color: '#06B6D4', temp: '10,000–30,000K', size: 8, weight: 0.1 },  // Vibrant Cyan
    { type: 'A', color: '#F8FAFC', temp: '7,500–10,000K', size: 7, weight: 0.1 },  // Crisp White
    { type: 'F', color: '#FDE047', temp: '6,000–7,500K', size: 6, weight: 0.1 },  // Bright Yellow
    { type: 'G', color: '#F59E0B', temp: '5,200–6,000K', size: 5, weight: 0.15 }, // Deep Amber
    { type: 'K', color: '#EA580C', temp: '3,700–5,200K', size: 4, weight: 0.2 },  // Bold Orange
    { type: 'M', color: '#EF4444', temp: '<3,700K', size: 3, weight: 0.4 },       // Strong Red
];

const planetTypes = [
    'Rocky', 'Gas Giant', 'Ice World', 'Exotic',
    'Oceanic', 'Volcanic', 'Barren', 'Radiated'
];

const nameSyllables = ['al', 'ta', 'ir', 'be', 'tel', 'geu', 'se', 'ri', 'gel', 've', 'ga', 'pro', 'cy', 'on', 'sir', 'ius'];

// --- CORE GENERATOR ---
export function synthesizeStar(coordinate) {
    // 1. Initialize System-Level PRNG
    const systemSeed = hashString(coordinate);
    const rng = mulberry32(systemSeed);

    // 2. Generate Star Properties
    const roll = rng() * 1.1; // Multiplied by 1.1 because your total weights add up to 1.1
    let cumulative = 0;
    let selectedStarClass = starClasses[starClasses.length - 1]; // Fallback

    for (const sc of starClasses) {
        cumulative += sc.weight;
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
        // Create a unique PRNG for each planet so they remain deterministic
        const planetSeed = hashString(`${coordinate}_P${i}`);
        const pRng = mulberry32(planetSeed);

        const planetType = getRandomItem(planetTypes, pRng);

        let pName = '';
        for (let j = 0; j < (Math.floor(pRng() * 2) + 2); j++) {
            pName += getRandomItem(nameSyllables, pRng);
        }
        pName = pName.charAt(0).toUpperCase() + pName.slice(1) + ` ${i + 1}`;

        // Determine if it has advanced civilization (for settlements/economy)
        const hasCivilization = pRng() > 0.7;

        // Number of moons
        const numMoons = (planetType === 'Gas Giant') ? Math.floor(pRng() * 6) + 1 : Math.floor(pRng() * 3);
        const moons = Array.from({ length: numMoons }, (_, mIdx) => `Moon ${mIdx + 1}`);

        planets.push({
            planetId: `${coordinate}_P${i}`,
            planetName: pName,
            planetType: planetType,
            planetColor: getRandomItem(['#8B4513', '#2E8B57', '#4682B4', '#D2B48C', '#A0522D', '#708090'], pRng),
            gravity: (pRng() * 2 + 0.5).toFixed(2),
            orbitalPeriod: Math.floor(pRng() * 800) + 50,

            // Nested generation passing the planet-specific PRNG
            atmosphere: generateAtmosphere(planetType, pRng),
            conditions: generateConditions(planetType, pRng),
            faunaList: generateFauna(planetType, pRng),
            floraList: generateFlora(planetType, pRng),
            resourceList: generateResources(planetType, pRng),
            inhabitants: generateInhabitants(planetType, hasCivilization, pRng),
            settlements: generateSettlements(hasCivilization, pRng),

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