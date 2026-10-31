import { getStationTexture } from "@utils/stationTextures.js";

/**
 * StationCard
 * 
 * Renders a comprehensive, interactive card for an orbital station.
 * Features a fixed-height split layout: 2D sprite viewport and core stats on the left,
 * scrollable expandable detail accordions on the right.
 *
 * @param {Object} props
 * @param {Object} props.station - The station data payload.
 * @param {number} [props.idx=0] - The index of the station in the system array for fallback naming.
 * @param {Function} [props.onClose] - Optional callback to dismiss the card from a master-detail view.
 */
const StationCard = ({ station, idx = 0, onClose }) => {
    // Fail gracefully if rendered without a data payload
    if (!station) return null;

    // --- DYNAMIC BINDINGS & FORMATTING ---
    const displayName = station.stationName || station.name || `Orbital Hub ${idx + 1}`;
    const themeType = (station.stationType || station.type || "general").toLowerCase();
    const seed = station.id || station.stationId || displayName;

    // Fetch the procedural asset based on the station's functional theme
    const textureUrl = getStationTexture(themeType, seed);

    // Exact schema bindings matching the StarSystemViewer payloads
    const stationSize = station.stationSize;
    const crew = station.crew ?? 0;
    const transit = station.inhabitants ?? 0;
    const dockingRings = station.dockingRings ?? 0;
    const storageCapacity = (station.storageCapacity || 0).toLocaleString();
    const fuelLevel = station.fuelLevel ?? 0;
    const defenseSystems = station.defenseSystems || [];
    const coreRenderSize = 140;

    // --- CONDITIONAL STATE LOGIC ---
    const isLowFuel = fuelLevel < 25;
    const isTactical = ["military", "covert"].includes(themeType);
    const isSciBio = ["scientific", "research", "biological"].includes(themeType);

    return (
        // Root locked to a fixed height of 28rem (448px) to match UnifiedPlanetCard
        <div className="bg-gray-900/90 rounded-xl border border-gray-800 hover:border-red-900/60 transition-all overflow-hidden flex flex-col self-start w-full h-[28rem] shadow-xl backdrop-blur-sm">
            {/* Scoped CSS Animations for radar/sprite rotations */}
            <style>
                {`
                  @keyframes station-slow-spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                  }
                `}
            </style>

            {/* =========================================
                1. CARD HEADER
                ========================================= */}
            <div className="bg-gray-950 border-b border-gray-800 px-4 py-3 flex items-center justify-between shrink-0 relative z-30">

                {/* Optional Abort Button for Master-Detail Views */}
                {onClose && (
                    <button
                        onClick={onClose}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors bg-gray-900 px-2 py-1 rounded border border-gray-700 hover:border-gray-500 z-40"
                    >
                        <span>←</span> Abort Lock
                    </button>
                )}

                {/* Left Side: Station Name */}
                <h2 className={`text-xl font-bold tracking-widest uppercase text-white leading-none ${onClose ? 'ml-24' : ''}`}>
                    {displayName}
                </h2>

                {/* Right Side: Grouped Pills */}
                <div className="flex items-center flex-wrap justify-end gap-2">
                    {/* Station Theme Badge */}
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-gray-900/40 text-gray-300 text-[10px] uppercase tracking-wider font-semibold border border-gray-700/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_6px_rgba(239,68,68,0.8)]" />
                        {themeType}
                    </span>

                    {isLowFuel ? (
                        <span className="px-2 py-0.5 rounded bg-red-950/50 text-red-400 text-[10px] uppercase tracking-wider font-semibold border border-red-800/50 backdrop-blur-md">
                            Low Reserves
                        </span>
                    ) : (
                        <span className="px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-300 text-[10px] uppercase tracking-wider font-semibold border border-emerald-700/50 backdrop-blur-md">
                            Operational
                        </span>
                    )}

                    {isTactical ? (
                        <span className="px-2 py-0.5 rounded bg-red-950/50 text-red-300 text-[10px] uppercase tracking-wider font-semibold border border-red-700/50 backdrop-blur-md">
                            High Security
                        </span>
                    ) : isSciBio ? (
                        <span className="px-2 py-0.5 rounded bg-cyan-950/50 text-cyan-300 text-[10px] uppercase tracking-wider font-semibold border border-cyan-700/50 backdrop-blur-md">
                            Research Clearance
                        </span>
                    ) : (
                        <span className="px-2 py-0.5 rounded bg-blue-950/50 text-blue-300 text-[10px] uppercase tracking-wider font-semibold border border-blue-700/50 backdrop-blur-md">
                            Open Transponder
                        </span>
                    )}

                    {defenseSystems.length > 0 && (
                        <span className="px-2 py-0.5 rounded bg-purple-900/40 text-purple-300 text-[10px] uppercase tracking-wider font-semibold border border-purple-700/50 backdrop-blur-md">
                            Armed ({defenseSystems.length})
                        </span>
                    )}
                </div>
            </div>

            {/* =========================================
                2. SPLIT BODY: Visuals/Stats (Left) + Accordions (Right)
                ========================================= */}
            <div className="flex flex-row flex-1 overflow-hidden bg-gradient-to-b from-[#09050a] via-[#170d1c] to-gray-900">

                {/* --- Left Column (Fixed Width 384px) --- */}
                <div className="w-96 flex flex-col border-r border-gray-800 shrink-0">

                    {/* Top: 2D Sprite Viewport (Stretches to fill available space) */}
                    <div className="relative flex-1 flex flex-col items-center justify-center overflow-hidden">

                        {/* Station 2D Sprite */}
                        <div className="relative flex items-center justify-center w-36 h-36 z-20 -mt-4">
                            <div className="absolute inset-4 rounded-full bg-red-500/10 pointer-events-none" />
                            {textureUrl ? (
                                <img
                                    src={textureUrl}
                                    alt={displayName}
                                    className="rounded-full object-cover mix-blend-screen contrast-125 brightness-110"
                                    style={{
                                        width: `${coreRenderSize}px`,
                                        height: `${coreRenderSize}px`,
                                        animation: "station-slow-spin 90s linear infinite",
                                    }}
                                />
                            ) : (
                                <div
                                    className="bg-gray-950 border border-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.4)] rotate-45 flex items-center justify-center"
                                    style={{
                                        width: `${coreRenderSize / 3}px`,
                                        height: `${coreRenderSize / 3}px`
                                    }}
                                >
                                    <div className="w-2.5 h-2.5 bg-red-400 animate-pulse rounded-full" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bottom: Stacked Core Stats Grid (Logistics, Population, Fuel) */}
                    <div className="p-3 bg-gray-950/80 border-t border-gray-800 shrink-0 space-y-2 font-mono">

                        <div className="grid grid-cols-2 gap-1.5">
                            <div className="bg-gray-900 border border-gray-800 rounded p-1.5 shadow-inner">
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Logistics</p>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-xs font-bold text-gray-200">{dockingRings}</span>
                                    <span className="text-[10px] text-gray-500">Rings</span>
                                </div>
                                <div className="flex justify-between items-baseline mt-0.5">
                                    <span className="text-xs font-bold text-amber-300">{storageCapacity}</span>
                                    <span className="text-[10px] text-gray-500">Cap</span>
                                </div>
                            </div>

                            <div className="bg-gray-900 border border-gray-800 rounded p-1.5 shadow-inner">
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Population</p>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-xs font-bold text-gray-200">{crew.toLocaleString()}</span>
                                    <span className="text-[10px] text-gray-500">Crew</span>
                                </div>
                                <div className="flex justify-between items-baseline mt-0.5">
                                    <span className="text-xs font-bold text-gray-300">{transit.toLocaleString()}</span>
                                    <span className="text-[10px] text-gray-500">Transit</span>
                                </div>
                            </div>
                        </div>

                        {/* Fuel Reserves Bar */}
                        <div className="bg-gray-900 border border-gray-800 rounded p-1.5 shadow-inner">
                            <div className="flex justify-between text-[10px] font-mono uppercase text-gray-400 mb-1">
                                <span>Fuel Reserves</span>
                                <span className={`font-bold ${isLowFuel ? "text-red-400" : "text-green-400"}`}>
                                    {fuelLevel}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-950 h-1.5 rounded-full overflow-hidden border border-gray-800">
                                <div
                                    className={`h-full transition-all duration-500 ${isLowFuel ? "bg-red-500" : "bg-green-500"}`}
                                    style={{ width: `${Math.min(100, Math.max(0, fuelLevel))}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Right Column (Flex-1, Scrollable Accordion Tray) --- */}
                <div className="flex-1 flex flex-col p-3 bg-gray-900/50 overflow-y-auto space-y-2">

                    {/* Countermeasures Accordion */}
                    <details
                        className="group bg-gray-950/70 rounded-lg border border-gray-800 shrink-0"
                        open={defenseSystems.length > 0}
                    >
                        <summary className="p-3 cursor-pointer text-sm font-semibold text-gray-400 hover:text-white hover:bg-gray-800/60 transition-colors list-none flex justify-between items-center">
                            <span>Countermeasures ({defenseSystems.length})</span>
                            <span className="text-gray-600 group-open:rotate-180 transition-transform text-xs">▼</span>
                        </summary>
                        <div className="p-3 border-t border-gray-800 bg-gray-950/90 text-sm">
                            {defenseSystems.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {defenseSystems.map((def, i) => (
                                        <span key={i} className="px-2 py-1 bg-blue-950/40 border border-blue-900/50 rounded text-xs font-mono text-blue-300">
                                            {def}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <span className="text-gray-600 text-sm">No active defense grid detected.</span>
                            )}
                        </div>
                    </details>

                    {/* Station Telemetry Summary Accordion */}
                    <details className="group bg-gray-950/70 rounded-lg border border-gray-800 shrink-0" open>
                        <summary className="p-3 cursor-pointer text-sm font-semibold text-gray-400 hover:text-white hover:bg-gray-800/60 transition-colors list-none flex justify-between items-center">
                            <span>Structural & Orbital Spec</span>
                            <span className="text-gray-600 group-open:rotate-180 transition-transform text-xs">▼</span>
                        </summary>
                        <div className="p-3 border-t border-gray-800 bg-gray-950/90 text-sm space-y-2 font-mono">
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