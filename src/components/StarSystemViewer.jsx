import { useEffect, useState } from "react";
import OrbitalMap from "./OrbitalMap"; // Import the OrbitalMap component
import PlanetCard from "./PlanetCard";

// ==========================================
// COMPONENT: Orbital Radar Map (Moved Outside)
// ==========================================
// export const OrbitalMap = ({ activeSystem }) => {
//   const planets = activeSystem.planets || [];

//   return (
//     <div className="relative w-full aspect-square max-h-[600px] mx-auto bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden flex items-center justify-center shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]">
//       {/* Background Grid/Radar styling */}
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

//       {/* The Central Star */}
//       <div
//         className="absolute z-10 w-12 h-12 rounded-full"
//         style={{
//           background: `radial-gradient(circle at 40% 40%, #fff, ${activeSystem.color} 40%, #000 90%)`,
//           boxShadow: `0 0 40px ${activeSystem.color}, 0 0 100px ${activeSystem.color}`,
//         }}
//       ></div>

//       {/* Orbital Rings and Planets */}
//       {planets.map((planet, idx) => {
//         const ringSize = ((idx + 1) / (planets.length + 1)) * 90;
//         const angle = (idx * 137.5) % 360;
//         const planetSize = Math.max(12, Math.min(24, planet.gravity * 15));

