import { getStationTexture } from "@utils/stationTextures.js";

const StationCard = ({ station, idx = 0, onClose }) => {
    if (!station) return null;

    const displayName =
        station.stationName || station.name || `Orbital Hub ${idx + 1}`;
    const themeType = (
        station.stationType ||
        station.type ||
        "general"
    ).toLowerCase();
    const seed = station.id || station.stationId || displayName;

    const textureUrl = getStationTexture(themeType, seed);

    // Exact schema bindings from StarSystemViewer
    const stationSize = station.stationSize;
    const crew = station.crew ?? 0;
    const transit = station.inhabitants ?? 0;
    const dockingRings = station.dockingRings ?? 0;
    const storageCapacity = (station.storageCapacity || 0).toLocaleString();
    const fuelLevel = station.fuelLevel ?? 0;
    const defenseSystems = station.defenseSystems || [];

    const isLowFuel = fuelLevel < 25;
    const isTactical = ["military", "covert"].includes(themeType);
    const isSciBio = ["scientific", "research", "biological"].includes(themeType);

    return (
        <div className="bg-gray-900/90 rounded-xl border border-gray-800 hover:border-red-900/60 transition-all overflow-hidden flex flex-col shadow-xl backdrop-blur-sm">
            <style>
                {`
          @keyframes station-slow-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
            </style>

            {/* 1. TOP-DOWN SPRITE VIEWPORT HEADER */}
            <div className="relative h-56 w-full bg-gradient-to-b from-[#09050a] via-[#170d1c] to-gray-900 border-b border-gray-800/80 flex items-center justify-center overflow-hidden">
                {/* Tactical Radar Grid Backdrop */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.07)_1px,transparent_1px)] bg-[size:18px_18px] opacity-50 pointer-events-none" />
                <div className="absolute w-44 h-44 rounded-full border border-red-500/15 border-dashed pointer-events-none" />
                <div className="absolute w-32 h-32 rounded-full border border-red-500/10 pointer-events-none" />

                {onClose && (
                    <button
                        onClick={onClose}
                        className="absolute top-3 left-3 text-gray-400 hover:text-white flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors bg-gray-950/70 px-2.5 py-1 rounded border border-gray-700 hover:border-gray-500 z-40"
                    >
                        <span>←</span> Abort Lock
                    </button>
                )}

                {/* Station Theme & Size Badge */}
                <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 bg-gray-950/85 border border-red-900/50 px-2.5 py-1 rounded text-[10px] font-mono uppercase tracking-wider text-red-300 backdrop-blur">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_6px_rgba(239,68,68,0.8)]" />
                    <span>
                        {themeType}
                        {stationSize ? ` • Size ${stationSize}` : ""}
                    </span>
                </div>

                {/* Station 2D Sprite with Feathered Radial Mask */}
                <div className="relative flex items-center justify-center w-36 h-36 z-20">
                    <div className="absolute inset-4 rounded-full bg-red-500/10 blur-md pointer-events-none" />
                    {textureUrl ? (
                        <img
                            src={textureUrl}
                            alt={displayName}
                            className="w-32 h-32 rounded-full object-cover mix-blend-screen contrast-125 brightness-110"
                            style={{
                                animation: "station-slow-spin 90s linear infinite",
                                WebkitMaskImage:
                                    "radial-gradient(circle, rgba(0,0,0,1) 52%, rgba(0,0,0,0) 74%)",
                                maskImage:
                                    "radial-gradient(circle, rgba(0,0,0,1) 52%, rgba(0,0,0,0) 74%)",
                            }}
                        />
                    ) : (
                        <div className="w-10 h-10 bg-gray-950 border border-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.4)] rotate-45 flex items-center justify-center">
                            <div className="w-2.5 h-2.5 bg-red-400 animate-pulse rounded-full" />
                        </div>
                    )}
                </div>

                {/* Bottom Viewport Title Overlay */}
                <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end z-30 pointer-events-none">
                    <div>
                        <div className="text-[9px] font-mono uppercase tracking-widest text-red-400/80">
                            Heliocentric Outer Perimeter
                        </div>
                        <h3 className="text-lg font-bold text-white tracking-wide leading-tight">
                            {displayName}
                        </h3>
                    </div>
                    <span className="text-[10px] font-mono text-gray-300 bg-gray-950/80 border border-gray-800 px-2 py-0.5 rounded">
                        {dockingRings} {dockingRings === 1 ? "Ring" : "Rings"}
                    </span>
                </div>
            </div>

            {/* 2. TELEMETRY & DETAILS BODY */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                {/* Status Pills */}
                <div className="flex flex-wrap gap-1.5">
                    {isLowFuel ? (
                        <span className="px-2 py-0.5 rounded bg-red-950/50 text-red-400 text-[10px] uppercase tracking-widest font-semibold border border-red-800/50">
                            Low Reserves
                        </span>
                    ) : (
                        <span className="px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-300 text-[10px] uppercase tracking-widest font-semibold border border-emerald-700/50">
                            Operational
                        </span>
                    )}

                    {isTactical ? (
                        <span className="px-2 py-0.5 rounded bg-red-950/50 text-red-300 text-[10px] uppercase tracking-widest font-semibold border border-red-700/50">
                            High Security
                        </span>
                    ) : isSciBio ? (
                        <span className="px-2 py-0.5 rounded bg-cyan-950/50 text-cyan-300 text-[10px] uppercase tracking-widest font-semibold border border-cyan-700/50">
                            Research Clearance
                        </span>
                    ) : (
                        <span className="px-2 py-0.5 rounded bg-blue-950/50 text-blue-300 text-[10px] uppercase tracking-widest font-semibold border border-blue-700/50">
                            Open Transponder
                        </span>
                    )}

                    {defenseSystems.length > 0 && (
                        <span className="px-2 py-0.5 rounded bg-purple-900/40 text-purple-300 text-[10px] uppercase tracking-widest font-semibold border border-purple-700/50">
                            Armed ({defenseSystems.length})
                        </span>
                    )}
                </div>

                {/* Population & Logistics Grid */}
                <div className="grid grid-cols-2 gap-2.5 font-mono">
                    <div className="bg-gray-950/60 rounded p-2.5 border border-gray-800/80">
                        <p className="text-[10px] text-gray-500 uppercase mb-1">
                            Population
                        </p>
                        <p className="text-xs font-semibold text-gray-200">
                            {crew.toLocaleString()}{" "}
                            <span className="text-[10px] text-gray-500 font-normal">
                                Crew
                            </span>
                        </p>
                        <p className="text-xs font-semibold text-gray-300 mt-0.5">
                            {transit.toLocaleString()}{" "}
                            <span className="text-[10px] text-gray-500 font-normal">
                                Transit
                            </span>
                        </p>
                    </div>

                    <div className="bg-gray-950/60 rounded p-2.5 border border-gray-800/80">
                        <p className="text-[10px] text-gray-500 uppercase mb-1">
                            Logistics
                        </p>
                        <p className="text-xs font-semibold text-gray-200">
                            {dockingRings}{" "}
                            <span className="text-[10px] text-gray-500 font-normal">
                                Docking Rings
                            </span>
                        </p>
                        <p className="text-xs font-semibold text-amber-300 mt-0.5">
                            {storageCapacity}{" "}
                            <span className="text-[10px] text-gray-500 font-normal">
                                Cap (Eg)
                            </span>
                        </p>
                    </div>
                </div>

                {/* Fuel Reserves Bar */}
                <div className="bg-gray-950/40 border border-gray-800/60 rounded p-2.5">
                    <div className="flex justify-between text-[10px] font-mono uppercase text-gray-400 mb-1.5">
                        <span>Reserves (Fuel)</span>
                        <span
                            className={`font-bold ${isLowFuel ? "text-red-400" : "text-green-400"
                                }`}
                        >
                            {fuelLevel}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-950 h-1.5 rounded-full overflow-hidden border border-gray-800">
                        <div
                            className={`h-full transition-all duration-500 ${isLowFuel ? "bg-red-500" : "bg-green-500"
                                }`}
                            style={{ width: `${Math.min(100, Math.max(0, fuelLevel))}%` }}
                        />
                    </div>
                </div>

                {/* 3. EXPANDABLE ACCORDIONS */}
                <div className="space-y-2 pt-1">
                    {/* Countermeasures Accordion */}
                    <details
                        className="group bg-gray-950/70 rounded border border-gray-800"
                        open={defenseSystems.length > 0}
                    >
                        <summary className="p-2.5 cursor-pointer text-xs font-semibold text-gray-400 hover:text-white hover:bg-gray-800/60 transition-colors list-none flex justify-between items-center">
                            <span>Countermeasures ({defenseSystems.length})</span>
                            <span className="text-gray-600 group-open:rotate-180 transition-transform text-[10px]">
                                ▼
                            </span>
                        </summary>
                        <div className="p-3 border-t border-gray-800 bg-gray-950/90 text-xs">
                            {defenseSystems.length > 0 ? (
                                <div className="flex flex-wrap gap-1.5">
                                    {defenseSystems.map((def, i) => (
                                        <span
                                            key={i}
                                            className="px-2 py-1 bg-blue-950/40 border border-blue-900/50 rounded text-[11px] text-blue-300"
                                        >
                                            {def}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <span className="text-gray-600 text-xs">
                                    No active defense grid detected.
                                </span>
                            )}
                        </div>
                    </details>

                    {/* Station Telemetry Summary Accordion */}
                    <details className="group bg-gray-950/70 rounded border border-gray-800">
                        <summary className="p-2.5 cursor-pointer text-xs font-semibold text-gray-400 hover:text-white hover:bg-gray-800/60 transition-colors list-none flex justify-between items-center">
                            <span>Structural & Orbital Spec</span>
                            <span className="text-gray-600 group-open:rotate-180 transition-transform text-[10px]">
                                ▼
                            </span>
                        </summary>
                        <div className="p-3 border-t border-gray-800 bg-gray-950/90 text-xs space-y-1.5 font-mono">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Classification:</span>
                                <span className="text-gray-300 uppercase">{themeType}</span>
                            </div>
                            {stationSize && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Hull Class:</span>
                                    <span className="text-gray-300">Size {stationSize}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-gray-500">Total Occupancy:</span>
                                <span className="text-gray-300">
                                    {(crew + transit).toLocaleString()} Personnel
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Orbital Track:</span>
                                <span className="text-red-400">95% Outer Perimeter</span>
                            </div>
                        </div>
                    </details>
                </div>
            </div>
        </div>
    );
};

export default StationCard;