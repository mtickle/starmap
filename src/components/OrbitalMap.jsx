import { useState } from "react";

// ==========================================
// PROCEDURAL TEXTURE ENGINE
// ==========================================
// ==========================================
// PROCEDURAL TEXTURE ENGINE (V2: Rocky & Weather)
// ==========================================
const getPlanetTexture = (planet) => {
  // LAYER 1: Base 3D shading (Always on top)
  const shading = `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0.85) 85%)`;

  const type = planet.planetType?.toLowerCase() || "";
  const variant = (planet.planetName || "").length % 3;

  let layers = [shading];

  // --- GAS GIANTS ---
  if (type.includes("gas")) {
    if (variant === 0) {
      layers.push(`repeating-linear-gradient(0deg, transparent 0%, rgba(0,0,0,0.2) 8%, transparent 15%, rgba(255,255,255,0.15) 20%, transparent 25%)`);
    } else if (variant === 1) {
      layers.push(`radial-gradient(ellipse 35% 20% at 70% 60%, rgba(0,0,0,0.4) 0%, transparent 60%)`);
      layers.push(`linear-gradient(0deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.15) 30%, transparent 50%, rgba(255,255,255,0.1) 75%, rgba(0,0,0,0.2) 100%)`);
    } else {
      layers.push(`repeating-linear-gradient(0deg, rgba(0,0,0,0.3) 0%, transparent 5%, transparent 12%, rgba(255,255,255,0.2) 16%, rgba(255,255,255,0.05) 20%)`);
    }
    return layers.join(", ");
  }

  // --- ATMOSPHERE & CLOUDS CHECK ---
  // Does it have life? Or is it a known atmospheric type?
  const hasBiosphere = (planet.floraList?.length > 0) || (planet.faunaList?.length > 0);
  const hasAtmosphere = ["lush", "tropical", "toxic", "ice", "water", "marsh", "frozen", "paradise"].some(t => type.includes(t));

  if (hasBiosphere || hasAtmosphere) {
    // LAYER 2: Weather Systems (Slides just under the shadow, but over the surface)
    // Creates sweeping, soft white atmospheric swirls
    layers.push(`radial-gradient(ellipse 80% 50% at 40% 30%, rgba(255,255,255,0.35) 0%, transparent 55%)`);
    layers.push(`radial-gradient(ellipse 60% 40% at 75% 70%, rgba(255,255,255,0.25) 0%, transparent 50%)`);
  }

  // --- ROCKY / TERRESTRIAL SURFACES ---
  if (variant === 0) {
    // TEXTURE 0: Continents & Archipelagos (Large organic splotches)
    layers.push(`radial-gradient(circle at 20% 30%, rgba(0,0,0,0.3) 0%, transparent 35%)`);
    layers.push(`radial-gradient(circle at 75% 65%, rgba(255,255,255,0.2) 0%, transparent 45%)`);
    layers.push(`radial-gradient(circle at 80% 20%, rgba(0,0,0,0.2) 0%, transparent 25%)`);
  } else if (variant === 1) {
    // TEXTURE 1: The Cratered Husk (Pockmarks and meteor impacts)
    layers.push(`radial-gradient(circle at 15% 45%, rgba(0,0,0,0.4) 0%, transparent 8%)`);
    layers.push(`radial-gradient(circle at 75% 25%, rgba(0,0,0,0.5) 0%, transparent 12%)`);
    layers.push(`radial-gradient(circle at 55% 80%, rgba(0,0,0,0.3) 0%, transparent 10%)`);
    layers.push(`radial-gradient(circle at 35% 15%, rgba(255,255,255,0.2) 0%, transparent 15%)`);
  } else {
    // TEXTURE 2: Tectonic Fractures (Sharp diagonal ridges)
    layers.push(`linear-gradient(45deg, transparent 20%, rgba(0,0,0,0.3) 22%, transparent 24%, transparent 65%, rgba(255,255,255,0.2) 68%, transparent 70%)`);
    layers.push(`linear-gradient(-45deg, transparent 40%, rgba(0,0,0,0.2) 42%, transparent 45%)`);
  }

  // Combine all stacked layers together
  return layers.join(", ");
};


