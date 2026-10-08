// utils/dialects/index.js
import { cosmicDialect } from './cosmic.js';
import { botanicalDialect } from './botanical.js';

export const DIALECTS = {
    cosmic: cosmicDialect,
    botanical: botanicalDialect
};

export const ENTITY_ROUTER = {
    'star': 'cosmic',
    'moon': 'cosmic',
    // We can map planet types dynamically
    'planet_paradise': 'cosmic',
    'planet_barren': 'cosmic',
    'planet_gas giant': 'cosmic',
    'planet_ice world': 'cosmic',
    'planet_volcanic': 'cosmic',
    'flora': 'botanical'
};