import { atmosphereProfiles } from '../libraries/atmospheres.js';
import { weatherNames, temperatureNames, nightTemperatureNames, windNames, toxicityNames, radiationLevelNames } from '../libraries/conditions.js';
// Removed: nameSyllables
import { behaviorTypes, lifeformTypes, biomes, faunaDensityByPlanetType } from '../libraries/fauna.js';
// Removed: prefixes, middles, suffixes
import { floraTypes, utilities, appearances, rarityTable, typeFloraPresence } from '../libraries/flora.js';
// Removed: mineralNames
import { rarities, mineralPools } from '../libraries/resources.js';
import { economyNames } from '../libraries/economies.js';
import { industryTypes } from '../libraries/industries.js';
import { settlementThemes, settlementNames } from '../libraries/settlements.js';
import { inhabitantList } from '../libraries/inhabitants.js';

import { getRandomItem, getWeightedItem } from './randomUtils.js';

// NEW: Bring in the linguistic engine
import { generateName } from './proceduralLanguage.js';

// ==========================================
// ATMOSPHERE GENERATOR
// ==========================================
export function generateAtmosphere(planetType, rng) {
    // If the exact type isn't found, default to 'Rocky' or an empty array
    const profileOptions = atmosphereProfiles[planetType] || atmosphereProfiles['Rocky'];

    if (!profileOptions || profileOptions.length === 0) return [];

    // Pick one random profile setup from the array deterministically
    return getRandomItem(profileOptions, rng).elements;
}

// ==========================================
// CONDITIONS GENERATOR
// ==========================================
// Modified your existing parallel array logic to use rng
function getWeightedCondition(rng, options, weights) {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const roll = rng() * totalWeight;
    let acc = 0;
    for (let i = 0; i < options.length; i++) {
        acc += weights[i];
        if (roll <= acc) return options[i];
    }
    return options[options.length - 1];
}

