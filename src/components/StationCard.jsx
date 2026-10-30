import { getStationTexture } from "@utils/stationTextures.js";

/**
 * StationCard
 * 
 * Renders a comprehensive, interactive card for an orbital station.
 * Features a top-down 2D rotating sprite viewport with radar overlays,
 * stacked core telemetry stats, and expandable detail accordions.
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
        <div className="bg-gray-900/90 rounded-xl border border-gray-800 hover:border-red-900/60 transition-all overflow-hidden flex flex-col self-start w-full shadow-xl backdrop-blur-sm">
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
            <div className="bg-gray-950 border-b border-gray-800 px-4 py-3 flex items-center justify-between shrink-0 relative">

                {/* Optional Abort Button for Master-Detail Views */}
                {onClose && (
                    <button
                        onClick={onClose}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors bg-gray-900 px-2 py-1 rounded border border-gray-700 hover:border-gray-500 z-40"
                    >
                        <span>←</span> Abort Lock
                    </button>
                )}

                <h2 className={`text-xl font-bold tracking-widest uppercase text-white leading-none ${onClose ? 'ml-24' : ''}`}>
                    {displayName}
                </h2>

                {/* Station Theme & Size Badge */}
                <div className="flex items-center gap-1.5 bg-gray-900/40 border border-gray-700/50 px-2.5 py-1 rounded text-xs font-mono uppercase tracking-wider text-red-300">
                    <span>
                        {themeType}
                    </span>
                </div>
            </div>

            {/* =========================================
                2. MIDDLE SECTION: Viewport & Telemetry
                ========================================= */}
            <div className="flex flex-row border-b border-gray-800 bg-gradient-to-b from-[#07070f] via-[#121224] to-gray-900">

                {/* --- Left Column: Station Visuals & Floating Pills --- */}
                <div className="relative h-full min-h-[20rem] flex-1 flex flex-col items-center justify-center overflow-hidden shrink-0">

                    {/* Boosted dot opacity to 0.15 and overall container opacity to 80 */}
                    {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.15)_1px,transparent_1px)] bg-[size:18px_18px] opacity-80 pointer-events-none" /> */}

                    {/* Boosted dashed border opacity from /15 to /40 */}
                    {/* <div className="absolute w-44 h-44 rounded-full border border-red-500/40 border-dashed pointer-events-none" /> */}

                    {/* Boosted solid border opacity from /10 to /30 */}
                    {/* <div className="absolute w-32 h-32 rounded-full border border-red-500/30 pointer-events-none" /> */}

                    {/* Station 2D Sprite with Feathered Radial Mask */}
                    <div className="relative flex items-center justify-center w-36 h-36 z-20 -mt-4">
                        <div className="absolute inset-4 rounded-full bg-red-500/10  pointer-events-none" />
                        {textureUrl ? (
                            <img
                                src={textureUrl}
                                alt={displayName}
                                // Removed w-64 h-64 from className
                                className="rounded-full object-cover mix-blend-screen contrast-125 brightness-110"
                                style={{
                                    // Added dynamic inline sizing to match the planet
                                    width: `${coreRenderSize}px`,
                                    height: `${coreRenderSize}px`,
                                    animation: "station-slow-spin 90s linear infinite",
                                    // WebkitMaskImage: "radial-gradient(circle, rgba(0,0,0,1) 52%, rgba(0,0,0,0) 74%)",
                                    //maskImage: "radial-gradient(circle, rgba(0,0,0,1) 52%, rgba(0,0,0,0) 74%)",
                                }}
                            />
                        ) : (
                            <div
                                className="bg-gray-950 border border-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.4)] rotate-45 flex items-center justify-center"
                                style={{
                                    width: `${coreRenderSize / 3}px`, // Scaled the fallback box proportionally
                                    height: `${coreRenderSize / 3}px`
                                }}
                            >
                                <div className="w-2.5 h-2.5 bg-red-400 animate-pulse rounded-full" />
                            </div>
                        )}
                    </div>

                    {/* Floating Status Pills */}
                    <div className="absolute bottom-2 flex flex-wrap justify-center gap-2 z-10 w-full px-2">
                        {isLowFuel ? (
                            <span className="px-2.5 py-1 rounded bg-red-950/50 text-red-400 text-xs uppercase tracking-wider font-semibold border border-red-800/50 backdrop-blur-md">
                                Low Reserves
                            </span>
                        ) : (
                            <span className="px-2.5 py-1 rounded bg-emerald-950/50 text-emerald-300 text-xs uppercase tracking-wider font-semibold border border-emerald-700/50 backdrop-blur-md">
                                Operational
                            </span>
                        )}

                        {isTactical ? (
                            <span className="px-2.5 py-1 rounded bg-red-950/50 text-red-300 text-xs uppercase tracking-wider font-semibold border border-red-700/50 backdrop-blur-md">
                                High Security
                            </span>
                        ) : isSciBio ? (
                            <span className="px-2.5 py-1 rounded bg-cyan-950/50 text-cyan-300 text-xs uppercase tracking-wider font-semibold border border-cyan-700/50 backdrop-blur-md">
                                Research Clearance
                            </span>
                        ) : (
                            <span className="px-2.5 py-1 rounded bg-blue-950/50 text-blue-300 text-xs uppercase tracking-wider font-semibold border border-blue-700/50 backdrop-blur-md">
                                Open Transponder
                            </span>
                        )}

                        {defenseSystems.length > 0 && (
                            <span className="px-2.5 py-1 rounded bg-purple-900/40 text-purple-300 text-xs uppercase tracking-wider font-semibold border border-purple-700/50 backdrop-blur-md">
                                Armed ({defenseSystems.length})
                            </span>
                        )}
                    </div>
                </div>

                {/* --- Right Column: Stacked Core Stats --- */}
                <div className="flex flex-col justify-center gap-3 p-4 w-40 border-l border-gray-800 bg-gray-950/50 shrink-0 font-mono">

                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-2.5 shadow-inner">
                        <p className="text-xs text-gray-500 uppercase mb-0.5 tracking-wider">Logistics</p>
                        <p className="text-sm font-bold text-gray-200">
                            {dockingRings}{" "}
                            <span className="text-xs text-gray-500 font-normal">Rings</span>
                        </p>
                        <p className="text-sm font-bold text-amber-300 mt-0.5">
                            {storageCapacity}{" "}
                            <span className="text-xs text-gray-500 font-normal">Cap</span>
                        </p>
                    </div>

                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-2.5 shadow-inner">
                        <p className="text-xs text-gray-500 uppercase mb-0.5 tracking-wider">Population</p>
                        <p className="text-sm font-bold text-gray-200">
                            {crew.toLocaleString()}{" "}
                            <span className="text-xs text-gray-500 font-normal">Crew</span>
                        </p>
                        <p className="text-sm font-bold text-gray-300 mt-0.5">
                            {transit.toLocaleString()}{" "}
                            <span className="text-xs text-gray-500 font-normal">Transit</span>
                        </p>
                    </div>

                    {/* Fuel Reserves Bar */}
                    <div className="bg-gray-900/40 border border-gray-800/60 rounded-lg p-2.5 shadow-inner">
                        <div className="flex justify-between text-xs font-mono uppercase text-gray-400 mb-1.5">
                            <span>Fuel</span>
                            <span className={`font-bold ${isLowFuel ? "text-red-400" : "text-green-400"}`}>
                                {fuelLevel}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-950 h-2 rounded-full overflow-hidden border border-gray-800">
                            <div
                                className={`h-full transition-all duration-500 ${isLowFuel ? "bg-red-500" : "bg-green-500"}`}
                                style={{ width: `${Math.min(100, Math.max(0, fuelLevel))}%` }}
                            />
                        </div>
                    </div>

                </div>
            </div>

            {/* =========================================
                3. EXPANDABLE DETAILS ACCORDIONS
                ========================================= */}
            <div className="p-4 bg-gray-900 space-y-2">

                {/* Countermeasures Accordion */}
                <details
                    className="group bg-gray-950/70 rounded-lg border border-gray-800"
                    open={defenseSystems.length > 0}
                >
                    <summary className="p-3 cursor-pointer text-sm font-semibold text-gray-400 hover:text-white hover:bg-gray-800/60 transition-colors list-none flex justify-between items-center">
                        <span>Countermeasures ({defenseSystems.length})</span>
                        <span className="text-gray-600 group-open:rotate-180 transition-transform text-xs">
                            ▼
                        </span>
                    </summary>
                    <div className="p-3 border-t border-gray-800 bg-gray-950/90 text-sm">
                        {defenseSystems.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {defenseSystems.map((def, i) => (
                                    <span
                                        key={i}
                                        className="px-2 py-1 bg-blue-950/40 border border-blue-900/50 rounded text-xs font-mono text-blue-300"
                                    >
                                        {def}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <span className="text-gray-600 text-sm">
                                No active defense grid detected.
                            </span>
                        )}
                    </div>
                </details>

                {/* Station Telemetry Summary Accordion */}
                <details className="group bg-gray-950/70 rounded-lg border border-gray-800">
                    <summary className="p-3 cursor-pointer text-sm font-semibold text-gray-400 hover:text-white hover:bg-gray-800/60 transition-colors list-none flex justify-between items-center">
                        <span>Structural & Orbital Spec</span>
                        <span className="text-gray-600 group-open:rotate-180 transition-transform text-xs">
                            ▼
                        </span>
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
    );
};

export default StationCard;