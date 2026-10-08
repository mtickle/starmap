// libraries/planets.js

export const PLANET_TYPES = {
  ROCKY: "Rocky",
  GAS_GIANT: "Gas Giant",
  ICE_WORLD: "Ice World",
  EXOTIC: "Exotic",
  OCEANIC: "Oceanic",
  VOLCANIC: "Volcanic",
  BARREN: "Barren",
  CRYSTALLINE: "Crystaline",
  RADIATED: "Radiated",
  ARTIFICIAL: "Artificial",
};

export const planetTypes = [
  { type: PLANET_TYPES.ROCKY, color: "#A0AEC0", weight: 0.25 },
  { type: PLANET_TYPES.GAS_GIANT, color: "#F6AD55", weight: 0.2 },
  { type: PLANET_TYPES.ICE_WORLD, color: "#90CDF4", weight: 0.15 },
  { type: PLANET_TYPES.EXOTIC, color: "#ED64A6", weight: 0.1 },
  { type: PLANET_TYPES.OCEANIC, color: "#63B3ED", weight: 0.1 },
  { type: PLANET_TYPES.VOLCANIC, color: "#FC8181", weight: 0.05 },
  { type: PLANET_TYPES.BARREN, color: "#CBD5E0", weight: 0.05 },
  { type: PLANET_TYPES.CRYSTALLINE, color: "#B794F4", weight: 0.05 },
  { type: PLANET_TYPES.RADIATED, color: "#FBB6CE", weight: 0.03 },
  { type: PLANET_TYPES.ARTIFICIAL, color: "#F0E68C", weight: 0.02 },
];