export function generateConditions(type, rng) {
    const conditions = {};

    switch (type) {
        case "Ice World":
            conditions.weather = getWeightedCondition(rng, weatherNames, [1, 1, 1, 1, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
            conditions.temperature = getWeightedCondition(rng, temperatureNames, [1, 1, 5, 3, 1, 1, 3, 1, 1, 1, 1]);
            conditions.nightTemperature = getWeightedCondition(rng, nightTemperatureNames, [1, 3, 3, 3, 2, 1, 1, 2, 1, 2, 1]);
            conditions.wind = getWeightedCondition(rng, windNames, [1, 1, 1, 1, 3, 1, 1, 2, 1, 1, 1]);
            conditions.toxicity = getWeightedCondition(rng, toxicityNames, [1, 3, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
            conditions.radiation = getWeightedCondition(rng, radiationLevelNames, [1, 3, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
            break;
        case "Gas Giant":
            conditions.weather = getWeightedCondition(rng, weatherNames, [1, 1, 1, 1, 1, 1, 1, 5, 1, 1, 1, 1, 1, 1, 1]);
            conditions.temperature = getWeightedCondition(rng, temperatureNames, [1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1]);
            conditions.nightTemperature = getWeightedCondition(rng, nightTemperatureNames, [1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1]);
            conditions.wind = getWeightedCondition(rng, windNames, [1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1]);
            conditions.toxicity = getWeightedCondition(rng, toxicityNames, [1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
            conditions.radiation = getWeightedCondition(rng, radiationLevelNames, [1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
            break;
        // ... include your other specific cases here (Volcanic, Exotic, etc)
        default:
            conditions.weather = getWeightedCondition(rng, weatherNames, Array(weatherNames.length).fill(1));
            conditions.temperature = getWeightedCondition(rng, temperatureNames, Array(temperatureNames.length).fill(1));
            conditions.nightTemperature = getWeightedCondition(rng, nightTemperatureNames, Array(nightTemperatureNames.length).fill(1));
            conditions.wind = getWeightedCondition(rng, windNames, Array(windNames.length).fill(1));
            conditions.toxicity = getWeightedCondition(rng, toxicityNames, Array(toxicityNames.length).fill(1));
            conditions.radiation = getWeightedCondition(rng, radiationLevelNames, Array(radiationLevelNames.length).fill(1));
    }
    return conditions;
}

// ==========================================
// FAUNA GENERATOR
// ==========================================
export function generateFauna(planetType, rng) {
    const density = faunaDensityByPlanetType[planetType] || 'none';
    if (density === 'none') return [];

    let speciesCount = 0;
    if (density === 'sparse') speciesCount = Math.floor(rng() * 3) + 1;
    if (density === 'moderate') speciesCount = Math.floor(rng() * 5) + 3;
    if (density === 'abundant') speciesCount = Math.floor(rng() * 10) + 5;
    if (density === 'aquaticOnly' || density === 'bizarreOnly' || density === 'syntheticOnly') {
        speciesCount = Math.floor(rng() * 4) + 1;
    }

    const faunaList = [];
    for (let i = 0; i < speciesCount; i++) {
        let typeObj = getRandomItem(lifeformTypes, rng);
        let biomeStr = getRandomItem(biomes, rng);
        const behaviorStr = getRandomItem(behaviorTypes, rng);

        // 1. Enforce planetary ecosystem constraints
        if (density === 'aquaticOnly') {
            biomeStr = rng() > 0.5 ? 'marine' : 'amphibious';
        } else if (density === 'syntheticOnly') {
            typeObj = { type: 'synthetic', name: 'Synthetic' };
        } else if (density === 'bizarreOnly') {
            const bizarreTypes = [
                { type: 'plantimal', name: 'Plantimal' },
                { type: 'hybrid', name: 'Hybrid' },
                { type: 'cephalopod', name: 'Cephalopod' }
            ];
            typeObj = getRandomItem(bizarreTypes, rng);
        }

        // THE VORTEX: Generate a species name based on the planet's ecosystem!
        // We pass the planetType so an Ice World creature gets a different dialect than a Volcanic one
        const speciesName = generateName(rng, `species_${planetType.toLowerCase()}`);

        const behaviorUI = behaviorStr.charAt(0).toUpperCase() + behaviorStr.slice(1);
        const biomeUI = biomeStr.charAt(0).toUpperCase() + biomeStr.slice(1);

        const legOptions = [0, 1, 2, 4, 6, 8];
        const legs = (typeObj.name === 'Avian' || typeObj.name === 'Synthetic') ? 2 : getRandomItem(legOptions, rng);
        const laysEggs = typeObj.name === 'Mammal' ? false : rng() > 0.4;

        const description = `A ${behaviorStr} ${typeObj.name.toLowerCase()} that prefers the ${biomeStr} biome.`;

        faunaList.push({
            name: speciesName,
            type: typeObj.name,
            behavior: behaviorUI,
            biome: biomeUI,
            legs: legs,
            laysEggs: laysEggs,
            description: description
        });
    }

    return faunaList;
}

// ==========================================
// FLORA GENERATOR
// ==========================================
export function generateFlora(planetType, rng) {
    const rules = typeFloraPresence[planetType] || { count: [0, 0] };
    const minCount = rules.count[0];
    const maxCount = rules.count[1];

    if (maxCount === 0) return [];

    const count = Math.floor(rng() * (maxCount - minCount + 1)) + minCount;
    const floraList = [];

    for (let i = 0; i < count; i++) {
        // THE VORTEX: Procedural plant names
        const plantName = generateName(rng, 'flora');

        let typeObj = getRandomItem(floraTypes, rng);
        let appearance = getRandomItem(appearances, rng);

        if (rules.marineOnly) typeObj = { name: 'Seaweed' };
        if (rules.specialAppearance) appearance = rules.specialAppearance;
        if (rules.synthetic) typeObj = { name: 'Synthetic Growth' };

        floraList.push({
            name: plantName,
            type: typeObj.name,
            appearance: appearance,
            utility: getRandomItem(utilities, rng),
            rarity: getRandomItem(rarityTable, rng)
        });
    }

    return floraList;
}

// ==========================================
// RESOURCES GENERATOR
// ==========================================
// ==========================================
// RESOURCES GENERATOR
// ==========================================
export function generateResources(planetType, rng) {
    const pool = mineralPools[planetType] || mineralPools['Rocky'];
    if (!pool || pool.length === 0) return [];

    // Determine how many resource nodes exist on the planet
    const count = Math.floor(rng() * 4) + 2;
    const resourceList = [];

    for (let i = 0; i < count; i++) {
        // 1. Pick a base material from the planet's specific pool
        const baseMaterial = getRandomItem(pool, rng);

        // 2. Pick a rarity deterministically
        const rarity = getWeightedItem(rng, rarities).name;

        // 3. THE VORTEX: Generate mineral names purely through math!
        const specificName = generateName(rng, `mineral_${rarity}`);

        resourceList.push({
            baseMaterial: baseMaterial,
            specificName: specificName,
            rarity: rarity
        });
    }

    return resourceList;
}

// ==========================================
// ECONOMY & INDUSTRY GENERATORS
// ==========================================
export function generateEconomy(isAdvancedCivilization, rng) {
    if (!isAdvancedCivilization) return null;
    return getRandomItem(economyNames, rng);
}

export function generateIndustry(isAdvancedCivilization, rng) {
    if (!isAdvancedCivilization) return null;
    return getRandomItem(industryTypes, rng);
}

// ==========================================
// INHABITANT GENERATOR
// ==========================================
// ==========================================
// INHABITANT GENERATOR (Demographics)
// ==========================================
export function generateInhabitants(planetType, hasInhabitants, rng) {
    if (!hasInhabitants) return [];

    const demographics = [];

    // 1. Determine Native Species (Must match planet type)
    const nativeCandidates = inhabitantList.filter(inh => inh.homePlanetType.includes(planetType));
    if (nativeCandidates.length > 0) {
        const native = getRandomItem(nativeCandidates, rng);
        demographics.push({ ...native, status: 'Native' });
    }

    // 2. Determine Settler Species (Must have canSettle === true)
    const settlerCandidates = inhabitantList.filter(inh => inh.canSettle === true);
    // Filter out the native species from the settler pool so they don't duplicate
    const availableSettlers = settlerCandidates.filter(inh =>
        !demographics.some(d => d.inhabitantId === inh.inhabitantId)
    );

    const numSettlers = Math.floor(rng() * 4); // 0 to 3 additional settlers
    for (let i = 0; i < numSettlers && availableSettlers.length > 0; i++) {
        const idx = Math.floor(rng() * availableSettlers.length);
        const settler = availableSettlers.splice(idx, 1)[0];
        demographics.push({ ...settler, status: 'Settler' });
    }

    if (demographics.length === 0) return [];

    // 3. Distribute Percentages (Must equal exactly 100%)
    let remainingPercentage = 100;
    for (let i = 0; i < demographics.length; i++) {
        if (i === demographics.length - 1) {
            // The last group gets whatever is left
            demographics[i].percentage = remainingPercentage;
        } else if (i === 0) {
            // The primary group gets the majority (50% to 85%)
            const pct = Math.floor(rng() * 36) + 50;
            demographics[i].percentage = pct;
            remainingPercentage -= pct;
        } else {
            // Middle groups get a random chunk of the remaining
            const max = remainingPercentage - (demographics.length - 1 - i);
            const pct = Math.floor(rng() * (max * 0.6)) + 1;
            demographics[i].percentage = pct;
            remainingPercentage -= pct;
        }
    }

    // Assign the societal type to the dominant/primary species to drive the economy
    demographics[0].currentSociety = getRandomItem(demographics[0].societalTypes, rng);

    return demographics;
}

// ==========================================
// SETTLEMENT GENERATOR
// ==========================================
export function generateSettlements(isAdvancedCivilization, rng) {
    // If you want "Tribal Clans" or "Primitive" inhabitants to have basic
    // settlements (like Scavenger or Agrarian camps), you could change this 
    // to check if (inhabitants) instead. For strict advanced cities only:
    if (!isAdvancedCivilization) return [];

    const numSettlements = Math.floor(rng() * 4) + 1;
    const settlements = [];
    const availableNames = [...settlementNames];
    const themeKeys = Object.keys(settlementThemes);

    for (let i = 0; i < numSettlements; i++) {
        let name = "Outpost";
        if (availableNames.length > 0) {
            const nameIdx = Math.floor(rng() * availableNames.length);
            name = availableNames.splice(nameIdx, 1)[0];
        }

        const themeName = getRandomItem(themeKeys, rng);
        const themeData = settlementThemes[themeName];
        const condition = getRandomItem(themeData.condition, rng);

        const numBuildings = Math.floor(rng() * 3) + 2;
        const availableBuildings = [...themeData.buildings];
        const selectedBuildings = [];

        for (let b = 0; b < numBuildings && availableBuildings.length > 0; b++) {
            const bIdx = Math.floor(rng() * availableBuildings.length);
            selectedBuildings.push(availableBuildings.splice(bIdx, 1)[0]);
        }

        const population = i === 0
            ? Math.floor(rng() * 200000) + 50000
            : Math.floor(rng() * 49000) + 1000;

        settlements.push({
            name: name,
            isCapital: i === 0,
            population: population,
            theme: themeName,
            condition: condition,
            buildings: selectedBuildings
        });
    }

    return settlements;
}