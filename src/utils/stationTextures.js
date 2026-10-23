import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const stationCache = {
    military: [],
    scientific: [],
    biological: [],
    covert: [],
    bureaucratic: [],
    general: []
};

export const loadStationTextures = async () => {
    const { data, error } = await supabase.storage.from('station-textures').list();
    if (error) {
        console.error("Error loading station textures:", error);
        return;
    }

    // Clear existing cache arrays before reloading
    Object.keys(stationCache).forEach(key => stationCache[key] = []);

    data.forEach(file => {
        if (!file.name.endsWith('.jpg') && !file.name.endsWith('.png')) return;

        // Parse theme from filename (e.g., "military_station_173000000.jpg")
        const theme = file.name.split('_')[0].toLowerCase();
        const { data: urlData } = supabase.storage.from('station-textures').getPublicUrl(file.name);

        if (stationCache[theme] !== undefined) {
            stationCache[theme].push(urlData.publicUrl);
        } else {
            stationCache.general.push(urlData.publicUrl);
        }
    });
};

export const getStationTexture = (theme, stationId) => {
    const normalizedTheme = theme?.toLowerCase() || 'general';
    const textures = stationCache[normalizedTheme]?.length > 0
        ? stationCache[normalizedTheme]
        : stationCache['general'];

    if (!textures || textures.length === 0) return null;
    if (!stationId) return textures[0];

    // Deterministic selection based on the stationId string
    let hash = 0;
    for (let i = 0; i < stationId.length; i++) {
        hash = stationId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % textures.length;
    return textures[index];
};

export const subscribeToStationTextures = (onUpdate) => {
    const channel = supabase.channel('station-texture-changes')
        .on(
            'postgres_changes',
            { event: '*', schema: 'storage', table: 'objects', filter: `bucket_id=eq.station-textures` },
            () => {
                loadStationTextures().then(() => {
                    if (onUpdate) onUpdate();
                });
            }
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
};