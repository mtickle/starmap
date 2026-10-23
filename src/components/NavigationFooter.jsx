import { useEffect, useState } from "react";
import AboutTheEngine from "./AboutTheEngine";

const NavigationFooter = ({ visibleStars = [], currentFocusId, onJumpToSystem }) => {
  const [discoveredCount, setDiscoveredCount] = useState(0);
  const [showAbout, setShowAbout] = useState(false);
  const [homeSystem, setHomeSystem] = useState(null);

  const starsOnScreen = visibleStars.length;

  useEffect(() => {
    try {
      const visited = JSON.parse(localStorage.getItem("visitedStars")) || [];
      setDiscoveredCount(visited.length);

      const homeData = JSON.parse(localStorage.getItem("homeSystem"));
      if (homeData) setHomeSystem(homeData);
    } catch (error) {
      console.error("Failed to parse navigation data:", error);
    }
  }, [visibleStars]);

  const handleGoHome = () => {
    if (homeSystem && homeSystem.id) {
      console.log("Jumping to home system:", homeSystem.id);
      if (onJumpToSystem) {
        onJumpToSystem(homeSystem.id);
      }
    } else {
      console.warn("No Home System coordinates found.");
    }
  };

  const handleUniversalReset = () => {
    if (window.confirm("Initiate Universal Reset? All localized star data and exploration history will be wiped.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // --- DISTANCE MATH ---
  let distanceToHome = null;
  if (homeSystem?.id && currentFocusId && homeSystem.id !== currentFocusId) {
    try {
      const coordRegex = /X:(-?\d+)_Y:(-?\d+)/;
      const homeMatch = String(homeSystem.id).match(coordRegex);
      const currentMatch = String(currentFocusId).match(coordRegex);

      if (homeMatch && currentMatch) {
        const hX = parseInt(homeMatch[1], 10);
        const hY = parseInt(homeMatch[2], 10);
        const cX = parseInt(currentMatch[1], 10);
        const cY = parseInt(currentMatch[2], 10);

        const rawDistance = Math.sqrt(Math.pow(cX - hX, 2) + Math.pow(cY - hY, 2));
        distanceToHome = (rawDistance * 14.2).toFixed(1);
      }
    } catch (e) {
      console.error("Distance calculation failed", e);
    }
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 w-full bg-gray-950 border-t border-gray-800 text-gray-400 p-2 px-6 flex justify-between items-center text-xs z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">

        {/* Left Side: Sector Status */}
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Local Sector Link Active
          </span>
          <span className="text-gray-600">|</span>
          <span>
            Sensors detect <span className="text-white font-bold">{starsOnScreen}</span> stellar bodies in range
          </span>
        </div>

        {/* Right Side: Galactic Progress & Engine Info */}
        <div className="flex items-center gap-4">
          <span className="text-blue-400 mr-2">
            Galactic Archive: <span className="text-white font-bold">{discoveredCount}</span> Systems Logged
          </span>

          {/* Go Home Button */}
          {homeSystem && (
            <button
              onClick={handleGoHome}
              className="flex items-center gap-2 px-3 py-1.5 bg-yellow-900/30 hover:bg-yellow-900/60 text-yellow-500 border border-yellow-700/50 rounded transition-colors text-[10px] uppercase tracking-widest font-bold"
              title={`Coordinates: ${homeSystem.id}`}
            >
              <span className="text-sm leading-none">★</span>
              <div className="flex flex-col items-start text-left leading-tight">
                <span>{homeSystem.name || "Return Home"}</span>
                {distanceToHome && (
                  <span className="text-[8px] text-yellow-600/80">{distanceToHome} LY Away</span>
                )}
              </div>
            </button>
          )}

          <button
            onClick={handleUniversalReset}
            className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/50 rounded transition-colors uppercase tracking-wider font-mono text-[10px]"
          >
            Universal Reset
          </button>

          <button
            onClick={() => setShowAbout(true)}
            className="flex items-center gap-2 text-gray-400 hover:text-white bg-gray-900 hover:bg-gray-800 border border-gray-700 px-3 py-1 rounded transition-colors font-mono uppercase tracking-wider"
          >
            <span>[?]</span> Engine Architecture
          </button>
        </div>
      </div>

      {/* The Modal */}
      {showAbout && <AboutTheEngine onClose={() => setShowAbout(false)} />}
    </>
  );
};

export default NavigationFooter;