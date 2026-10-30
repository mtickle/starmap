import { useState } from "react";
import { getPlanetTexture } from "@utils/planetTextures.js";

/**
 * UnifiedPlanetCard
 * 
 * Renders a comprehensive, interactive card for a planetary body.
 * Features a 3D CSS viewport for the core planet and orbiting moons, 
 * stacked core telemetry stats, and a 5-panel scanner interface.
 *
 * @param {Object} props
 * @param {Object} props.planet - The planetary data payload.
 * @param {number} [props.tiltAngle=60] - The CSS 3D X-axis rotation angle for the orbital plane.
 * @param {Function} [props.onClose] - Optional callback to dismiss the card from a master-detail view.
 */
const UnifiedPlanetCard = ({ planet, tiltAngle = 60, onClose }) => {
    // Controls the visibility of the bottom readout tray
    const [activeScannerTab, setActiveScannerTab] = useState(null);

    // Fail gracefully if rendered without a data payload
    if (!planet) return null;

    /**
     * Toggles the active scanner tab. Clicking an active tab closes it.
     * @param {string} tabKey - The identifier for the clicked tab (e.g., "geo", "bio").
     */
    const toggleTab = (tabKey) => {
        setActiveScannerTab((prev) => (prev === tabKey ? null : tabKey));
    };

    // Determine the planet's texture, falling back to a dynamically generated one
    const textureUrl = getPlanetTexture(planet.planetType, planet.planetName) || planet.textureUrl;

    // --- DYNAMIC PRESENCE LOGIC ---
    // Evaluates arrays and objects to determine which status pills and tabs should be active
    const hasCiv =
        planet.settlements?.length > 0 ||
        (Array.isArray(planet.inhabitants) ? planet.inhabitants.length > 0 : Boolean(planet.inhabitants)) ||
        Boolean(planet.economy);
    const hasFlora = planet.floraList?.length > 0;
    const hasFauna = planet.faunaList?.length > 0;
    const hasBiosphere = hasFlora || hasFauna;
    const hasMoons = planet.moons?.length > 0;
    const hasRareRes = planet.resourceList?.some((res) => res.rarity?.toLowerCase() === "rare");

    // --- TELEMETRY COUNTS ---
    const rareCount = planet.resourceList?.filter((r) => r.rarity?.toLowerCase() === "rare").length || 0;
    const floraCount = planet.floraList?.length || 0;
    const faunaCount = planet.faunaList?.length || 0;
    const geoCount = planet.resourceList?.length || 0;
    const moonCount = planet.moons?.length || 0;

    // Base size in pixels for the central 3D planet sphere
    const coreRenderSize = 160;

    return (
        <div className="bg-gray-900/95 rounded-xl border border-gray-800 hover:border-gray-600 transition-colors overflow-hidden flex flex-col self-start w-full shadow-xl backdrop-blur-sm">
            {/* Scoped CSS Animations for 3D rotations */}
            <style>
                {`
                  @keyframes orbit-spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                  }
                  @keyframes spin-planet {
                    from { background-position: 0% center; }
                    to { background-position: -200% center; }
                  }
                `}
            </style>

            {/* =========================================
                1. CARD HEADER
                ========================================= */}
            <div className="bg-gray-950 border-b border-gray-800 px-4 py-3 flex items-center justify-between shrink-0">
                <h2 className="text-xl font-bold tracking-widest uppercase text-white leading-none">
                    {planet.planetName}
                </h2>
                <span className="px-2.5 py-1 rounded bg-gray-900/40 text-gray-300 text-xs uppercase tracking-wider font-semibold border border-gray-700/50">
                    {planet.planetType}
                </span>
            </div>

            {/* =========================================
                2. MIDDLE SECTION: Viewport & Telemetry
                ========================================= */}
            <div className="flex flex-row border-b border-gray-800 bg-gradient-to-b from-[#07070f] via-[#121224] to-gray-900">

                {/* --- Left Column: 3D Viewport & Floating Pills --- */}
                <div className="relative h-full min-h-[20rem] flex-1 flex flex-col items-center justify-center overflow-hidden shrink-0">

                    {/* 3D Stage Setup */}
                    <div
                        className="relative flex items-center justify-center w-full h-full -mt-3"
                        style={{ perspective: "900px" }}
                    >
                        {/* Orbital Plane Tilt Container */}
                        <div
                            className="relative w-0 h-0"
                            style={{
                                transform: `rotateX(${tiltAngle}deg)`,
                                transformStyle: "preserve-3d",
                            }}
                        >
                            {/* Core Planet (Counter-rotated to face the camera) */}
                            <div
                                className="absolute top-0 left-0 rounded-full border border-black/60 z-20 pointer-events-auto"
                                style={{
                                    width: `${coreRenderSize}px`,
                                    height: `${coreRenderSize}px`,
                                    transform: `translate(-50%, -50%) rotateX(-${tiltAngle}deg)`,
                                    backgroundColor: planet.planetColor,
                                    backgroundImage: textureUrl ? `url(${textureUrl})` : "none",
                                    backgroundSize: "200% 100%",
                                    backgroundRepeat: "repeat-x",
                                    animation: "spin-planet 25s linear infinite",
                                    boxShadow: `
                                      inset -18px -18px 32px rgba(0, 0, 0, 0.95),
                                      inset 6px 6px 14px rgba(255, 255, 255, 0.15),
                                      0 0 35px ${planet.planetColor}40
                                    `,
                                }}
                                title={planet.planetName}
                            />

                            {/* Moon Orbit Generation */}
                            {planet.moons?.map((moon, mIdx) => {
                                const moonRingSize = coreRenderSize + 36 + mIdx * 26;
                                const moonAngle = (mIdx * 115) % 360;
                                const moonDuration = 10 + mIdx * 6;
                                const moonSize = 8 + (mIdx % 3) * 2;

                                const isString = typeof moon === "string";
                                const moonName = isString ? moon : moon.name || `Moon ${mIdx + 1}`;
                                const moonColor = isString ? "#9ca3af" : moon.color || "#cbd5e1";

                                return (
                                    <div
                                        key={mIdx}
                                        className="absolute top-0 left-0 pointer-events-none"
                                        style={{
                                            width: `${moonRingSize}px`,
                                            height: `${moonRingSize}px`,
                                            transform: `translate(-50%, -50%) rotate(${moonAngle}deg)`,
                                            transformStyle: "preserve-3d",
                                        }}
                                    >
                                        <div
                                            className="w-full h-full rounded-full border border-gray-400/35 border-dotted"
                                            style={{
                                                animation: `orbit-spin ${moonDuration}s linear infinite`,
                                                transformStyle: "preserve-3d",
                                            }}
                                        >
                                            <div
                                                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
                                                style={{ transformStyle: "preserve-3d" }}
                                            >
                                                {/* Inverse rotations to keep the moon sphere upright on screen */}
                                                <div
                                                    style={{
                                                        animation: `orbit-spin ${moonDuration}s linear infinite reverse`,
                                                        transformStyle: "preserve-3d",
                                                    }}
                                                >
                                                    <div style={{ transform: `rotate(-${moonAngle}deg)`, transformStyle: "preserve-3d" }}>
                                                        <div style={{ transform: `rotateX(-${tiltAngle}deg)` }}>
                                                            <div
                                                                className="rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.95)] border border-black/80 pointer-events-auto cursor-help hover:scale-125 transition-transform"
                                                                style={{
                                                                    width: `${moonSize}px`,
                                                                    height: `${moonSize}px`,
                                                                    backgroundColor: moonColor,
                                                                    backgroundImage: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5) 0%, rgba(0,0,0,0.85) 85%)",
                                                                }}
                                                                title={moonName}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Floating Status Pills */}
                    <div className="absolute bottom-2 flex flex-wrap justify-center gap-2 z-10 w-full px-2">
                        {hasMoons && (
                            <span className="px-2.5 py-1 rounded bg-purple-900/40 text-purple-300 text-xs uppercase tracking-wider font-semibold border border-purple-700/50 backdrop-blur-md">
                                {moonCount} {moonCount === 1 ? "Moon" : "Moons"}
                            </span>
                        )}
                        {hasCiv ? (
                            <span className="px-2.5 py-1 rounded bg-blue-900/40 text-blue-300 text-xs uppercase tracking-wider font-semibold border border-blue-700/50 backdrop-blur-md">
                                Inhabited
                            </span>
                        ) : (
                            <span className="px-2.5 py-1 rounded bg-gray-950/60 text-gray-400 text-xs uppercase tracking-wider font-semibold border border-gray-800 backdrop-blur-md">
                                Uninhabited
                            </span>
                        )}
                        {hasBiosphere ? (
                            <span className="px-2.5 py-1 rounded bg-green-900/40 text-green-300 text-xs uppercase tracking-wider font-semibold border border-green-700/50 backdrop-blur-md">
                                Biosphere Active
                            </span>
                        ) : (
                            <span className="px-2.5 py-1 rounded bg-red-950/30 text-red-400/60 text-xs uppercase tracking-wider font-semibold border border-red-900/30 backdrop-blur-md">
                                Lifeless
                            </span>
                        )}
                        {hasRareRes && (
                            <span className="px-2.5 py-1 rounded bg-purple-900/40 text-purple-300 text-xs uppercase tracking-wider font-semibold border border-purple-700/50 shadow-[0_0_8px_rgba(147,51,234,0.15)] backdrop-blur-md">
                                Rare Deposits ({rareCount})
                            </span>
                        )}
                    </div>
                </div>

                {/* --- Right Column: Stacked Core Stats --- */}
                <div className="flex flex-col justify-center gap-3 p-4 w-36 border-l border-gray-800 bg-gray-950/50 shrink-0 font-mono">
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-2.5 shadow-inner">
                        <p className="text-xs text-gray-500 uppercase mb-0.5 tracking-wider">Gravity</p>
                        <p className="text-sm text-white font-bold">{planet.gravity} G</p>
                    </div>
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-2.5 shadow-inner">
                        <p className="text-xs text-gray-500 uppercase mb-0.5 tracking-wider">Orbit Cycle</p>
                        <p className="text-sm text-white font-bold">{planet.orbitalPeriod}d</p>
                    </div>
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-2.5 shadow-inner">
                        <p className="text-xs text-gray-500 uppercase mb-0.5 tracking-wider">Day Length</p>
                        <p className="text-sm text-white font-bold">
                            {/* Fallback support for older caching structures missing standard keys */}
                            {planet.rotationalPeriod || planet.rotationPeriod || planet.dayLength
                                ? `${planet.rotationalPeriod || planet.rotationPeriod || planet.dayLength}h`
                                : "N/A"}
                        </p>
                    </div>
                </div>
            </div>

            {/* =========================================
                3. HORIZONTAL SCANNER & READOUT TRAY
                ========================================= */}
            <div className="p-4 bg-gray-900">

                {/* 5-Column Tab Navigation */}
                <div className="grid grid-cols-5 gap-1 bg-gray-950 p-1 rounded-lg border border-gray-800 font-mono">

                    {/* Geo Tab */}
                    <button
                        type="button"
                        onClick={() => toggleTab("geo")}
                        className={`py-2 px-1.5 rounded text-sm font-semibold transition-colors flex flex-col items-center justify-center gap-0.5 ${activeScannerTab === "geo"
                            ? "bg-blue-950/80 text-blue-300 border border-blue-700/60"
                            : "text-gray-400 hover:text-gray-200 hover:bg-gray-900"
                            }`}
                        title="Geological Scan"
                    >
                        <span>Geo</span>
                        <span className="text-xs opacity-75">({geoCount})</span>
                    </button>

                    {/* Flora Tab */}
                    <button
                        type="button"
                        disabled={!hasFlora}
                        onClick={() => toggleTab("flora")}
                        className={`py-2 px-1.5 rounded text-sm font-semibold transition-colors flex flex-col items-center justify-center gap-0.5 ${!hasFlora
                            ? "text-gray-700 cursor-not-allowed"
                            : activeScannerTab === "flora"
                                ? "bg-green-950/80 text-green-300 border border-green-700/60"
                                : "text-gray-400 hover:text-gray-200 hover:bg-gray-900"
                            }`}
                        title="Botanical Analysis"
                    >
                        <span>Flora</span>
                        <span className="text-xs opacity-75">({floraCount})</span>
                    </button>

                    {/* Fauna Tab */}
                    <button
                        type="button"
                        disabled={!hasFauna}
                        onClick={() => toggleTab("fauna")}
                        className={`py-2 px-1.5 rounded text-sm font-semibold transition-colors flex flex-col items-center justify-center gap-0.5 ${!hasFauna
                            ? "text-gray-700 cursor-not-allowed"
                            : activeScannerTab === "fauna"
                                ? "bg-teal-950/80 text-teal-300 border border-teal-700/60"
                                : "text-gray-400 hover:text-gray-200 hover:bg-gray-900"
                            }`}
                        title="Zoological Analysis"
                    >
                        <span>Fauna</span>
                        <span className="text-xs opacity-75">({faunaCount})</span>
                    </button>

                    {/* Civilization Tab */}
                    <button
                        type="button"
                        disabled={!hasCiv}
                        onClick={() => toggleTab("civ")}
                        className={`py-2 px-1.5 rounded text-sm font-semibold transition-colors flex flex-col items-center justify-center gap-0.5 ${!hasCiv
                            ? "text-gray-700 cursor-not-allowed"
                            : activeScannerTab === "civ"
                                ? "bg-orange-950/80 text-orange-300 border border-orange-700/60"
                                : "text-gray-400 hover:text-gray-200 hover:bg-gray-900"
                            }`}
                        title="Civilization & Trade"
                    >
                        <span>Civ</span>
                        <span className="text-xs opacity-75 opacity-0">(-)</span> {/* Invisible spacer for grid height alignment */}
                    </button>

                    {/* Moons Tab */}
                    <button
                        type="button"
                        disabled={!hasMoons}
                        onClick={() => toggleTab("moons")}
                        className={`py-2 px-1.5 rounded text-sm font-semibold transition-colors flex flex-col items-center justify-center gap-0.5 ${!hasMoons
                            ? "text-gray-700 cursor-not-allowed"
                            : activeScannerTab === "moons"
                                ? "bg-purple-950/80 text-purple-300 border border-purple-700/60"
                                : "text-gray-400 hover:text-gray-200 hover:bg-gray-900"
                            }`}
                        title="Lunar Satellites"
                    >
                        <span>Moons</span>
                        <span className="text-xs opacity-75">({moonCount})</span>
                    </button>
                </div>

                {/* Readout Tray Container */}
                {activeScannerTab && (
                    <div className="mt-3 p-4 rounded-lg border border-gray-800 bg-gray-950/95 text-sm max-h-72 overflow-y-auto">

                        {/* PANEL A: GEOLOGICAL */}
                        {activeScannerTab === "geo" && (
                            <div>
                                <div className="text-xs font-mono uppercase tracking-wider text-blue-400 mb-2.5 pb-1.5 border-b border-gray-800">
                                    Geological Resource Scan
                                </div>
                                {planet.resourceList?.length > 0 ? (
                                    <ul className="text-blue-300 text-sm space-y-2">
                                        {planet.resourceList.map((res, rIdx) => (
                                            <li
                                                key={rIdx}
                                                className="flex items-center justify-between"
                                            >
                                                <span>
                                                    {res.specificName}{" "}
                                                    <span className="text-gray-400 text-xs">
                                                        ({res.baseMaterial})
                                                    </span>
                                                </span>
                                                {res.rarity?.toLowerCase() === "rare" && (
                                                    <span className="px-2 py-0.5 bg-purple-900/50 text-purple-300 text-xs rounded uppercase border border-purple-700 font-mono">
                                                        Rare
                                                    </span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <span className="text-sm text-gray-500">
                                        Depleted or Unscannable
                                    </span>
                                )}
                            </div>
                        )}

                        {/* PANEL B: FLORA */}
                        {activeScannerTab === "flora" && (
                            <div className="space-y-4">
                                {planet.floraList?.length > 0 && (
                                    <div>
                                        <span className="text-green-400 font-mono font-semibold block mb-2 text-xs uppercase tracking-wider">
                                            Flora Strains ({planet.floraList.length})
                                        </span>
                                        <ul className="space-y-2.5">
                                            {planet.floraList.map((f, fIdx) => (
                                                <li
                                                    key={fIdx}
                                                    className="bg-gray-900/70 p-3 rounded border border-green-900/40"
                                                >
                                                    <div className="flex items-baseline justify-between gap-2">
                                                        <span className="font-bold text-green-300 text-sm">
                                                            {f.name}
                                                        </span>
                                                        {f.rarity && (
                                                            <span
                                                                className={`text-xs uppercase tracking-widest px-2 py-0.5 rounded border ${f.rarity === "Rare"
                                                                    ? "text-purple-300 bg-purple-950/60 border-purple-800/50"
                                                                    : f.rarity === "Uncommon"
                                                                        ? "text-blue-300 bg-blue-950/60 border-blue-800/50"
                                                                        : "text-green-400 bg-green-950/60 border-green-800/50"
                                                                    }`}
                                                            >
                                                                {f.rarity}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-gray-400 mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 capitalize">
                                                        {f.type && <span>{f.type}</span>}
                                                        {f.type && f.appearance && (
                                                            <span className="text-gray-600">•</span>
                                                        )}
                                                        {f.appearance && <span>{f.appearance}</span>}
                                                        {(f.type || f.appearance) && f.utility && (
                                                            <span className="text-gray-600">•</span>
                                                        )}
                                                        {f.utility && (
                                                            <span className="text-green-400">
                                                                {f.utility}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {f.description && (
                                                        <p className="text-sm text-gray-300 italic mt-2 leading-relaxed border-l-2 border-green-800/60 pl-2.5">
                                                            "{f.description}"
                                                        </p>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* PANEL C: FAUNA */}
                        {activeScannerTab === "fauna" && (
                            <div className="space-y-4">
                                {planet.faunaList?.length > 0 && (
                                    <div>
                                        <span className="text-teal-400 font-mono font-semibold block mb-2 text-xs uppercase tracking-wider">
                                            Fauna Species ({planet.faunaList.length})
                                        </span>
                                        <ul className="space-y-2.5">
                                            {planet.faunaList.map((f, fIdx) => (
                                                <li
                                                    key={fIdx}
                                                    className="bg-gray-900/70 p-3 rounded border border-teal-900/40"
                                                >
                                                    <div className="flex items-baseline justify-between gap-2">
                                                        <span className="font-bold text-teal-300 text-sm">
                                                            {f.name || f.species}
                                                        </span>
                                                        {f.type && (
                                                            <span className="text-xs uppercase tracking-widest text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-800/50">
                                                                {f.type}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-gray-400 mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1">
                                                        {f.biome && <span>{f.biome}</span>}
                                                        {f.biome && f.behavior && (
                                                            <span className="text-gray-600">•</span>
                                                        )}
                                                        {f.behavior && <span>{f.behavior}</span>}
                                                    </div>
                                                    {f.description && (
                                                        <p className="text-sm text-gray-300 italic mt-2 leading-relaxed border-l-2 border-teal-800/60 pl-2.5">
                                                            "{f.description}"
                                                        </p>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* PANEL D: CIVILIZATION */}
                        {activeScannerTab === "civ" && (
                            <div className="space-y-3">
                                <div className="text-xs font-mono uppercase tracking-wider text-orange-400 mb-2 pb-1.5 border-b border-gray-800">
                                    Civilization & Trade Telemetry
                                </div>
                                {planet.settlements?.length > 0 && (
                                    <div>
                                        <span className="text-gray-400 text-xs uppercase tracking-wider block mb-1">
                                            Major Settlements:
                                        </span>
                                        <span className="text-orange-300 text-sm font-medium">
                                            {planet.settlements
                                                .map(
                                                    (s) =>
                                                        s.name || (typeof s === "string" ? s : "Unknown")
                                                )
                                                .join(", ")}
                                        </span>
                                    </div>
                                )}
                                {planet.inhabitants &&
                                    (!Array.isArray(planet.inhabitants) ||
                                        planet.inhabitants.length > 0) && (
                                        <div>
                                            <span className="text-gray-400 text-xs uppercase tracking-wider block mb-1">
                                                Inhabitants:
                                            </span>
                                            <span className="text-blue-300 text-sm font-medium">
                                                {Array.isArray(planet.inhabitants)
                                                    ? planet.inhabitants
                                                        .map((i) => {
                                                            const name =
                                                                i.inhabitantName ||
                                                                i.name ||
                                                                (typeof i === "string" ? i : "Unknown");
                                                            const pop = i.percentage
                                                                ? ` (${i.percentage}%)`
                                                                : "";
                                                            return `${name}${pop}`;
                                                        })
                                                        .join(", ")
                                                    : `${planet.inhabitants.inhabitantName ||
                                                    planet.inhabitants.name ||
                                                    (typeof planet.inhabitants === "string"
                                                        ? planet.inhabitants
                                                        : "Unknown")
                                                    }${planet.inhabitants.percentage
                                                        ? ` (${planet.inhabitants.percentage}%)`
                                                        : ""
                                                    }`}
                                            </span>
                                        </div>
                                    )}
                                {(planet.economy || planet.industry) && (
                                    <div className="pt-3 border-t border-gray-800 flex flex-col gap-2 mt-1">
                                        {planet.economy && (
                                            <div className="text-sm">
                                                <span className="text-gray-400">Economy: </span>
                                                <span className="text-green-400 font-medium">
                                                    {typeof planet.economy === "string"
                                                        ? planet.economy
                                                        : planet.economy.name}
                                                </span>
                                            </div>
                                        )}
                                        {planet.industry && (
                                            <div className="text-sm">
                                                <span className="text-gray-400">Industry: </span>
                                                <span className="text-yellow-400 font-medium">
                                                    {typeof planet.industry === "string"
                                                        ? planet.industry
                                                        : planet.industry.name}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* PANEL E: MOONS */}
                        {activeScannerTab === "moons" && (
                            <div>
                                <div className="text-xs font-mono uppercase tracking-wider text-purple-400 mb-2.5 pb-1.5 border-b border-gray-800">
                                    Lunar Satellites ({moonCount})
                                </div>
                                <ul className="space-y-2.5">
                                    {planet.moons.map((moon, mIdx) => {
                                        const isString = typeof moon === "string";
                                        const name = isString
                                            ? moon
                                            : moon.name || `Moon ${mIdx + 1}`;

                                        return (
                                            <li
                                                key={mIdx}
                                                className="bg-gray-900/70 p-3 rounded border border-purple-900/40"
                                            >
                                                <div className="flex items-baseline justify-between gap-2">
                                                    <span className="font-bold text-purple-300 text-sm">
                                                        {name}
                                                    </span>
                                                    {!isString && moon.theme && (
                                                        <span className="text-xs uppercase tracking-widest text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/50">
                                                            {moon.theme}
                                                        </span>
                                                    )}
                                                </div>
                                                {!isString && (
                                                    <div className="mt-2 space-y-1.5">
                                                        {moon.settlement && (
                                                            <div className="text-sm">
                                                                <span className="text-gray-400">
                                                                    Outpost:{" "}
                                                                </span>
                                                                <span className="text-orange-300 font-medium">
                                                                    {moon.settlement}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {(moon.economy || moon.industry) && (
                                                            <div className="text-sm flex flex-wrap items-center gap-x-4 gap-y-1">
                                                                {moon.economy && (
                                                                    <span>
                                                                        <span className="text-gray-400">
                                                                            Econ:{" "}
                                                                        </span>
                                                                        <span className="text-green-400">
                                                                            {typeof moon.economy === "string"
                                                                                ? moon.economy
                                                                                : moon.economy.name}
                                                                        </span>
                                                                    </span>
                                                                )}
                                                                {moon.industry && (
                                                                    <span>
                                                                        <span className="text-gray-400">
                                                                            Ind:{" "}
                                                                        </span>
                                                                        <span className="text-yellow-400">
                                                                            {typeof moon.industry === "string"
                                                                                ? moon.industry
                                                                                : moon.industry.name}
                                                                        </span>
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                        {moon.description && (
                                                            <p className="text-sm text-gray-300 italic mt-2 leading-relaxed border-l-2 border-purple-800/60 pl-2.5">
                                                                "{moon.description}"
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UnifiedPlanetCard;