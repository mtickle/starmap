// ==========================================
// COMPONENT: Individual Planet Orbit
// ==========================================
import { getPlanetTexture } from "@utils/textureUtils.js";
import MoonOrbit from "./MoonOrbit.jsx";

const PlanetOrbit = ({ planet, idx, totalPlanets, setFocusedPlanet, tiltAngle }) => {
    const minRing = 25;
    const maxRing = 95;
    const ringSize = totalPlanets === 1 ? 60 : minRing + (idx * ((maxRing - minRing) / (totalPlanets - 1)));
    const angle = (idx * 137.5) % 360;
    const planetSize = Math.max(12, Math.min(24, planet.gravity * 15));
    const orbitDuration = (idx + 1) * 40;

    return (
        <div
            className="absolute inset-0 m-auto aspect-square pointer-events-none"
            style={{ width: `${ringSize}%`, transform: `rotate(${angle}deg)`, transformStyle: "preserve-3d" }}
        >
            <div
                className="w-full h-full rounded-full border border-gray-700/60 border-dashed"
                style={{ animation: `orbit-spin ${orbitDuration}s linear infinite`, transformStyle: "preserve-3d" }}
            >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20" style={{ transformStyle: "preserve-3d" }}>
                    <div style={{ animation: `orbit-spin ${orbitDuration}s linear infinite reverse`, transformStyle: "preserve-3d" }}>
                        <div style={{ transform: `rotate(-${angle}deg)`, transformStyle: "preserve-3d" }}>
                            <div style={{ transform: `rotateX(-${tiltAngle}deg)` }}>

                                {/* NESTED GROUP: Planet + Moons sharing hover state */}
                                <div className="relative flex items-center justify-center pointer-events-none">
                                    <div
                                        onClick={() => setFocusedPlanet(planet)}
                                        className="p-8 group relative flex items-center justify-center cursor-crosshair pointer-events-auto z-20"
                                    >
                                        {/* PLANET VISUAL */}
                                        <div
                                            className="rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.9)] group-hover:scale-125 transition-transform border border-black/50 hover:ring-2 hover:ring-white/50 relative z-30"
                                            style={{
                                                width: `${planetSize}px`,
                                                height: `${planetSize}px`,
                                                backgroundColor: planet.planetColor,
                                                backgroundImage: getPlanetTexture(planet),
                                            }}
                                        ></div>

                                        {/* PLANET TOOLTIP */}
                                        <div className="absolute top-[80%] left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-gray-950/90 text-xs px-3 py-1.5 rounded border border-gray-700 pointer-events-none shadow-xl z-50">
                                            <p className="font-bold text-white mb-0.5">{planet.planetName}</p>
                                        </div>

                                        {/* MOON ORBITS (Hidden by default, fade in on group hover) */}
                                        {planet.moons?.length > 0 && (
                                            <div
                                                className="absolute top-1/2 left-1/2 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                                                style={{ transform: `translate(-50%, -50%) rotateX(${tiltAngle}deg)`, transformStyle: "preserve-3d" }}
                                            >
                                                {planet.moons.map((moon, mIdx) => (
                                                    <MoonOrbit
                                                        key={mIdx}
                                                        moon={moon}
                                                        mIdx={mIdx}
                                                        planetSize={planetSize}
                                                        tiltAngle={tiltAngle}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanetOrbit;