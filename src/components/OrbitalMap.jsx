// ==========================================
// COMPONENT: Orbital Radar Map
// ==========================================
export const OrbitalMap = ({ activeSystem }) => {
  const planets = activeSystem.planets || [];

  return (
    <div className="flex justify-center items-center w-full bg-gray-900/50 rounded-xl border border-gray-800 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] overflow-hidden p-6">
      {/* Strict Square Container */}
      <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] rounded-full opacity-50"></div>

        {/* The Central Star */}
        <div
          className="absolute z-10 w-12 h-12 rounded-full"
          style={{
            background: `radial-gradient(circle at 40% 40%, #fff, ${activeSystem.color} 40%, #000 90%)`,
            boxShadow: `0 0 40px ${activeSystem.color}, 0 0 100px ${activeSystem.color}`,
          }}
        ></div>

        {/* Orbital Rings and Planets */}
        {planets.map((planet, idx) => {
          const ringSize = ((idx + 1) / (planets.length + 1)) * 95;
          const angle = (idx * 137.5) % 360;
          const planetSize = Math.max(12, Math.min(24, planet.gravity * 15));
          const orbitDuration = (idx + 1) * 40; // Seconds to complete an orbit

          return (
            <div
              key={idx}
              className="absolute inset-0 m-auto aspect-square"
              style={{
                width: `${ringSize}%`,
                transform: `rotate(${angle}deg)`, // Initial starting offset
              }}
            >
              {/* 1. The Orbiting Ring (Spins Forward) */}
              <div
                className="w-full h-full rounded-full border border-gray-700/60 border-dashed"
                style={{ animation: `spin ${orbitDuration}s linear infinite` }}
              >
                {/* Anchor to top of ring */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  {/* 2. The Gyroscope (Spins Backward to keep items level against the orbit) */}
                  <div
                    style={{
                      animation: `spin ${orbitDuration}s linear infinite reverse`,
                    }}
                  >
                    {/* 3. The Gimbal (Counters the initial starting offset) */}
                    <div style={{ transform: `rotate(-${angle}deg)` }}>
                      {/* 4. The Hitbox (Generous invisible padding so small planets are easy to hover) */}
                      <div className="p-5 group relative flex items-center justify-center cursor-pointer">
                        {/* 3D Planet Sphere */}
                        <div
                          className="rounded-full shadow-[0_0_10px_rgba(0,0,0,0.8)] group-hover:scale-125 transition-transform border border-black/50"
                          style={{
                            width: `${planetSize}px`,
                            height: `${planetSize}px`,
                            background: `radial-gradient(circle at 30% 30%, ${planet.planetColor}, #000 80%)`,
                          }}
                        ></div>

                        {/* Stabilized Tooltip */}
                        <div className="absolute top-[75%] left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-gray-950/90 text-xs px-3 py-1.5 rounded border border-gray-700 pointer-events-none shadow-xl">
                          <p className="font-bold text-white mb-0.5">
                            {planet.planetName}
                          </p>
                          <p className="text-gray-400">{planet.planetType}</p>
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
  );
};

export default OrbitalMap;
