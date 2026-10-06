const PlanetCard = ({ planet }) => {
  // --- DYNAMIC PILL LOGIC ---
  const hasCiv =
    planet.settlements?.length > 0 ||
    (Array.isArray(planet.inhabitants)
      ? planet.inhabitants.length > 0
      : planet.inhabitants) ||
    planet.economy;
  const hasBiosphere =
    planet.floraList?.length > 0 || planet.faunaList?.length > 0;
  const hasRareRes = planet.resourceList?.some(
    (res) => res.rarity?.toLowerCase() === "rare"
  );

  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-gray-500 transition-colors">
      {/* Card Header */}
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

      {/* Core Stats & Dynamic Classification Pills */}
      <div className="mb-4">
        <p className="text-sm text-gray-400 mb-2">
          Gravity: {planet.gravity}G | Orbit: {planet.orbitalPeriod} days
        </p>

        {/* PILL CONTAINER */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {/* 1. Civilization Pill */}
          {hasCiv ? (
            <span className="px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 text-[10px] uppercase tracking-widest font-semibold border border-blue-700/50">
              Inhabited
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded bg-gray-900/60 text-gray-500 text-[10px] uppercase tracking-widest font-semibold border border-gray-700/50">
              Uninhabited
            </span>
          )}

          {/* 2. Biosphere Pill */}
          {hasBiosphere ? (
            <span className="px-2 py-0.5 rounded bg-green-900/40 text-green-300 text-[10px] uppercase tracking-widest font-semibold border border-green-700/50">
              Biosphere Active
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded bg-red-950/30 text-red-500/40 text-[10px] uppercase tracking-widest font-semibold border border-red-900/30">
              Lifeless
            </span>
          )}

          {/* 3. Rare Resource Pill */}
          {hasRareRes && (
            <span className="px-2 py-0.5 rounded bg-purple-900/40 text-purple-300 text-[10px] uppercase tracking-widest font-semibold border border-purple-700/50 shadow-[0_0_8px_rgba(147,51,234,0.15)]">
              Rare Deposits
            </span>
          )}
        </div>
      </div>

      {/* Scanner Accordions */}
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
                  <li key={rIdx} className="flex items-center justify-between">
                    <span>
                      {res.specificName}{" "}
                      <span className="text-gray-500 text-[10px]">
                        ({res.baseMaterial})
                      </span>
                    </span>
                    {res.rarity?.toLowerCase() === "rare" && (
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
        {(planet.floraList?.length > 0 || planet.faunaList?.length > 0) && (
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
                          {f.appearance && <span>{f.appearance}</span>}
                          {(f.type || f.appearance) && f.utility && (
                            <span className="text-gray-700">•</span>
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
                        (s) => s.name || (typeof s === "string" ? s : "Unknown")
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
                                (typeof i === "string" ? i : "Unknown");
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
                      <span className="text-gray-500">Economy: </span>
                      <span className="text-green-400">
                        {typeof planet.economy === "string"
                          ? planet.economy
                          : planet.economy.name}
                      </span>
                    </div>
                  )}
                  {planet.industry && (
                    <div>
                      <span className="text-gray-500">Industry: </span>
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
                  const isString = typeof moon === "string";
                  const name = isString
                    ? moon
                    : moon.name || `Moon ${mIdx + 1}`;

                  return (
                    <li
                      key={mIdx}
                      className="bg-gray-800/40 p-2 rounded border border-purple-900/30"
                    >
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
                      {!isString && (
                        <div className="mt-1.5 space-y-1.5">
                          {moon.settlement && (
                            <div className="text-[10px]">
                              <span className="text-gray-500">Outpost: </span>
                              <span className="text-orange-300">
                                {moon.settlement}
                              </span>
                            </div>
                          )}
                          {(moon.economy || moon.industry) && (
                            <div className="text-[10px] flex flex-wrap items-center gap-x-3 gap-y-1">
                              {moon.economy && (
                                <span>
                                  <span className="text-gray-500">Econ: </span>
                                  <span className="text-green-400">
                                    {typeof moon.economy === "string"
                                      ? moon.economy
                                      : moon.economy.name}
                                  </span>
                                </span>
                              )}
                              {moon.industry && (
                                <span>
                                  <span className="text-gray-500">Ind: </span>
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
    </div>
  );
};

export default PlanetCard;
