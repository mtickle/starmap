import { getStationTexture } from '@utils/stationTextures.js';

const StationOrbit = ({ station, idx, totalStations, tiltAngle }) => {
    if (!station) return null;

    const themeType = station.stationType || station.type;
    const displayName = station.stationName || station.name;

    const textureUrl = getStationTexture(
        themeType,
        station.id || displayName || `station-${idx}`
    );

    // Space multiple stations evenly around the star
    const angle = (idx * (360 / totalStations)) % 360;

    return (
        <div
            className="absolute inset-0 m-auto aspect-square pointer-events-none"
            style={{
                width: "95%",
                transform: `rotate(${angle}deg)`,
                transformStyle: "preserve-3d",
            }}
        >
            <div
                className="w-full h-full rounded-full"
                style={{
                    animation: "orbit-spin 80s linear infinite",
                    transformStyle: "preserve-3d",
                }}
            >
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
                    style={{ transformStyle: "preserve-3d" }}
                >
                    <div style={{ animation: "orbit-spin 80s linear infinite reverse", transformStyle: "preserve-3d" }}>
                        <div style={{ transform: `rotate(-${angle}deg)`, transformStyle: "preserve-3d" }}>
                            <div style={{ transform: `rotateX(-${tiltAngle}deg)` }}>

                                <div className="relative group flex items-center justify-center pointer-events-auto cursor-help z-40">
                                    {textureUrl ? (
                                        <div className="relative flex items-center justify-center w-10 h-10 rounded-full">
                                            {/* Subtle ambient glow behind the station instead of box drop-shadow */}
                                            <div className="absolute inset-1 rounded-full bg-red-500/20 blur-sm group-hover:bg-red-500/40 transition-colors" />

                                            {/* Station Sprite with radial feather mask to erase the square JPG box */}
                                            <img
                                                src={textureUrl}
                                                alt={displayName || "Orbital Station"}
                                                className="w-10 h-10 rounded-full object-cover mix-blend-screen contrast-125 brightness-110 animate-[orbit-spin_45s_linear_infinite]"
                                                style={{
                                                    WebkitMaskImage: "radial-gradient(circle, rgba(0,0,0,1) 48%, rgba(0,0,0,0) 72%)",
                                                    maskImage: "radial-gradient(circle, rgba(0,0,0,1) 48%, rgba(0,0,0,0) 72%)",
                                                }}
                                            />

                                            {/* Subtle HUD Ring */}
                                            <div className="absolute inset-0 rounded-full border border-red-500/30 group-hover:border-red-400/80 transition-colors pointer-events-none" />
                                        </div>
                                    ) : (
                                        <div className="w-4 h-4 bg-gray-950 border border-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.4)] rotate-45 flex items-center justify-center">
                                            <div className="w-1 h-1 bg-red-400 animate-pulse rounded-full"></div>
                                        </div>
                                    )}

                                    <div className="absolute top-[120%] left-1/2 -translate-x-1/2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-red-950/90 text-xs px-3 py-1 rounded border border-red-900 pointer-events-none shadow-xl z-50">
                                        <p className="font-bold text-red-200 mb-0.5">{displayName}</p>
                                        <p className="text-[9px] text-red-400 uppercase tracking-widest">{themeType}</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StationOrbit;