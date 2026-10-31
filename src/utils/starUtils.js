import { planetTypes } from "../libraries/planets.js";
import { starClasses } from "../libraries/stars.js";
import { generateStations } from './stationUtils.js';
import { generateSystemFaction } from "./factionUtils.js";
import {
  generateAtmosphere,
  generateConditions,
  generateEconomy,
  generateFauna,
  generateFlora,
  generateIndustry,
  generateInhabitants,
  generateResources,
  generateSettlements,
} from "./planetPropertiesUtils.js";
import { generateName } from "./proceduralLanguage.js";
import { getRandomItem, hashString, mulberry32 } from "./randomUtils.js";

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

  const starName = generateName(rng, "star");
  const starSize = Math.floor(rng() * 10) + 5;

  // 3. Factions & Stations
  const faction = generateSystemFaction(rng);
  const hasStation = rng() > 0.4;
  const stations = hasStation
    ? generateStations(faction, coordinate, starName, rng)
    : [];

  // 4. Generate Planets
  const numPlanets = Math.floor(rng() * 9);
  const planets = [];

  for (let i = 0; i < numPlanets; i++) {
    const planetId = `${coordinate}_P${i}`;
    const planetSeed = hashString(planetId);
    const pRng = mulberry32(planetSeed);

    // Roll for Planet Type
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

    // Naming Logic (Reusing toRoman helper)
    const pName = hasCivilization
      ? generateName(pRng, `planet_${planetType.toLowerCase()}`)
      : `${starName} ${toRoman(i + 1)}`;

    // Calculate gravity early so it can influence satellite capture
    const gravityValue = pRng() * 2 + 0.5; // Ranges from 0.5G to 2.5G
    const gravity = parseFloat(gravityValue.toFixed(2));

    // Determine Moon Count based on Gravity & Type
    let numMoons = 0;
    if (planetType === "Gas Giant") {
      numMoons = Math.floor(pRng() * 8) + 3; // Gas Giants capture 3 to 10 moons
    } else {
      const maxMoons = Math.ceil(gravity * 2);
      numMoons = Math.floor(pRng() * (maxMoons + 1));
    }

    // Generate Moons Array
    const moons = [];
    for (let m = 0; m < numMoons; m++) {
      const moonId = `${planetId}_M${m}`;
      const mRng = mulberry32(hashString(moonId));

      // Roll Moon Type
      const mRoll = mRng();
      let cumulativeM = 0;
      let selectedMoonObj = planetTypes[planetTypes.length - 1];

      for (const pt of planetTypes) {
        cumulativeM += pt.weight;
        if (mRoll <= cumulativeM) {
          selectedMoonObj = pt;
          break;
        }
      }

      const moonType = selectedMoonObj.type;
      const hasMoonCiv = mRng() > 0.85;

      // Conditional Moon Naming
      const moonName = hasMoonCiv
        ? generateName(mRng, "moon")
        : `${pName} ${toRoman(m + 1)}`;

      moons.push({
        moonId: moonId,
        moonName: moonName,
        moonType: moonType,
        moonSize: parseFloat((mRng() * 0.3 + 0.05).toFixed(2)),
        moonConditions: generateConditions(moonType, mRng),
        moonSettlements: generateSettlements(hasMoonCiv, mRng),
      });
    }

    planets.push({
      planetId: planetId,
      planetName: pName,
      planetType: planetType,
      planetColor: selectedPlanetObj.color,
      gravity: gravity.toFixed(2),
      orbitalPeriod: Math.floor(pRng() * 800) + 50,
      rotationalPeriod: parseFloat((pRng() * 92 + 8).toFixed(1)),
      atmosphere: generateAtmosphere(planetType, pRng),
      conditions: generateConditions(planetType, pRng),
      faunaList: generateFauna(planetType, pRng),
      floraList: generateFlora(planetType, pRng),
      resourceList: generateResources(planetType, pRng),
      inhabitants: generateInhabitants(planetType, hasCivilization, pRng),
      settlements: generateSettlements(hasCivilization, pRng),
      economy: generateEconomy(hasCivilization, pRng),
      industry: generateIndustry(hasCivilization, pRng),
      moons: moons,
    });
  }

  return {
    id: coordinate,
    name: starName,
    type: selectedStarClass.type,
    color: selectedStarClass.color,
    size: selectedStarClass.size,
    temperatureDesc: selectedStarClass.temp,
    economy: hasStation
      ? getRandomItem(
        ["Booming", "Destitute", "Developing", "Black Market"],
        rng
      )
      : "None",
    faction: faction,
    stations: stations,
    planets: planets,
  };
}

// --- HELPERS ---
function toRoman(num) {
  const romans = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
  return romans[num - 1] || `${num}`;
}