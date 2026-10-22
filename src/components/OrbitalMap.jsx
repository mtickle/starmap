import { useMemo, useState, useEffect } from "react";
import PlanetOrbit from "./PlanetOrbit.jsx";
import { getPlanetTexture, loadSupabaseTextures, subscribeToTextures } from "@utils/planetTextures.js";

// ==========================================
// BACKGROUND STAR & NEBULA GENERATOR
// ==========================================
const DeepSpaceBackground = () => {
  const { stars, nebulas } = useMemo(() => {
    const generatedStars = Array.from({ length: 200 }).map(() => ({
      cx: `${Math.random() * 100}%`,
      cy: `${Math.random() * 100}%`,
      r: Math.random() * 1.5 + 0.2,
      opacity: Math.random() * 0.6 + 0.1,
    }));

    const generatedNebulas = [
      { cx: "20%", cy: "30%", r: "150", fill: "rgba(100, 100, 255, 0.05)" },
      { cx: "80%", cy: "70%", r: "200", fill: "rgba(255, 100, 100, 0.04)" },
      { cx: "50%", cy: "50%", r: "250", fill: "rgba(150, 50, 200, 0.03)" },
    ];
    return { stars: generatedStars, nebulas: generatedNebulas };
  }, []);

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="nebula-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="40" />
        </filter>
      </defs>
      {nebulas.map((neb, i) => (
        <circle
          key={`neb-${i}`}
          cx={neb.cx}
          cy={neb.cy}
          r={neb.r}
          fill={neb.fill}
          filter="url(#nebula-blur)"
        />
      ))}
      {stars.map((star, i) => (
        <circle
          key={`star-${i}`}
          cx={star.cx}
          cy={star.cy}
          r={star.r}
          fill={`rgba(255,255,255,${star.opacity})`}
        />
      ))}
    </svg>
  );
};

const CloudWarningBanner = ({ texturesReady }) => {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // If textures haven't loaded after 5 seconds, surface the warning
    const timer = setTimeout(() => {
      if (!texturesReady) setShowWarning(true);
    }, 500000);
    return () => clearTimeout(timer);
  }, [texturesReady]);

  if (texturesReady || !showWarning) return null;

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 animate-[fadeIn_0.3s_ease-out]">
      <div className="bg-red-950/80 border border-red-900 text-red-400 px-4 py-2 rounded shadow-[0_0_15px_rgba(220,38,38,0.3)] backdrop-blur flex items-center gap-3 text-xs font-mono uppercase tracking-widest">
        <span className="text-lg leading-none">⚠️</span>
        <span>CloudLink Offline: Experiencing Gateway Delays</span>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENT: Orbital Radar Map (Main)
