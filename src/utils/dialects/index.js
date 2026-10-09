// utils/dialects/index.js

import { starDialect } from './starDialect.js';
import { floraDialect } from './floraDialect.js';
import { faunaDialect } from './faunaDialect.js';
import { planetDialect } from './planetDialect.js';
import { mineralDialect } from './mineralDialect.js';
import { settlementDialect } from './settlementDialect.js';

export const DIALECTS = {
  star: starDialect,
  flora: floraDialect,
  fauna: faunaDialect,
  planet: planetDialect,
  mineral: mineralDialect,
  settlement: settlementDialect
};

export const ENTITY_ROUTER = {
  'star': 'star',
  'moon': 'star',
  'flora': 'flora',

  // --- PLANETS ---
  'planet_rocky': 'planet',
  'planet_gas giant': 'planet',
  'planet_ice world': 'planet',
  'planet_exotic': 'planet',
  'planet_oceanic': 'planet',
  'planet_volcanic': 'planet',
  'planet_barren': 'planet',
  'planet_crystaline': 'planet',
  'planet_radiated': 'planet',
  'planet_artificial': 'planet',

  // --- FAUNA ---
  'species_rocky': 'fauna',
  'species_ice world': 'fauna',
  'species_gas giant': 'fauna',
  'species_oceanic': 'fauna',
  'species_exotic': 'fauna',
  'species_volcanic': 'fauna',
  'species_barren': 'fauna',
  'species_crystaline': 'fauna',
  'species_radiated': 'fauna',
  'species_artificial': 'fauna',

  // --- MINERALS ---
  'mineral_common': 'mineral',
  'mineral_uncommon': 'mineral',
  'mineral_rare': 'mineral',
  'mineral_legendary': 'mineral',
  'mineral_mythic': 'mineral',

  // --- SETTLEMENTS ---
  'settlement': 'settlement'
};