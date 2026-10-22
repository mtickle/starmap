const StationOrbit = ({ station, idx, totalStations, tiltAngle }) => {
    if (!station) return null;

    // Space multiple stations evenly around the star
    const angle = (idx * (360 / totalStations)) % 360;

    return (
        <div
            className="absolute inset-0 m-auto aspect-square pointer-events-none"
            style={{
                width: "20%",
                transform: `rotate(${angle}deg)`,
                transformStyle: "preserve-3d",
            }}
        >
            <div
                className="w-full h-full rounded-full border border-red-500/30 border-dashed"
                style={{
                    animation: "orbit-spin 18s linear infinite reverse",
                    transformStyle: "preserve-3d",
                }}
            >
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
                    style={{ transformStyle: "preserve-3d" }}
                >
                    <div style={{ animation: "orbit-spin 18s linear infinite", transformStyle: "preserve-3d" }}>
                        <div style={{ transform: `rotate(-${angle}deg)`, transformStyle: "preserve-3d" }}>
                            <div style={{ transform: `rotateX(-${tiltAngle}deg)` }}>
                                {/* STATION VISUAL & TOOLTIP */}
                                <div className="relative group flex items-center justify-center pointer-events-auto cursor-help z-40">
                                    <div
                                        className="w-6 h-6 bg-gray-950 border border-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.4)] rotate-45 flex items-center justify-center"
                                    >
                                        <div className="w-1.5 h-1.5 bg-red-400 animate-pulse rounded-full"></div>
                                    </div>

                                    <div className="absolute top-[120%] left-1/2 -translate-x-1/2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-red-950/90 text-xs px-3 py-1 rounded border border-red-900 pointer-events-none shadow-xl z-50">
                                        <p className="font-bold text-red-200 mb-0.5">{station.name}</p>
                                        <p className="text-[9px] text-red-400 uppercase tracking-widest">{station.type}</p>
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