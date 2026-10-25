import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const textureCache = {
  all: []
};

export const loadSupabaseTextures = async (onComplete) => {
  const { data, error } = await supabase.storage
    .from("planet-textures")
    .list("", {
      limit: 1000,
      offset: 0,
      sortBy: { column: "name", order: "asc" },
    });

  if (error) {
    console.error("❌ Error listing planet-textures bucket:", error);
    return;
  }

  // Reset texture cache arrays
  Object.keys(textureCache).forEach((key) => {
    if (key !== 'all') textureCache[key] = [];
  });
  textureCache.all = [];

  (data || []).forEach((file) => {
    if (!file.name || file.name === ".emptyFolderPlaceholder") return;
    if (!file.name.endsWith(".jpg") && !file.name.endsWith(".png") && !file.name.endsWith(".webp")) return;

    const type = file.name.split("_")[0].toLowerCase();
    const { data: urlData } = supabase.storage
      .from("planet-textures")
      .getPublicUrl(file.name);

    if (urlData?.publicUrl) {
      if (!textureCache[type]) {
        textureCache[type] = [];
      }
      textureCache[type].push(urlData.publicUrl);
      textureCache.all.push(urlData.publicUrl);
    }
  });

  console.log("🗂️ Supabase: Final Texture Library Dictionary", textureCache);
  if (onComplete) onComplete(textureCache.all.length);
};

export const getPlanetTexture = (planetType, planetSeed) => {
  if (!textureCache || textureCache.all.length === 0) return null;

  const cleanType = (planetType || "arid").toLowerCase().trim().replace(/\s+/g, "_");

  let pool = textureCache[cleanType];

  if (!pool || pool.length === 0) {
    pool = textureCache.arid || textureCache.all;
  }

  if (!pool || pool.length === 0) return null;

  const seedStr = String(planetSeed || cleanType);
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % pool.length;
  return pool[index];
};

export const subscribeToTextures = (onUpdate) => {
  const channel = supabase
    .channel(`planet-texture-changes-${Date.now()}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "storage",
        table: "objects",
        filter: "bucket_id=eq.planet-textures",
      },
      () => {
        loadSupabaseTextures((count) => {
          if (onUpdate) onUpdate(count);
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};