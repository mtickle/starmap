const StarSystemViewer = ({ activeSystem, onClose }) => {
  if (!activeSystem) return null;

  console.log("Rendering StarSystemViewer for system:", activeSystem);

  return (
    <div className="flex flex-col h-full w-full bg-gray-900 text-gray-200 p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-700 pb-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <span
              className="w-4 h-4 rounded-full shadow-md"
              style={{
                backgroundColor: activeSystem.color,
                boxShadow: `0 0 10px ${activeSystem.color}`,
              }}
            ></span>
            {activeSystem.name} System
          </h1>
          <p className="text-gray-400 mt-1">
            Class {activeSystem.type} Star | Controlled by:{" "}
            <span className="text-blue-400">
              {activeSystem.faction?.name || "Uncharted"}
            </span>
          </p>
        </div>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-red-900/50 hover:bg-red-700 text-red-200 rounded border border-red-800 transition-colors"
        >
          Close Scanner
        </button>
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar: System Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-3 text-white border-b border-gray-700 pb-2">
              System Profile
            </h2>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-gray-400">Coordinates:</span>{" "}
                {activeSystem.id}
              </li>
              <li>
                <span className="text-gray-400">Planets:</span>{" "}
                {activeSystem.planets?.length || 0}
              </li>
              <li>
                <span className="text-gray-400">Space Stations:</span>{" "}
                {activeSystem.stations?.length || 0}
              </li>
              <li>
                <span className="text-gray-400">Economy:</span>{" "}
                {activeSystem.economy || "None"}
              </li>
            </ul>
          </div>

          {activeSystem.stations?.length > 0 && (
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <h2 className="text-xl font-semibold mb-3 text-white border-b border-gray-700 pb-2">
                Orbital Stations
              </h2>
              <ul className="space-y-2 text-sm">
                {activeSystem.stations.map((station, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-yellow-500">⬡</span> {station.name} (
                    {station.type})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Area: Planet Cards */}
        <div className="lg:col-span-3">
          <h2 className="text-2xl font-semibold mb-4 text-white">
            Planetary Bodies
          </h2>

          {!activeSystem.planets || activeSystem.planets.length === 0 ? (
            <div className="p-8 text-center text-gray-500 bg-gray-800 rounded-lg border border-gray-700 border-dashed">
              No planetary bodies detected in this system.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeSystem.planets.map((planet, idx) => (
                <div
                  key={idx}
                  className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-gray-500 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: planet.planetColor }}
                      ></span>
                      {planet.planetName}
                    </h3>
                    <span className="text-xs px-2 py-1 bg-gray-900 rounded text-gray-300">
                      {planet.planetType}
                    </span>
                  </div>

                  <div className="text-sm text-gray-400 mb-4">
                    <p>
                      Gravity: {planet.gravity}G | Orbit: {planet.orbitalPeriod}{" "}
                      days
                    </p>
                    {planet.moons?.length > 0 && (
                      <p className="text-purple-300 mt-1 text-xs">
                        Moons: {planet.moons.length}
                      </p>
                    )}
                  </div>

                  {/* Accordion Container */}
                  <div className="mt-4 space-y-2">
                    {/* 1. Geological Data */}
                    <details className="group bg-gray-900/80 rounded border border-gray-700">
                      <summary className="p-2 cursor-pointer text-xs font-semibold text-gray-400 hover:text-white hover:bg-gray-800 transition-colors list-none flex justify-between items-center">
                        Geological Scan
                        <span className="text-gray-600 group-open:rotate-180 transition-transform">
                          ▼
                        </span>
                      </summary>
                      <div className="p-3 border-t border-gray-700 bg-gray-950/50">
                        {planet.resourceList?.length > 0 ? (
                          <ul className="text-blue-300 text-xs space-y-1.5">
                            {planet.resourceList.map((res, rIdx) => (
                              <li
                                key={rIdx}
                                className="flex items-center justify-between"
                              >
                                <span>
                                  {res.specificName}{" "}
                                  <span className="text-gray-500 text-[10px]">
                                    ({res.baseMaterial})
                                  </span>
                                </span>
                                {res.rarity === "rare" && (
                                  <span className="px-1.5 py-0.5 bg-purple-900/50 text-purple-300 text-[9px] rounded uppercase border border-purple-700">
                                    Rare
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-xs text-gray-600">
                            Depleted or Unscannable
                          </span>
                        )}
                      </div>
                    </details>

                    {/* 2. Biosphere Logs */}
                    {(planet.floraList?.length > 0 ||
                      planet.faunaList?.length > 0) && (
                      <details className="group bg-gray-900/80 rounded border border-gray-700">
                        <summary className="p-2 cursor-pointer text-xs font-semibold text-gray-400 hover:text-white hover:bg-gray-800 transition-colors list-none flex justify-between items-center">
                          Biosphere Analysis
                          <span className="text-gray-600 group-open:rotate-180 transition-transform">
                            ▼
                          </span>
                        </summary>
                        <div className="p-3 border-t border-gray-700 bg-gray-950/50 text-xs space-y-3">
                          {planet.floraList?.length > 0 && (
                            <div>
                              <span className="text-gray-500 font-semibold block mb-2">
                                Flora:
                              </span>
                              <ul className="space-y-2">
                                {planet.floraList.map((f, fIdx) => (
                                  <li
                                    key={fIdx}
                                    className="bg-gray-800/40 p-2 rounded border border-green-900/30"
                                  >
                                    <div className="flex items-baseline justify-between gap-2">
                                      <span className="font-bold text-green-300">
                                        {f.name}
                                      </span>
                                      {f.rarity && (
                                        <span
                                          className={`text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded border ${
                                            f.rarity === "Rare"
                                              ? "text-purple-400 bg-purple-950/60 border-purple-800/50"
                                              : f.rarity === "Uncommon"
                                              ? "text-blue-400 bg-blue-950/60 border-blue-800/50"
                                              : "text-green-500 bg-green-950/60 border-green-800/50"
                                          }`}
                                        >
                                          {f.rarity}
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[10px] text-gray-500 mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 capitalize">
                                      {f.type && <span>{f.type}</span>}
                                      {f.type && f.appearance && (
                                        <span className="text-gray-700">•</span>
                                      )}
                                      {f.appearance && (
                                        <span>{f.appearance}</span>
                                      )}
                                      {(f.type || f.appearance) &&
                                        f.utility && (
                                          <span className="text-gray-700">
                                            •
                                          </span>
                                        )}
                                      {f.utility && (
                                        <span className="text-green-700/80">
                                          {f.utility}
                                        </span>
                                      )}
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {planet.faunaList?.length > 0 && (
                            <div>
                              <span className="text-gray-500 font-semibold block mb-2">
                                Fauna:
                              </span>
                              <ul className="space-y-2">
                                {planet.faunaList.map((f, fIdx) => (
                                  <li
                                    key={fIdx}
                                    className="bg-gray-800/40 p-2 rounded border border-teal-900/30"
                                  >
                                    <div className="flex items-baseline justify-between gap-2">
                                      <span className="font-bold text-teal-300">
                                        {f.name || f.species}
                                      </span>
                                      {f.type && (
                                        <span className="text-[9px] uppercase tracking-widest text-teal-500 bg-teal-950/60 px-1.5 py-0.5 rounded border border-teal-800/50">
                                          {f.type}
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[10px] text-gray-500 mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1">
                                      {f.biome && <span>{f.biome}</span>}
                                      {f.biome && f.behavior && (
                                        <span className="text-gray-700">•</span>
                                      )}
                                      {f.behavior && <span>{f.behavior}</span>}
                                    </div>
                                    {f.description && (
                                      <p className="text-[10px] text-gray-400 italic mt-1.5 leading-tight border-l-2 border-teal-900/50 pl-2">
                                        "{f.description}"
                                      </p>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </details>
                    )}

                    {/* 3. Civilization & Industry */}
                    {(planet.settlements?.length > 0 ||
                      planet.inhabitants ||
                      planet.economy) && (
                      <details className="group bg-gray-900/80 rounded border border-gray-700">
                        <summary className="p-2 cursor-pointer text-xs font-semibold text-gray-400 hover:text-white hover:bg-gray-800 transition-colors list-none flex justify-between items-center">
                          Civilization & Trade
                          <span className="text-gray-600 group-open:rotate-180 transition-transform">
                            ▼
                          </span>
                        </summary>
                        <div className="p-3 border-t border-gray-700 bg-gray-950/50 text-xs space-y-3">
                          {planet.settlements?.length > 0 && (
                            <div>
                              <span className="text-gray-500 block mb-1">
                                Major Settlements:{" "}
                              </span>
                              <span className="text-orange-300">
                                {planet.settlements
                                  .map(
                                    (s) =>
                                      s.name ||
                                      (typeof s === "string" ? s : "Unknown")
                                  )
                                  .join(", ")}
                              </span>
                            </div>
                          )}
                          {planet.inhabitants &&
                            (!Array.isArray(planet.inhabitants) ||
                              planet.inhabitants.length > 0) && (
                              <div>
                                <span className="text-gray-500 block mb-1">
                                  Inhabitants:{" "}
                                </span>
                                <span className="text-blue-300">
                                  {Array.isArray(planet.inhabitants)
                                    ? planet.inhabitants
                                        .map((i) => {
                                          const name =
                                            i.inhabitantName ||
                                            i.name ||
                                            (typeof i === "string"
                                              ? i
                                              : "Unknown");
                                          const pop = i.percentage
                                            ? ` (${i.percentage}%)`
                                            : "";
                                          return `${name}${pop}`;
                                        })
                                        .join(", ")
                                    : `${
                                        planet.inhabitants.inhabitantName ||
                                        planet.inhabitants.name ||
                                        (typeof planet.inhabitants === "string"
                                          ? planet.inhabitants
                                          : "Unknown")
                                      }${
                                        planet.inhabitants.percentage
                                          ? ` (${planet.inhabitants.percentage}%)`
                                          : ""
                                      }`}
                                </span>
                              </div>
                            )}
                          {(planet.economy || planet.industry) && (
                            <div className="pt-2 border-t border-gray-800 flex flex-col gap-1">
                              {planet.economy && (
                                <div>
                                  <span className="text-gray-500">
                                    Economy:{" "}
                                  </span>
                                  <span className="text-green-400">
                                    {typeof planet.economy === "string"
                                      ? planet.economy
                                      : planet.economy.name}
                                  </span>
                                </div>
                              )}
                              {planet.industry && (
                                <div>
                                  <span className="text-gray-500">
                                    Industry:{" "}
                                  </span>
                                  <span className="text-yellow-400">
                                    {typeof planet.industry === "string"
                                      ? planet.industry
                                      : planet.industry.name}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </details>
                    )}
                  </div>
                </div>
              ))}
              {/* 4. Lunar Satellites */}
              {planet.moons?.length > 0 && (
                <details className="group bg-gray-900/80 rounded border border-gray-700">
                  <summary className="p-2 cursor-pointer text-xs font-semibold text-gray-400 hover:text-white hover:bg-gray-800 transition-colors list-none flex justify-between items-center">
                    Lunar Satellites ({planet.moons.length})
                    <span className="text-gray-600 group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <div className="p-3 border-t border-gray-700 bg-gray-950/50 text-xs space-y-3">
                    <ul className="space-y-2">
                      {planet.moons.map((moon, mIdx) => {
                        // Defensively check if the moon is just a string or a rich data object
                        const isString = typeof moon === "string";
                        const name = isString
                          ? moon
                          : moon.name || `Moon ${mIdx + 1}`;

                        return (
                          <li
                            key={mIdx}
                            className="bg-gray-800/40 p-2 rounded border border-purple-900/30"
                          >
                            {/* Moon Header */}
                            <div className="flex items-baseline justify-between gap-2">
                              <span className="font-bold text-purple-300">
                                {name}
                              </span>
                              {!isString && moon.theme && (
                                <span className="text-[9px] uppercase tracking-widest text-purple-400 bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-800/50">
                                  {moon.theme}
                                </span>
                              )}
                            </div>

                            {/* Moon Lore (Only renders if the engine generated an object) */}
                            {!isString && (
                              <div className="mt-1.5 space-y-1.5">
                                {moon.settlement && (
                                  <div className="text-[10px]">
                                    <span className="text-gray-500">
                                      Outpost:{" "}
                                    </span>
                                    <span className="text-orange-300">
                                      {moon.settlement}
                                    </span>
                                  </div>
                                )}

                                {(moon.economy || moon.industry) && (
                                  <div className="text-[10px] flex flex-wrap items-center gap-x-3 gap-y-1">
                                    {moon.economy && (
                                      <span>
                                        <span className="text-gray-500">
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
                                        <span className="text-gray-500">
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
                                  <p className="text-[10px] text-gray-400 italic mt-1.5 leading-tight border-l-2 border-purple-900/50 pl-2">
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
                </details>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StarSystemViewer;
