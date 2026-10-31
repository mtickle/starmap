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

  // THE VORTEX: Replaced the manual loop with a single engine call
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

  // Tiny inline fallback for lifeless planets
  const romanNumerals = [
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
  ];

  for (let i = 0; i < numPlanets; i++) {
    const planetId = `${coordinate}_P${i}`;
    const planetSeed = hashString(planetId); // Use it for the seed
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
    let pName = "";
    if (hasCivilization) {
      // Dynamically pass the planet type so toxic planets sound different from paradise planets
      pName = generateName(pRng, `planet_${planetType.toLowerCase()}`);
    } else {
      const suffix = romanNumerals[i] || i + 1;
      pName = `${starName} ${suffix}`;
    }

    const numMoons =
      planetType === "Gas Giant"
        ? Math.floor(pRng() * 6) + 1
        : Math.floor(pRng() * 3);

    // THE VORTEX: Generating actual names for moons instead of "Moon 1"
    const moons = [];
    for (let m = 0; m < numMoons; m++) {
      const moonId = `${planetId}_M${m}`;
      const mRng = mulberry32(hashString(moonId));

      // Roll a type for the moon using the same planet library to support conditions
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
      const hasMoonCiv = mRng() > 0.85; // Lower probability for moon settlements

      // Conditional Naming: Procedural name if inhabited, Roman numeral if barren
      const moonName = hasMoonCiv
        ? generateName(mRng, "moon")
        : `${pName} ${toRoman(m + 1)}`;

      moons.push({
        moonId: moonId,
        moonName: moonName,
        moonType: moonType,
        moonSize: parseFloat((mRng() * 0.3 + 0.05).toFixed(2)), // Scaling factor 
        moonConditions: generateConditions(moonType, mRng),
        moonSettlements: generateSettlements(hasMoonCiv, mRng),
      });
    }

    planets.push({
      planetId: planetId,
      planetName: pName,
      planetType: planetType,
      planetColor: selectedPlanetObj.color,
      gravity: (pRng() * 2 + 0.5).toFixed(2),
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

function toRoman(num) {
  const romans = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
  return romans[num - 1] || `${num}`;
}