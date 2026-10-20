import { PLANET_TYPES } from '../libraries/planets';

// Vite's glob import reads all texture files at build time
const textureModules = import.meta.glob('/public/textures/*.jpg', { eager: true, as: 'url' });

// Normalize keys to map: 'rocky' -> ['/textures/rocky_123.jpg', '/textures/rocky_456.jpg']
const textureLibrary = Object.keys(textureModules).reduce((acc, path) => {
    const filename = path.split('/').pop();
    const typeKey = filename.replace(/_\d+\.jpg$/, ''); // strips the _timestamp.jpg
    const publicPath = path.replace('/public', '');

    if (!acc[typeKey]) acc[typeKey] = [];
    acc[typeKey].push(publicPath);
    return acc;
}, {});

/**
 * Returns a texture URL for a given planet type.
 * If multiple exist, uses planet name or seed to pick deterministically.
 */
export function getPlanetTexture(planetType, seed = 0) {
    const key = Object.keys(PLANET_TYPES)
        .find(k => PLANET_TYPES[k] === planetType);

    const formattedKey = (key || planetType).toLowerCase().replace(/\s+/g, '_');
    const available = textureLibrary[formattedKey] || [];

    if (available.length === 0) return null;

    // Deterministic selection based on seed/name index
    const index = typeof seed === 'number'
        ? seed % available.length
        : Math.abs([...seed].reduce((acc, char) => acc + char.charCodeAt(0), 0)) % available.length;

    return available[index];
}