// ==========================================
// COMPONENT: Orbital Radar Map (With Textures)
// ==========================================
export const OrbitalMap = ({ activeSystem }) => {
  const planets = activeSystem.planets || [];
  const [focusedPlanet, setFocusedPlanet] = useState(null);

  const TILT_ANGLE = 60;

  return (
    <div className="relative flex justify-center items-center w-full bg-gray-900/50 rounded-xl border border-gray-800 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] overflow-hidden p-6 min-h-[600px]">

      {/* LAYER 1: 3D Orbital Map */}
      <div
        className={`relative w-full max-w-[500px] aspect-square flex items-center justify-center transition-all duration-700 ease-in-out ${focusedPlanet ? "scale-90 blur-md opacity-30 pointer-events-none" : "scale-100 blur-0 opacity-100"
          }`}
        style={{ perspective: '1000px' }}
      >
        <div
          className="absolute inset-0 w-full h-full flex items-center justify-center"
          style={{ transform: `rotateX(${TILT_ANGLE}deg)`, transformStyle: 'preserve-3d' }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] rounded-full opacity-50"></div>

          <div
            className="absolute z-10 w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              transform: `rotateX(-${TILT_ANGLE}deg)`,
              background: `radial-gradient(circle at 40% 40%, #fff, ${activeSystem.color} 40%, #000 90%)`,
              boxShadow: `0 0 40px ${activeSystem.color}, 0 0 100px ${activeSystem.color}`,
            }}
          ></div>

          {planets.map((planet, idx) => {
            const minRing = 25;
            const maxRing = 95;
            const ringSize = planets.length === 1 ? 60 : minRing + (idx * ((maxRing - minRing) / (planets.length - 1)));
            const angle = (idx * 137.5) % 360;
            const planetSize = Math.max(12, Math.min(24, planet.gravity * 15));
            const orbitDuration = (idx + 1) * 40;

            return (
              <div
                key={idx}
                className="absolute inset-0 m-auto aspect-square pointer-events-none"
                style={{ width: `${ringSize}%`, transform: `rotate(${angle}deg)`, transformStyle: 'preserve-3d' }}
              >
                <div
                  className="w-full h-full rounded-full border border-gray-700/60 border-dashed"
                  style={{ animation: `spin ${orbitDuration}s linear infinite`, transformStyle: 'preserve-3d' }}
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20" style={{ transformStyle: 'preserve-3d' }}>
                    <div style={{ animation: `spin ${orbitDuration}s linear infinite reverse`, transformStyle: 'preserve-3d' }}>
                      <div style={{ transform: `rotate(-${angle}deg)`, transformStyle: 'preserve-3d' }}>
                        <div style={{ transform: `rotateX(-${TILT_ANGLE}deg)` }}>

                          <div
                            onClick={() => setFocusedPlanet(planet)}
                            className="p-5 group relative flex items-center justify-center cursor-crosshair pointer-events-auto"
                          >
                            {/* RADAR PLANET WITH PROCEDURAL TEXTURE */}
                            <div
                              className="rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.9)] group-hover:scale-125 transition-transform border border-black/50 hover:ring-2 hover:ring-white/50"
                              style={{
                                width: `${planetSize}px`,
                                height: `${planetSize}px`,
                                backgroundColor: planet.planetColor, // The base core color
                                backgroundImage: getPlanetTexture(planet), // The layered bands and shadows
                              }}
                            ></div>
                            <div className="absolute top-[75%] left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-gray-950/90 text-xs px-3 py-1.5 rounded border border-gray-700 pointer-events-none shadow-xl z-50">
                              <p className="font-bold text-white mb-0.5">{planet.planetName}</p>
                            </div>
                          </div>

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

      {/* LAYER 2: Target Lock / Planet ID Card */}
      {focusedPlanet && (
        <div className="absolute inset-0 z-50 flex animate-[fadeIn_0.3s_ease-out]">

          <div className="w-1/2 h-full flex flex-col justify-center items-center bg-gradient-to-r from-gray-950 to-transparent relative">
            <button
              onClick={() => setFocusedPlanet(null)}
              className="absolute top-6 left-6 text-gray-400 hover:text-white flex items-center gap-2 font-mono text-xs uppercase tracking-widest transition-colors bg-gray-900/50 px-3 py-1.5 rounded border border-gray-700 hover:border-gray-500 backdrop-blur"
            >
              <span>←</span> Abort Lock
            </button>

            {/* MACRO PLANET WITH PROCEDURAL TEXTURE */}
            <div
              className="w-64 h-64 rounded-full border border-black/50 animate-[pulse_4s_ease-in-out_infinite]"
              style={{
                backgroundColor: focusedPlanet.planetColor, // Base color
                backgroundImage: getPlanetTexture(focusedPlanet), // Scale-independent texture layers!
                boxShadow: `inset -20px -20px 40px rgba(0,0,0,0.9), 0 0 60px ${focusedPlanet.planetColor}40`
              }}
            ></div>
            <div className="mt-8 text-center">
              <div className="text-gray-500 font-mono text-xs mb-1 uppercase tracking-widest">Target Locked</div>
              <div className="text-2xl font-bold text-white tracking-widest uppercase">{focusedPlanet.planetName}</div>
            </div>
          </div>

          <div className="w-1/2 h-full flex flex-col justify-center p-12 bg-gray-950/80 backdrop-blur-sm border-l border-gray-800/50">
            <div className="space-y-6">

              <div className="border-l-2 pl-4" style={{ borderColor: focusedPlanet.planetColor }}>
                <h3 className="text-sm font-mono text-gray-400 uppercase tracking-widest mb-1">Classification</h3>
                <p className="text-xl text-gray-200 font-semibold">{focusedPlanet.planetType}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-900/50 border border-gray-800 rounded p-3">
                  <p className="text-[10px] text-gray-500 font-mono uppercase mb-1">Gravity Profile</p>
                  <p className="text-lg text-gray-300 font-semibold">{focusedPlanet.gravity} G</p>
                </div>
                <div className="bg-gray-900/50 border border-gray-800 rounded p-3">
                  <p className="text-[10px] text-gray-500 font-mono uppercase mb-1">Orbital Cycle</p>
                  <p className="text-lg text-gray-300 font-semibold">{focusedPlanet.orbitalPeriod} Days</p>
                </div>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded p-4">
                <h3 className="text-[10px] text-gray-500 font-mono uppercase mb-3 border-b border-gray-800 pb-2">Biosphere Scan</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Flora Strains:</span>
                  <span className="text-green-400 font-mono">{focusedPlanet.floraList?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Fauna Species:</span>
                  <span className="text-teal-400 font-mono">{focusedPlanet.faunaList?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Rare Deposits:</span>
                  <span className="text-purple-400 font-mono">
                    {focusedPlanet.resourceList?.filter(r => r.rarity === 'Rare').length || 0}
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default OrbitalMap;
