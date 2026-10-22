import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

let textureLibrary = null;
let isLoading = false;
let listeners = [];

export const subscribeToTextures = (callback) => {
  listeners.push(callback);
  return () => { listeners = listeners.filter(cb => cb !== callback); };
};

export const loadSupabaseTextures = async () => {
  if (textureLibrary !== null || isLoading) return;
  isLoading = true;

  try {
    console.log("☁️ Supabase: Requesting file list from root bucket...");

    // Pass no arguments to default to the root directory
    const { data, error } = await supabase.storage.from('planet-textures').list();

    if (error) throw error;

    // Dump the raw array to the console so we can see exactly what Supabase handed back
    console.log(`☁️ Supabase: Found ${data.length} files. Raw Data:`, data);

    textureLibrary = data.reduce((acc, file) => {
      // Skip hidden Supabase files like .emptyFolderPlaceholder
      if (!file.name.includes('_')) return acc;

      // Find the LAST underscore (right before the timestamp) and slice it there
      const lastUnderscoreIdx = file.name.lastIndexOf('_');
      const typeKey = file.name.substring(0, lastUnderscoreIdx).toLowerCase();

      const publicUrl = supabase.storage.from('planet-textures').getPublicUrl(file.name).data.publicUrl;

      if (!acc[typeKey]) acc[typeKey] = [];
      acc[typeKey].push(publicUrl);
      return acc;
    }, {});

    console.log("☁️ Supabase: Final Texture Library Dictionary:", textureLibrary);

  } catch (err) {
    console.error("❌ Supabase fetch failed:", err);
    textureLibrary = {};
  } finally {
    isLoading = false;
    listeners.forEach(cb => cb());
  }
};

export const getPlanetTexture = (planetType, planetName = "") => {
  console.log(`[Texture Hook] Planet: ${planetName}, Type: ${planetType}, Library Ready: ${textureLibrary !== null}`);

  if (!textureLibrary || !planetType) return null;

  const formattedKey = String(planetType).toLowerCase().replace(/\s+/g, '_');
  const available = textureLibrary[formattedKey] || [];

  console.log(`[Texture Hook] 🔍 Seeking: '${formattedKey}'. Found: ${available.length} matching textures.`);

  if (available.length === 0) return null;

  const seed = Math.abs([...planetName].reduce((acc, char) => acc + char.charCodeAt(0), 0));
  const index = seed % available.length;

  return available[index];
};