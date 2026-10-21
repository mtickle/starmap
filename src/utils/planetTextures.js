// @utils/planetTextures.js

// 1. Tell Vite to find all the JPGs in your public textures folder
const textureModules = import.meta.glob('/src/assets/textures/*.jpg', {
  eager: true,
  query: '?url',
  import: 'default'
});

const textureLibrary = Object.keys(textureModules).reduce((acc, path) => {
  const filename = path.split('/').pop();
  const typeKey = filename.replace(/_\d+\.jpg$/, '').toLowerCase();

  // Vite will automatically compile these to the correct hashed URL for the browser
  if (!acc[typeKey]) acc[typeKey] = [];
  acc[typeKey].push(textureModules[path]);

  return acc;
}, {});

console.log("📚 Loaded Procedural Textures:", textureLibrary);

export const getPlanetTexture = (planetType, planetName = "") => {
  if (!planetType) return null;

  // Normalize the type (e.g., "Gas Giant" -> "gas_giant")
  const formattedKey = planetType.toLowerCase().replace(/\s+/g, '_');
  const available = textureLibrary[formattedKey] || [];

  // If we haven't generated a texture for this biome yet, return null so it falls back to a solid color
  if (available.length === 0) return null;

  // Use the planet's name to deterministically pick a texture from the array
  // This ensures "Pyrium" always gets the exact same Arid texture every time
  const seed = Math.abs([...planetName].reduce((acc, char) => acc + char.charCodeAt(0), 0));
  const index = seed % available.length;

  return available[index];
};