// ==========================================
export const OrbitalMap = ({ activeSystem }) => {
  // Safety check in case the component mounts before activeSystem is ready
  if (!activeSystem) return null;

  const planets = activeSystem.planets || [];
  const [focusedPlanet, setFocusedPlanet] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [texturesReady, setTexturesReady] = useState(false);

  // Fetch the cloud textures on mount
  useEffect(() => {
    loadSupabaseTextures();
    const unsubscribe = subscribeToTextures(() => setTexturesReady(true));
    return unsubscribe;
  }, []);

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
      <CloudWarningBanner texturesReady={texturesReady} />


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

      {/* ZOOM UI HUD */}
      <div className="absolute top-4 right-4 z-40 flex flex-col bg-gray-950/80 border border-gray-800 rounded shadow-lg backdrop-blur text-gray-400 font-mono text-center overflow-hidden">
        <button
          onClick={() => setZoom((z) => Math.min(z + 0.2, 3.5))}
          className="hover:text-white hover:bg-gray-800 px-3 py-1.5 transition-colors border-b border-gray-800 text-lg leading-none"
        >
          +
        </button>
        <button
          onClick={() => setZoom(1)}
          className="hover:text-white hover:bg-gray-800 px-2 py-1.5 transition-colors border-b border-gray-800 text-[10px] uppercase font-bold tracking-wider"
          title="Reset View"
        >
          Reset
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(z - 0.2, 0.3))}
          className="hover:text-white hover:bg-gray-800 px-3 py-1.5 transition-colors text-lg leading-none"
        >
          -
        </button>
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
            transform: `scale3d(${focusedPlanet ? zoom * 0.8 : zoom}, ${focusedPlanet ? zoom * 0.8 : zoom
              }, 1) rotateX(${TILT_ANGLE}deg)`,
            transformStyle: "preserve-3d",
            transition: "transform 0.1s ease-out",
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
          <div className="w-1/2 h-full flex flex-col justify-center items-center bg-gradient-to-r from-gray-950 to-transparent relative overflow-hidden">
            <button
              onClick={() => setFocusedPlanet(null)}
              className="absolute top-6 left-6 text-gray-400 hover:text-white flex items-center gap-2 font-mono text-xs uppercase tracking-widest transition-colors bg-gray-900/50 px-3 py-1.5 rounded border border-gray-700 hover:border-gray-500 backdrop-blur z-50"
            >
              <span>←</span> Abort Lock
            </button>

            {/* DYNAMIC TARGET LOCK 3D ORBITAL VIEW */}
            <div
              className="relative flex items-center justify-center w-[400px] h-[400px]"
              style={{ perspective: "1000px" }}
            >
              <div
                className="absolute top-1/2 left-1/2 w-0 h-0"
                style={{
                  transform: `translate(-50%, -50%) rotateX(${TILT_ANGLE}deg)`,
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Core Planet */}
                {(() => {
                  const textureUrl = getPlanetTexture(focusedPlanet.planetType, focusedPlanet.planetName);

                  return (
                    <div
                      className="absolute top-1/2 left-1/2 rounded-full border border-black/50 z-20"
                      style={{
                        width: "256px",
                        height: "256px",
                        transform: `translate(-50%, -50%) rotateX(-${TILT_ANGLE}deg)`,
                        backgroundColor: focusedPlanet.planetColor,
                        backgroundImage: textureUrl ? `url(${textureUrl})` : "none",
                        backgroundSize: "200% 100%",
                        backgroundRepeat: "repeat-x",
                        animation: "spin-planet 25s linear infinite",
                        boxShadow: `
                          inset -35px -35px 60px rgba(0, 0, 0, 0.95),
                          inset 10px 10px 25px rgba(255, 255, 255, 0.15),
                          0 0 60px ${focusedPlanet.planetColor}40
                        `,
                      }}
                    />
                  );
                })()}

                {/* Orbiting Moons */}
                {focusedPlanet.moons?.map((moon, mIdx) => {
                  const moonRingSize = 340 + mIdx * 50;
                  const moonAngle = (mIdx * 105) % 360;
                  const moonDuration = 12 + mIdx * 8;
                  const moonSize = 12 + (mIdx % 3) * 2;

                  const isString = typeof moon === "string";
                  const moonName = isString ? moon : moon.name || `Moon ${mIdx + 1}`;
                  const moonColor = isString ? "#888" : moon.color || "#a1a1aa";

                  return (
                    <div
                      key={mIdx}
                      className="absolute top-1/2 left-1/2 pointer-events-none"
                      style={{
                        width: `${moonRingSize}px`,
                        height: `${moonRingSize}px`,
                        transform: `translate(-50%, -50%) rotate(${moonAngle}deg)`,
                        transformStyle: "preserve-3d",
                      }}
                    >
                      <div
                        className="w-full h-full rounded-full border border-gray-500/40 border-dotted"
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
                                  transform: `rotateX(-${TILT_ANGLE}deg)`,
                                }}
                              >
                                <div
                                  className="rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.9)] border border-black/80 pointer-events-auto cursor-help"
                                  style={{
                                    width: `${moonSize}px`,
                                    height: `${moonSize}px`,
                                    backgroundColor: moonColor,
                                    backgroundImage: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, rgba(0,0,0,0.85) 85%)`,
                                  }}
                                  title={moonName}
                                ></div>
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

            <div className="mt-8 text-center z-10">
              <div className="text-gray-500 font-mono text-xs mb-1 uppercase tracking-widest">
                Target Locked
              </div>
              <div className="text-2xl font-bold text-white tracking-widest uppercase">
                {focusedPlanet.planetName}
              </div>
            </div>
          </div>

          <div className="w-1/2 h-full flex flex-col justify-center p-12 bg-gray-950/80 backdrop-blur-sm border-l border-gray-800/50 overflow-y-auto">
            <div className="space-y-6">
              <div
                className="border-l-2 pl-4"
                style={{ borderColor: focusedPlanet.planetColor }}
              >
                <h3 className="text-sm font-mono text-gray-400 uppercase tracking-widest mb-1">
                  Classification
                </h3>
                <p className="text-xl text-gray-200 font-semibold">
                  {focusedPlanet.planetType}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-900/50 border border-gray-800 rounded p-3">
                  <p className="text-[10px] text-gray-500 font-mono uppercase mb-1">
                    Gravity Profile
                  </p>
                  <p className="text-lg text-gray-300 font-semibold">
                    {focusedPlanet.gravity} G
                  </p>
                </div>
                <div className="bg-gray-900/50 border border-gray-800 rounded p-3">
                  <p className="text-[10px] text-gray-500 font-mono uppercase mb-1">
                    Orbital Cycle
                  </p>
                  <p className="text-lg text-gray-300 font-semibold">
                    {focusedPlanet.orbitalPeriod} Days
                  </p>
                </div>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded p-4">
                <h3 className="text-[10px] text-gray-500 font-mono uppercase mb-3 border-b border-gray-800 pb-2">
                  Biosphere Scan
                </h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Flora Strains:</span>
                  <span className="text-green-400 font-mono">
                    {focusedPlanet.floraList?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Fauna Species:</span>
                  <span className="text-teal-400 font-mono">
                    {focusedPlanet.faunaList?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Rare Deposits:</span>
                  <span className="text-purple-400 font-mono">
                    {focusedPlanet.resourceList?.filter((r) => r.rarity === "Rare").length || 0}
                  </span>
                </div>
              </div>

              {focusedPlanet.moons?.length > 0 && (
                <div className="bg-gray-900/50 border border-gray-800 rounded p-4">
                  <h3 className="text-[10px] text-gray-500 font-mono uppercase mb-3 border-b border-gray-800 pb-2">
                    Satellite Bodies
                  </h3>
                  <div className="flex flex-col gap-2">
                    {focusedPlanet.moons.map((moon, mIdx) => (
                      <div
                        key={mIdx}
                        className="flex justify-between items-center bg-gray-800/40 p-2 rounded border border-gray-700"
                      >
                        <span className="text-gray-300 font-semibold text-sm">
                          {typeof moon === "string" ? moon : moon.name || `Moon ${mIdx + 1}`}
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