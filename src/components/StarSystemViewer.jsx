import { useEffect, useState } from "react";
import {
  loadSupabaseTextures,
  subscribeToTextures,
} from "@utils/planetTextures.js";
import {
  loadStationTextures,
  subscribeToStationTextures,
} from "@utils/stationTextures.js";
import OrbitalMap from "./OrbitalMap";
import UnifiedPlanetCard from "./UnifiedPlanetCard";
import StationCard from "./StationCard";

// ==========================================
// COMPONENT: Main Viewer Wrapper
// ==========================================
const StarSystemViewer = ({ activeSystem, onClose }) => {
  // --- STATE ---
  const [homeId, setHomeId] = useState(null);
  const [showOverrideWarning, setShowOverrideWarning] = useState(false);
  const [activeTab, setActiveTab] = useState("planets"); // 'planets', 'stations', 'map', or 'data'
  const [textureTick, setTextureTick] = useState(0); // Forces card re-render when Supabase finishes listing

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

  // Ensure planet & station textures load immediately even before visiting the "Orbital Topology" tab
  useEffect(() => {
    let isMounted = true;

    const initTextures = async () => {
      try {
        await Promise.all([
          loadSupabaseTextures(() => {
            if (isMounted) setTextureTick((t) => t + 1);
          }),
          loadStationTextures(() => {
            if (isMounted) setTextureTick((t) => t + 1);
          }),
        ]);
      } catch (err) {
        console.error("Texture initialization error in Viewer:", err);
      }
    };

    initTextures();

    const unsubPlanets = subscribeToTextures(() => {
      if (isMounted) setTextureTick((t) => t + 1);
    });
    const unsubStations = subscribeToStationTextures(() => {
      if (isMounted) setTextureTick((t) => t + 1);
    });

    return () => {
      isMounted = false;
      if (typeof unsubPlanets === "function") unsubPlanets();
      if (typeof unsubStations === "function") unsubStations();
    };
  }, []);

  // --- ACTIONS ---
  const handleSetHome = () => {
    localStorage.setItem(
      "homeSystem",
      JSON.stringify({
        id: activeSystem.id,
        name: activeSystem.name,
      })
    );
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
  const isHomeSystem = homeId === activeSystem?.id;

  if (homeId && activeSystem && !isHomeSystem) {
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
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-900/40 border border-yellow-600/60 text-sm shadow-[0_0_8px_rgba(202,138,4,0.2)]">
                <span className="text-yellow-500">★</span>
                <span className="text-yellow-400 font-bold uppercase tracking-wider">
                  Home System
                </span>
              </div>
            )}

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-800/80 border border-gray-700 text-sm">
              <span className="text-gray-500">XYZ:</span>
              <span className="text-gray-300 font-mono tracking-wider">
                {activeSystem.id}
              </span>
            </div>

            {distanceToHome !== null && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/40 border border-indigo-800/50 text-sm shadow-[0_0_8px_rgba(99,102,241,0.1)]">
                <span className="text-indigo-500/70">Core Dist:</span>
                <span className="text-indigo-300 font-mono font-semibold">
                  {distanceToHome} LY
                </span>
              </div>
            )}

            <div className="flex items-center px-3 py-1 rounded-full bg-orange-950/40 border border-orange-800/50 text-sm text-orange-300 font-semibold">
              Class {activeSystem.type} Star
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/40 border border-blue-800/50 text-sm">
              <span className="text-blue-500/70">Control:</span>
              <span className="text-blue-300 font-semibold truncate max-w-[150px]">
                {activeSystem.faction?.name || "Uncharted"}
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-800/80 border border-gray-700 text-sm">
              <span className="text-gray-500">Planets:</span>
              <span className="text-gray-300 font-semibold">
                {activeSystem.planets?.length || 0}
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-800/80 border border-gray-700 text-sm">
              <span className="text-gray-500">Stations:</span>
              <span className="text-gray-300 font-semibold">
                {activeSystem.stations?.length || 0}
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-950/40 border border-green-800/50 text-sm">
              <span className="text-green-500/70">Econ:</span>
              <span className="text-green-400 font-semibold">
                {activeSystem.economy || "None"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons (Condensed) */}
        <div className="flex items-center gap-2 shrink-0">
          {isHomeSystem ? (
            <button
              onClick={handleRemoveHome}
              title="Remove this system as your Home System"
              className="px-3 py-1.5 bg-yellow-900/30 hover:bg-yellow-900/60 text-yellow-500 border border-yellow-700/50 rounded transition-colors text-[14px] uppercase tracking-widest font-bold flex items-center gap-1"
            >
              <span>★</span> Clear Home
            </button>
          ) : showOverrideWarning ? (
            <div className="flex items-center gap-1 bg-red-950/50 border border-red-900 rounded p-0.5">
              <button
                onClick={handleSetHome}
                className="px-3 py-1 bg-red-700 hover:bg-red-600 text-white rounded text-[10px] font-bold uppercase tracking-wider"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowOverrideWarning(false)}
                className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-[10px] uppercase tracking-wider"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={requestSetHome}
              className="px-3 py-1.5 bg-gray-800/50 hover:bg-gray-700 text-gray-400 border border-gray-700 rounded transition-colors text-[14px] uppercase tracking-widest font-bold flex items-center gap-1"
            >
              <span>☆</span> Set Home
            </button>
          )}

          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-red-950/50 hover:bg-red-900/80 text-red-400 border border-red-900/50 rounded transition-colors text-[14px] uppercase tracking-widest font-bold ml-2"
          >
            ✕ Close
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-gray-900 border border-gray-700 rounded-lg p-1 w-fit mb-6">
        <button
          onClick={() => setActiveTab("planets")}
          className={`px-5 py-1.5 text-sm font-semibold rounded uppercase tracking-wider transition-colors ${activeTab === "planets"
            ? "bg-gray-700 text-white"
            : "text-gray-500 hover:text-gray-300"
            }`}
        >
          Planets ({activeSystem.planets?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("stations")}
          className={`px-5 py-1.5 text-sm font-semibold rounded uppercase tracking-wider transition-colors ${activeTab === "stations"
            ? "bg-gray-700 text-white"
            : "text-gray-500 hover:text-gray-300"
            }`}
        >
          Stations ({activeSystem.stations?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("map")}
          className={`px-5 py-1.5 text-sm font-semibold rounded uppercase tracking-wider transition-colors ${activeTab === "map"
            ? "bg-gray-700 text-white"
            : "text-gray-500 hover:text-gray-300"
            }`}
        >
          System Map
        </button>
        <button
          onClick={() => setActiveTab("data")}
          className={`px-5 py-1.5 text-sm font-semibold rounded uppercase tracking-wider transition-colors ${activeTab === "data"
            ? "bg-gray-700 text-white"
            : "text-gray-500 hover:text-gray-300"
            }`}
        >
          Data
        </button>
      </div>

      {/* Tab Content Area */}
      <div className="w-full">
        {/* TAB 1: UNIFIED PLANET CARDS */}
        {activeTab === "planets" && (
          <section className="flex flex-col gap-4">
            {!activeSystem.planets || activeSystem.planets.length === 0 ? (
              <div className="p-8 text-center text-gray-500 bg-gray-800 rounded-lg border border-gray-700 border-dashed">
                No planetary bodies detected in this system.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
                {activeSystem.planets.map((planet, idx) => (
                  <UnifiedPlanetCard
                    key={`${planet.planetId || idx}-${textureTick}`}
                    planet={planet}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB 2: UNIFIED STATION CARDS */}
        {activeTab === "stations" && (
          <section className="flex flex-col gap-4">
            {!activeSystem.stations || activeSystem.stations.length === 0 ? (
              <div className="p-8 text-center text-gray-500 bg-gray-800 rounded-lg border border-gray-700 border-dashed">
                No orbital stations detected in this sector.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
                {activeSystem.stations.map((station, idx) => (
                  <StationCard
                    key={`station-${station.id || idx}-${textureTick}`}
                    station={station}
                    idx={idx}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB 3: ORBITAL MAP */}
        {activeTab === "map" && (
          <section className="flex flex-col gap-4">
            {(!activeSystem.planets || activeSystem.planets.length === 0) &&
              (!activeSystem.stations || activeSystem.stations.length === 0) ? (
              <div className="p-8 text-center text-gray-500 bg-gray-800 rounded-lg border border-gray-700 border-dashed">
                Orbital topology unavailable (no bodies or stations detected).
              </div>
            ) : (
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 overflow-hidden relative min-h-[500px]">
                <OrbitalMap activeSystem={activeSystem} />
              </div>
            )}
          </section>
        )}

        {/* TAB 4: RAW DATA VIEWER */}
        {activeTab === "data" && (
          <section className="bg-black/40 border border-gray-800 rounded-lg p-4">
            <pre className="text-[10px] md:text-xs text-green-500/80 font-mono leading-relaxed overflow-auto max-h-[70vh]">
              {JSON.stringify(activeSystem, null, 2)}
            </pre>
          </section>
        )}
      </div>
    </div>
  );
};

export default StarSystemViewer;