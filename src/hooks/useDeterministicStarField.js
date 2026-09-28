import { useMemo } from 'react';
import { synthesizeStar } from '../utils/starUtils.js';

// Simple string hashing function to seed mulberry32
function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = Math.imul(31, hash) + str.charCodeAt(i) | 0;
    }
    return hash;
}

// Mulberry32 PRNG (same as your engine)
function mulberry32(a) {
    return function () {
        var t = a += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

export const useDeterministicStarField = ({ offsetX, offsetY, canvasWidth, canvasHeight, scale }) => {
    const SECTOR_SIZE = 150; // Distance between grid checks
    const STAR_DENSITY = 0.12; // 12% chance a sector contains a star
    const Z_PLANE = 0; // Locking to a 2D galactic plane

    return useMemo(() => {
        if (!canvasWidth || !canvasHeight) return [];

        const stars = [];

        // 1. Calculate the visible grid based on camera position and zoom
        const startX = Math.floor(((-canvasWidth / 2) - offsetX) / scale / SECTOR_SIZE) - 1;
        const endX = Math.ceil(((canvasWidth / 2) - offsetX) / scale / SECTOR_SIZE) + 1;
        const startY = Math.floor(((-canvasHeight / 2) - offsetY) / scale / SECTOR_SIZE) - 1;
        const endY = Math.ceil(((canvasHeight / 2) - offsetY) / scale / SECTOR_SIZE) + 1;

        // 2. Iterate over the visible grid cells
        for (let x = startX; x <= endX; x++) {
            for (let y = startY; y <= endY; y++) {
                const coordinate = `X:${x}_Y:${y}_Z:${Z_PLANE}`;
                const seed = hashString(coordinate);
                const rng = mulberry32(seed);

                // 3. Roll to see if a star spawns in this sector
                if (rng() < STAR_DENSITY) {
                    // Randomize the exact X/Y position within the sector
                    const exactX = (x * SECTOR_SIZE) + (rng() * SECTOR_SIZE);
                    const exactY = (y * SECTOR_SIZE) + (rng() * SECTOR_SIZE);

                    // Generate the star's metadata using your existing engine
                    const fullSystem = synthesizeStar(coordinate);

                    stars.push({
                        id: coordinate,
                        x: exactX,
                        y: exactY,
                        // Pull specific rendering properties from your generated system
                        name: fullSystem.name,
                        type: fullSystem.type,
                        color: fullSystem.color,
                        size: fullSystem.size,
                        faction: fullSystem.faction,
                        fullData: fullSystem // Cache the payload for clicking
                    });
                }
            }
        }
        return stars;
    }, [offsetX, offsetY, canvasWidth, canvasHeight, scale]);
};