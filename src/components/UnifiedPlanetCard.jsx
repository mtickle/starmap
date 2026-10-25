import { useState } from "react";
import { getPlanetTexture } from "@utils/planetTextures.js";

const UnifiedPlanetCard = ({ planet, tiltAngle = 60, onClose }) => {
    const [activeScannerTab, setActiveScannerTab] = useState(null);

    if (!planet) return null;

    const toggleTab = (tabKey) => {
        setActiveScannerTab((prev) => (prev === tabKey ? null : tabKey));
    };

    const textureUrl =
        getPlanetTexture(planet.planetType, planet.planetName) || planet.textureUrl;

    // --- DYNAMIC PILL LOGIC ---
    const hasCiv =
        planet.settlements?.length > 0 ||
        (Array.isArray(planet.inhabitants)
            ? planet.inhabitants.length > 0
            : Boolean(planet.inhabitants)) ||
        Boolean(planet.economy);
    const hasBiosphere =
        planet.floraList?.length > 0 || planet.faunaList?.length > 0;
    const hasMoons = planet.moons?.length > 0;
    const hasRareRes = planet.resourceList?.some(
        (res) => res.rarity?.toLowerCase() === "rare"
    );

    const rareCount =
        planet.resourceList?.filter((r) => r.rarity?.toLowerCase() === "rare")
            .length || 0;
    const bioCount =
        (planet.floraList?.length || 0) + (planet.faunaList?.length || 0);
    const geoCount = planet.resourceList?.length || 0;
    const moonCount = planet.moons?.length || 0;

    const coreRenderSize = 92;

    return (
        <div className="bg-gray-900/95 rounded-xl border border-gray-800 hover:border-gray-600 transition-colors overflow-hidden flex flex-col self-start w-full shadow-xl backdrop-blur-sm">
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

            {/* 1. 3D VISUAL VIEWPORT HEADER */}
            <div className="relative h-60 w-full bg-gradient-to-b from-[#07070f] via-[#121224] to-gray-900 border-b border-gray-800/80 flex items-center justify-center overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:16px_16px] opacity-40 pointer-events-none" />

                {onClose && (
                    <button
                        onClick={onClose}
                        className="absolute top-3 left-3 text-gray-300 hover:text-white flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest transition-colors bg-gray-950/80 px-3 py-1.5 rounded border border-gray-700 hover:border-gray-500 z-40"
                    >
                        <span>←</span> Abort Lock
                    </button>
                )}

                {/* Classification Badge */}
                <div className="absolute top-3 right-3 z-30 flex items-center gap-2 bg-gray-950/85 border border-gray-700/80 px-3 py-1 rounded text-xs font-mono uppercase tracking-wider text-gray-200 backdrop-blur">
                    <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                            backgroundColor: planet.planetColor,
                            boxShadow: `0 0 8px ${planet.planetColor}`,
                        }}
                    />
                    {planet.planetType}
                </div>

                {/* Centered 3D Stage for Planet + Moons */}
                <div
                    className="relative flex items-center justify-center w-full h-full -mt-3"
                    style={{ perspective: "900px" }}
                >
                    <div
                        className="relative w-0 h-0"
                        style={{
                            transform: `rotateX(${tiltAngle}deg)`,
                            transformStyle: "preserve-3d",
                        }}
                    >
                        {/* Core Planet Centered at (0,0) */}
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

                        {/* Properly Centered Moon Orbits */}
                        {planet.moons?.map((moon, mIdx) => {
                            const moonRingSize = coreRenderSize + 36 + mIdx * 26;
                            const moonAngle = (mIdx * 115) % 360;
                            const moonDuration = 10 + mIdx * 6;
                            const moonSize = 8 + (mIdx % 3) * 2;

                            const isString = typeof moon === "string";
                            const moonName = isString
                                ? moon
                                : moon.name || `Moon ${mIdx + 1}`;
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
                                            <div
                                                style={{
                                                    animation: `orbit-spin ${moonDuration}s linear infinite reverse`,
                                                    transformStyle: "preserve-3d",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        transform: `rotate(-${moonAngle}deg)`,
                                                        transformStyle: "preserve-3d",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            transform: `rotateX(-${tiltAngle}deg)`,
                                                        }}
                                                    >
                                                        <div
                                                            className="rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.95)] border border-black/80 pointer-events-auto cursor-help hover:scale-125 transition-transform"
                                                            style={{
                                                                width: `${moonSize}px`,
                                                                height: `${moonSize}px`,
                                                                backgroundColor: moonColor,
                                                                backgroundImage:
                                                                    "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5) 0%, rgba(0,0,0,0.85) 85%)",
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

                {/* Bottom Viewport Title Overlay */}
                <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end z-30 pointer-events-none">
                    <div>
                        <div className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
                            Planetary Body
                        </div>
                        <h3 className="text-xl font-bold text-white tracking-wide leading-tight">
                            {planet.planetName}
                        </h3>
                    </div>
                    {hasMoons && (
                        <span className="text-xs font-mono text-purple-300 bg-purple-950/70 border border-purple-700/60 px-2.5 py-0.5 rounded">
                            {moonCount} {moonCount === 1 ? "Moon" : "Moons"}
                        </span>
                    )}
                </div>
            </div>

            {/* 2. TELEMETRY & DETAILS BODY */}
            <div className="p-5 flex flex-col justify-start gap-4">
                {/* Status Pills */}
                <div className="flex flex-wrap gap-2">
                    {hasCiv ? (
                        <span className="px-2.5 py-1 rounded bg-blue-900/40 text-blue-300 text-xs uppercase tracking-wider font-semibold border border-blue-700/50">
                            Inhabited
                        </span>
                    ) : (
                        <span className="px-2.5 py-1 rounded bg-gray-950/60 text-gray-400 text-xs uppercase tracking-wider font-semibold border border-gray-800">
                            Uninhabited
                        </span>
                    )}

                    {hasBiosphere ? (
                        <span className="px-2.5 py-1 rounded bg-green-900/40 text-green-300 text-xs uppercase tracking-wider font-semibold border border-green-700/50">
                            Biosphere Active
                        </span>
                    ) : (
                        <span className="px-2.5 py-1 rounded bg-red-950/30 text-red-400/60 text-xs uppercase tracking-wider font-semibold border border-red-900/30">
                            Lifeless
                        </span>
                    )}

                    {hasRareRes && (
                        <span className="px-2.5 py-1 rounded bg-purple-900/40 text-purple-300 text-xs uppercase tracking-wider font-semibold border border-purple-700/50 shadow-[0_0_8px_rgba(147,51,234,0.15)]">
                            Rare Deposits ({rareCount})
                        </span>
                    )}
                </div>

                {/* Core Telemetry Grid */}
                <div className="grid grid-cols-3 gap-2.5 font-mono">
                    <div className="bg-gray-950/70 border border-gray-800 rounded-lg p-2.5">
                        <p className="text-[11px] text-gray-400 uppercase mb-0.5">Gravity</p>
                        <p className="text-sm text-white font-bold">{planet.gravity} G</p>
                    </div>
                    <div className="bg-gray-950/70 border border-gray-800 rounded-lg p-2.5">
                        <p className="text-[11px] text-gray-400 uppercase mb-0.5">
                            Orbit Cycle
                        </p>
                        <p className="text-sm text-white font-bold">
                            {planet.orbitalPeriod}d
                        </p>
                    </div>
                    <div className="bg-gray-950/70 border border-gray-800 rounded-lg p-2.5">
                        <p className="text-[11px] text-gray-400 uppercase mb-0.5">
                            Day Length
                        </p>
                        <p className="text-sm text-white font-bold">
                            {planet.rotationalPeriod ? `${planet.rotationalPeriod}h` : "N/A"}
                        </p>
                    </div>
                </div>

                {/* 3. HORIZONTAL SCANNER TAB SWITCHER */}
                <div>
                    <div className="grid grid-cols-4 gap-1 bg-gray-950 p-1 rounded-lg border border-gray-800 font-mono">
                        {/* Tab 1: Geological */}
                        <button
                            type="button"
                            onClick={() => toggleTab("geo")}
                            className={`py-2 px-1.5 rounded text-xs font-semibold transition-colors flex items-center justify-center gap-1 ${activeScannerTab === "geo"
                                    ? "bg-blue-950/80 text-blue-300 border border-blue-700/60"
                                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-900"
                                }`}
                            title="Geological Scan"
                        >
                            <span>Geo</span>
                            <span className="text-[10px] opacity-75">({geoCount})</span>
                        </button>

                        {/* Tab 2: Biosphere */}
                        <button
                            type="button"
                            disabled={!hasBiosphere}
                            onClick={() => toggleTab("bio")}
                            className={`py-2 px-1.5 rounded text-xs font-semibold transition-colors flex items-center justify-center gap-1 ${!hasBiosphere
                                    ? "text-gray-700 cursor-not-allowed"
                                    : activeScannerTab === "bio"
                                        ? "bg-green-950/80 text-green-300 border border-green-700/60"
                                        : "text-gray-400 hover:text-gray-200 hover:bg-gray-900"
                                }`}
                            title="Biosphere Analysis"
                        >
                            <span>Bio</span>
                            <span className="text-[10px] opacity-75">({bioCount})</span>
                        </button>

                        {/* Tab 3: Civilization */}
                        <button
                            type="button"
                            disabled={!hasCiv}
                            onClick={() => toggleTab("civ")}
                            className={`py-2 px-1.5 rounded text-xs font-semibold transition-colors flex items-center justify-center gap-1 ${!hasCiv
                                    ? "text-gray-700 cursor-not-allowed"
                                    : activeScannerTab === "civ"
                                        ? "bg-orange-950/80 text-orange-300 border border-orange-700/60"
                                        : "text-gray-400 hover:text-gray-200 hover:bg-gray-900"
                                }`}
                            title="Civilization & Trade"
                        >
                            <span>Civ</span>
                        </button>

                        {/* Tab 4: Moons */}
                        <button
                            type="button"
                            disabled={!hasMoons}
                            onClick={() => toggleTab("moons")}
                            className={`py-2 px-1.5 rounded text-xs font-semibold transition-colors flex items-center justify-center gap-1 ${!hasMoons
                                    ? "text-gray-700 cursor-not-allowed"
                                    : activeScannerTab === "moons"
                                        ? "bg-purple-950/80 text-purple-300 border border-purple-700/60"
                                        : "text-gray-400 hover:text-gray-200 hover:bg-gray-900"
                                }`}
                            title="Lunar Satellites"
                        >
                            <span>Moons</span>
                            <span className="text-[10px] opacity-75">({moonCount})</span>
                        </button>
                    </div>

                    {/* SHARED READOUT TRAY */}
                    {activeScannerTab && (
                        <div className="mt-2 p-3.5 rounded-lg border border-gray-800 bg-gray-950/95 text-sm max-h-72 overflow-y-auto">
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
                                                        <span className="px-2 py-0.5 bg-purple-900/50 text-purple-300 text-[10px] rounded uppercase border border-purple-700 font-mono">
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

                            {/* PANEL B: BIOSPHERE */}
                            {activeScannerTab === "bio" && (
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
                                                        className="bg-gray-900/70 p-2.5 rounded border border-green-900/40"
                                                    >
                                                        <div className="flex items-baseline justify-between gap-2">
                                                            <span className="font-bold text-green-300 text-sm">
                                                                {f.name}
                                                            </span>
                                                            {f.rarity && (
                                                                <span
                                                                    className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded border ${f.rarity === "Rare"
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
                                                            <p className="text-xs text-gray-300 italic mt-2 leading-relaxed border-l-2 border-green-800/60 pl-2.5">
                                                                "{f.description}"
                                                            </p>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {planet.faunaList?.length > 0 && (
                                        <div>
                                            <span className="text-teal-400 font-mono font-semibold block mb-2 text-xs uppercase tracking-wider">
                                                Fauna Species ({planet.faunaList.length})
                                            </span>
                                            <ul className="space-y-2.5">
                                                {planet.faunaList.map((f, fIdx) => (
                                                    <li
                                                        key={fIdx}
                                                        className="bg-gray-900/70 p-2.5 rounded border border-teal-900/40"
                                                    >
                                                        <div className="flex items-baseline justify-between gap-2">
                                                            <span className="font-bold text-teal-300 text-sm">
                                                                {f.name || f.species}
                                                            </span>
                                                            {f.type && (
                                                                <span className="text-[10px] uppercase tracking-widest text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-800/50">
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
                                                            <p className="text-xs text-gray-300 italic mt-2 leading-relaxed border-l-2 border-teal-800/60 pl-2.5">
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

                            {/* PANEL C: CIVILIZATION */}
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
                                            <span className="text-orange-300 font-medium">
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
                                                <span className="text-blue-300 font-medium">
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
                                        <div className="pt-2.5 border-t border-gray-800 flex flex-col gap-1.5">
                                            {planet.economy && (
                                                <div>
                                                    <span className="text-gray-400">Economy: </span>
                                                    <span className="text-green-400 font-medium">
                                                        {typeof planet.economy === "string"
                                                            ? planet.economy
                                                            : planet.economy.name}
                                                    </span>
                                                </div>
                                            )}
                                            {planet.industry && (
                                                <div>
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

                            {/* PANEL D: MOONS */}
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
                                                    className="bg-gray-900/70 p-2.5 rounded border border-purple-900/40"
                                                >
                                                    <div className="flex items-baseline justify-between gap-2">
                                                        <span className="font-bold text-purple-300 text-sm">
                                                            {name}
                                                        </span>
                                                        {!isString && moon.theme && (
                                                            <span className="text-[10px] uppercase tracking-widest text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/50">
                                                                {moon.theme}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {!isString && (
                                                        <div className="mt-1.5 space-y-1.5">
                                                            {moon.settlement && (
                                                                <div className="text-xs">
                                                                    <span className="text-gray-400">
                                                                        Outpost:{" "}
                                                                    </span>
                                                                    <span className="text-orange-300 font-medium">
                                                                        {moon.settlement}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            {(moon.economy || moon.industry) && (
                                                                <div className="text-xs flex flex-wrap items-center gap-x-3 gap-y-1">
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
                                                                <p className="text-xs text-gray-300 italic mt-2 leading-relaxed border-l-2 border-purple-800/60 pl-2.5">
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
        </div>
    );
};

export default UnifiedPlanetCard;