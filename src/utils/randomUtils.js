// utils/randomUtils.js

// Used for flat arrays like industryTypes
export function getRandomItem(array, rng) {
    if (!Array.isArray(array) || array.length === 0) return null;
    return array[Math.floor(rng() * array.length)];
}

// Used for parallel arrays like your conditions logic
export const getWeightedRandom = (rng, options, weights) => {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const roll = rng() * totalWeight;
    let acc = 0;
    for (let i = 0; i < options.length; i++) {
        acc += weights[i];
        if (roll <= acc) return options[i];
    }
    return options[options.length - 1]; // Fallback
};

export function hashString(str) {
    let h1 = 1779033703, h2 = 3144134277, h3 = 1013904242, h4 = 2773480762;
    for (let i = 0, k; i < str.length; i++) {
        k = str.charCodeAt(i);
        h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
        h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
        h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
        h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    h1 ^= (h2 ^ h3 ^ h4), h2 ^= h1, h3 ^= h1, h4 ^= h1;
    return h1 >>> 0;
}

export function mulberry32(seed) {
    return function () {
        let t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

export function getWeightedItem(rng, items) {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    let target = rng() * totalWeight;

    for (const item of items) {
        target -= item.weight;
        if (target <= 0) return item;
    }
    return items[items.length - 1];
}

export function generateDeterministicUUID(rng) {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.floor(rng() * 16);
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}