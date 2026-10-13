import { useState, useMemo } from "react";
import PlanetOrbit from "./PlanetOrbit.jsx";
import { getPlanetTexture } from "@utils/textureUtils.js";
import DeepSpaceBackground from "./DeepSpaceBackground.jsx";


// ==========================================
// COMPONENT: Orbital Radar Map (Main)
// ==========================================
export const OrbitalMap = ({ activeSystem }) => {
  const planets = activeSystem.planets || [];
  const [focusedPlanet, setFocusedPlanet] = useState(null);
  const [zoom, setZoom] = useState(1);

  const TILT_ANGLE = 60;

  const handleWheel = (e) => {
    setZoom((prev) => Math.max(0.3, Math.min(prev - e.deltaY * 0.002, 3.5)));
  };

  return (
    <div
      className="relative flex justify-center items-center w-full bg-gradient-to-b from-[#0a0a14] via-[#1a1a2e] to-[#0a0a14] rounded-xl border border-gray-800 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] overflow-hidden p-6 min-h-[600px]"
      onWheel={handleWheel}
    >
      <DeepSpaceBackground />

      <style>
        {`
          @keyframes orbit-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>

      {/* ZOOM UI HUD */}
      <div className="absolute top-4 right-4 z-40 flex flex-col bg-gray-950/80 border border-gray-800 rounded shadow-lg backdrop-blur text-gray-400 font-mono text-center overflow-hidden">
        <button onClick={() => setZoom((z) => Math.min(z + 0.2, 3.5))} className="hover:text-white hover:bg-gray-800 px-3 py-1.5 transition-colors border-b border-gray-800 text-lg leading-none">+</button>
        <button onClick={() => setZoom(1)} className="hover:text-white hover:bg-gray-800 px-2 py-1.5 transition-colors border-b border-gray-800 text-[10px] uppercase font-bold tracking-wider" title="Reset View">Reset</button>
        <button onClick={() => setZoom((z) => Math.max(z - 0.2, 0.3))} className="hover:text-white hover:bg-gray-800 px-3 py-1.5 transition-colors text-lg leading-none">-</button>
      </div>

      {/* LAYER 1: 3D Orbital Map */}
      <div
        className={`relative w-full max-w-[500px] aspect-square flex items-center justify-center transition-[filter,opacity] duration-700 ease-in-out pointer-events-auto ${focusedPlanet ? "blur-md opacity-30 pointer-events-none" : "blur-0 opacity-100"
          }`}
        style={{ perspective: "1000px" }}
      >
        <div
          className="absolute inset-0 w-full h-full flex items-center justify-center"
          style={{
            transform: `scale3d(${focusedPlanet ? zoom * 0.8 : zoom}, ${focusedPlanet ? zoom * 0.8 : zoom}, 1) rotateX(${TILT_ANGLE}deg)`,
            transformStyle: "preserve-3d",
            transition: "transform 0.1s ease-out"
          }}
        >
          {/* Faint Orbital Grid Base */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] rounded-full opacity-30"></div>

          {/* Core Star */}
          <div
            className="absolute z-10 w-12 h-12 rounded-full flex items-center justify-center pointer-events-auto cursor-help"
            style={{
              transform: `rotateX(-${TILT_ANGLE}deg)`,
              background: `radial-gradient(circle at 40% 40%, #fff, ${activeSystem.color} 40%, #000 90%)`,
              boxShadow: `0 0 40px ${activeSystem.color}, 0 0 100px ${activeSystem.color}`,
            }}
            title={`${activeSystem.name} (Class ${activeSystem.type})`}
          ></div>

          {/* Render Extracted Planets */}
          {planets.map((planet, idx) => (
            <PlanetOrbit
              key={idx}
              planet={planet}
              idx={idx}
              totalPlanets={planets.length}
              setFocusedPlanet={setFocusedPlanet}
              tiltAngle={TILT_ANGLE}
            />
          ))}
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

            <div
              className="w-64 h-64 rounded-full border border-black/50 animate-[pulse_4s_ease-in-out_infinite]"
              style={{
                backgroundColor: focusedPlanet.planetColor,
                backgroundImage: getPlanetTexture(focusedPlanet),
                boxShadow: `inset -20px -20px 40px rgba(0,0,0,0.9), 0 0 60px ${focusedPlanet.planetColor}40`
              }}
            ></div>
            <div className="mt-8 text-center">
              <div className="text-gray-500 font-mono text-xs mb-1 uppercase tracking-widest">Target Locked</div>
              <div className="text-2xl font-bold text-white tracking-widest uppercase">{focusedPlanet.planetName}</div>
            </div>
          </div>

          <div className="w-1/2 h-full flex flex-col justify-center p-12 bg-gray-950/80 backdrop-blur-sm border-l border-gray-800/50 overflow-y-auto">
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
                    {focusedPlanet.resourceList?.filter(r => r.rarity === "Rare").length || 0}
                  </span>
                </div>
              </div>

              {focusedPlanet.moons?.length > 0 && (
                <div className="bg-gray-900/50 border border-gray-800 rounded p-4">
                  <h3 className="text-[10px] text-gray-500 font-mono uppercase mb-3 border-b border-gray-800 pb-2">Satellite Bodies</h3>
                  <div className="flex flex-col gap-2">
                    {focusedPlanet.moons.map((moon, mIdx) => (
                      <div key={mIdx} className="flex justify-between items-center bg-gray-800/40 p-2 rounded border border-gray-700">
                        <span className="text-gray-300 font-semibold text-sm">
                          {typeof moon === "string" ? moon : (moon.name || `Moon ${mIdx + 1}`)}
                        </span>
                        {typeof moon !== "string" && moon.theme && (
                          <span className="text-[9px] uppercase tracking-widest text-purple-400 bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-800/50">
                            {moon.theme}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrbitalMap;