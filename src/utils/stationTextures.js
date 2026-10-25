import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const stationCache = {
    military: [],
    scientific: [],
    biological: [],
    covert: [],
    bureaucratic: [],
    industrial: [],
    luxury: [],
    mining: [],
    research: [],
    trade: [],
    transportation: [],
    general: [],
    all: [], // Master fallback pool
};

export const loadStationTextures = async (onComplete) => {
    const { data, error } = await supabase.storage
        .from("station-textures")
        .list();
    //console.log("📦 Raw Supabase station-textures list():", { data, error });

    if (error) {
        console.error("❌ Error listing station-textures bucket:", error);
        return;
    }

    // Reset cache arrays
    Object.keys(stationCache).forEach((key) => {
        stationCache[key] = [];
    });

    (data || []).forEach((file) => {
        if (!file.name || file.name === ".emptyFolderPlaceholder") return;
        if (!file.name.endsWith(".jpg") && !file.name.endsWith(".png")) return;

        const theme = file.name.split("_")[0].toLowerCase();
        const { data: urlData } = supabase.storage
            .from("station-textures")
            .getPublicUrl(file.name);

        if (urlData?.publicUrl) {
            if (!stationCache[theme]) {
                stationCache[theme] = [];
            }
            stationCache[theme].push(urlData.publicUrl);
            stationCache.all.push(urlData.publicUrl);
        }
    });

    // console.log(
    //     `🛰️ Loaded ${stationCache.all.length} station textures across themes:`,
    //     stationCache
    // );
    if (onComplete) onComplete(stationCache.all.length);
};

export const getStationTexture = (theme, stationSeed) => {
    if (stationCache.all.length === 0) return null;

    const cleanTheme = (theme || "general").toLowerCase().trim().split(/\s+/)[0];

    let pool = stationCache[cleanTheme];
    if (!pool || pool.length === 0) {
        pool =
            stationCache.general.length > 0 ? stationCache.general : stationCache.all;
    }

    const seedStr = String(stationSeed || cleanTheme);
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
        hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash) % pool.length;
    return pool[index];
};

export const subscribeToStationTextures = (onUpdate) => {
    const channel = supabase
        .channel(`station-texture-changes-${Date.now()}`)
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "storage",
                table: "objects",
                filter: "bucket_id=eq.station-textures",
            },
            () => {
                loadStationTextures((count) => {
                    if (onUpdate) onUpdate(count);
                });
            }
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
};