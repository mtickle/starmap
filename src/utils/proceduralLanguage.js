// utils/proceduralLanguage.js
import { DIALECTS, ENTITY_ROUTER } from './dialects/index.js';

export const generateName = (rng, entityKey) => {
    // 1. Look up the dialect. Fall back to 'cosmic' if it's missing.
    const dialectName = ENTITY_ROUTER[entityKey] || 'cosmic';

    // 2. Grab the actual arrays
    const pool = DIALECTS[dialectName] || DIALECTS.cosmic;

    // 3. Roll the math
    const start = pool.start[Math.floor(rng() * pool.start.length)];
    const hasMiddle = rng() > 0.5;
    const middle = hasMiddle ? pool.middle[Math.floor(rng() * pool.middle.length)] : '';
    const end = pool.end[Math.floor(rng() * pool.end.length)];

    const raw = `${start}${middle}${end}`;
    return raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
};