//         return (
//           <div
//             key={idx}
//             className="absolute rounded-full border border-gray-700/60 border-dashed animate-[spin_120s_linear_infinite]"
//             style={{
//               width: `${ringSize}%`,
//               height: `${ringSize}%`,
//               animationDuration: `${(idx + 1) * 40}s`,
//             }}
//           >
//             <div
//               className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
//               style={{ transform: `rotate(${angle}deg)` }}
//             >
//               <div
//                 className="rounded-full shadow-[0_0_10px_rgba(0,0,0,0.8)] hover:scale-125 transition-transform border border-black/50"
//                 style={{
//                   width: `${planetSize}px`,
//                   height: `${planetSize}px`,
//                   background: `radial-gradient(circle at 30% 30%, ${planet.planetColor}, #000 80%)`,
//                 }}
//               ></div>
//               <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-gray-950/90 text-xs px-3 py-1.5 rounded border border-gray-700 pointer-events-none z-50">
//                 <p className="font-bold text-white mb-0.5">
//                   {planet.planetName}
//                 </p>
//                 <p className="text-gray-400">{planet.planetType}</p>
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// ==========================================
// COMPONENT: Main Viewer Wrapper
// ==========================================
const StarSystemViewer = ({ activeSystem, onClose }) => {
  // --- STATE ---
  const [viewMode, setViewMode] = useState("radar"); // Moved inside component
  const [homeId, setHomeId] = useState(null);
  const [showOverrideWarning, setShowOverrideWarning] = useState(false);

  useEffect(() => {
    try {
      const homeData = JSON.parse(localStorage.getItem("homeSystem"));
      setHomeId(
        homeData?.id || (typeof homeData === "string" ? homeData : null)
      );
    } catch (e) {
      console.error("Could not parse home system", e);
    }
  }, []);

  // --- ACTIONS ---
  const handleSetHome = () => {
    localStorage.setItem("homeSystem", JSON.stringify({ id: activeSystem.id }));
    setHomeId(activeSystem.id);
    setShowOverrideWarning(false);
  };

  const handleRemoveHome = () => {
    localStorage.removeItem("homeSystem");
    setHomeId(null);
  };

  const requestSetHome = () => {
    if (homeId && homeId !== activeSystem.id) {
      setShowOverrideWarning(true);
    } else {
      handleSetHome();
    }
  };

  // --- DISTANCE MATH ---
  let distanceToHome = null;
  const isHomeSystem = homeId === activeSystem.id;

  if (homeId && !isHomeSystem) {
    try {
      const safeHome = String(homeId);
      const safeActive = String(activeSystem.id);
      const coordRegex = /X:(-?\d+)_Y:(-?\d+)/;

      const homeMatch = safeHome.match(coordRegex);
      const activeMatch = safeActive.match(coordRegex);

      if (homeMatch && activeMatch) {
        const hX = parseInt(homeMatch[1], 10);
        const hY = parseInt(homeMatch[2], 10);
        const cX = parseInt(activeMatch[1], 10);
        const cY = parseInt(activeMatch[2], 10);

        if (!isNaN(hX) && !isNaN(hY) && !isNaN(cX) && !isNaN(cY)) {
          const rawDistance = Math.sqrt(
            Math.pow(cX - hX, 2) + Math.pow(cY - hY, 2)
          );
          distanceToHome = (rawDistance * 14.2).toFixed(1);
        }
      } else {
        console.warn(
          "Coordinate format mismatch. Expected X:#_Y:#. Got:",
          safeHome,
          safeActive
        );
      }
    } catch (e) {
      console.error("Distance calculation failed", e);
    }
  }

  if (!activeSystem) return null;

  return (
    <div className="flex flex-col h-full w-full bg-gray-900 text-gray-200 p-6 overflow-y-auto">
      {/* Header Container */}
      <div className="flex justify-between items-start border-b border-gray-700 pb-4 mb-6">
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

          <div className="flex flex-wrap items-center gap-2 mt-3">
            {isHomeSystem && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-900/40 border border-yellow-600/60 text-xs shadow-[0_0_8px_rgba(202,138,4,0.2)]">
                <span className="text-yellow-500">★</span>
                <span className="text-yellow-400 font-bold uppercase tracking-wider">
                  Home System
                </span>
              </div>
            )}

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-800/80 border border-gray-700 text-xs">
              <span className="text-gray-500">XYZ:</span>
              <span className="text-gray-300 font-mono tracking-wider">
                {activeSystem.id}
              </span>
            </div>

            {distanceToHome !== null && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/40 border border-indigo-800/50 text-xs shadow-[0_0_8px_rgba(99,102,241,0.1)]">
                <span className="text-indigo-500/70">Core Dist:</span>
                <span className="text-indigo-300 font-mono font-semibold">
                  {distanceToHome} LY
                </span>
              </div>
            )}

            <div className="flex items-center px-3 py-1 rounded-full bg-orange-950/40 border border-orange-800/50 text-xs text-orange-300 font-semibold">
              Class {activeSystem.type} Star
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/40 border border-blue-800/50 text-xs">
              <span className="text-blue-500/70">Control:</span>
              <span className="text-blue-300 font-semibold truncate max-w-[150px]">
                {activeSystem.faction?.name || "Uncharted"}
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-800/80 border border-gray-700 text-xs">
              <span className="text-gray-500">Planets:</span>
              <span className="text-gray-300 font-semibold">
                {activeSystem.planets?.length || 0}
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-800/80 border border-gray-700 text-xs">
              <span className="text-gray-500">Stations:</span>
              <span className="text-gray-300 font-semibold">
                {activeSystem.stations?.length || 0}
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-950/40 border border-green-800/50 text-xs">
              <span className="text-green-500/70">Econ:</span>
              <span className="text-green-400 font-semibold">
                {activeSystem.economy || "None"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {isHomeSystem ? (
            <button
              onClick={handleRemoveHome}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded border border-gray-600 transition-colors text-xs uppercase tracking-wider font-semibold"
            >
              Remove Home
            </button>
          ) : showOverrideWarning ? (
            <div className="flex items-center gap-2 bg-red-950/50 border border-red-900 rounded p-1 pl-3 shadow-[0_0_10px_rgba(220,38,38,0.2)]">
              <span className="text-xs text-red-400 font-semibold uppercase tracking-wider mr-1">
                Override Current Home?
              </span>
              <button
                onClick={handleSetHome}
                className="px-3 py-1.5 bg-red-700 hover:bg-red-600 text-white rounded transition-colors text-xs font-bold"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowOverrideWarning(false)}
                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded transition-colors text-xs"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={requestSetHome}
              className="px-4 py-2 bg-indigo-900/50 hover:bg-indigo-700 text-indigo-200 rounded border border-indigo-800 transition-colors text-xs uppercase tracking-wider font-semibold"
            >
              Set as Home
            </button>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-900/50 hover:bg-red-700 text-red-200 rounded border border-red-800 transition-colors text-xs uppercase tracking-wider font-semibold"
          >
            Close Scanner
          </button>
        </div>
      </div>

      {/* Restored Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Restored Sidebar */}
        {/* <SystemSidebar system={activeSystem} /> */}

        <div className="lg:col-span-3 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-white">
              {viewMode === "radar" ? "System Radar" : "Planetary Data"}
            </h2>
            <div className="flex bg-gray-900 border border-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode("radar")}
                className={`px-4 py-1 text-xs font-semibold rounded uppercase tracking-wider transition-colors ${
                  viewMode === "radar"
                    ? "bg-gray-700 text-white"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                Radar
              </button>
              <button
                onClick={() => setViewMode("data")}
                className={`px-4 py-1 text-xs font-semibold rounded uppercase tracking-wider transition-colors ${
                  viewMode === "data"
                    ? "bg-gray-700 text-white"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                Data
              </button>
            </div>
          </div>

          {!activeSystem.planets || activeSystem.planets.length === 0 ? (
            <div className="p-8 text-center text-gray-500 bg-gray-800 rounded-lg border border-gray-700 border-dashed">
              No planetary bodies detected in this system.
            </div>
          ) : viewMode === "radar" ? (
            <OrbitalMap activeSystem={activeSystem} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeSystem.planets.map((planet, idx) => (
                <PlanetCard key={idx} planet={planet} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StarSystemViewer;
