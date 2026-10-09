import { useEffect, useState } from "react";
import AboutTheEngine from "./AboutTheEngine"; // Make sure this path matches where you saved it

const NavigationFooter = ({ visibleStars = [] }) => {
  const [discoveredCount, setDiscoveredCount] = useState(0);
  const [showAbout, setShowAbout] = useState(false); // State for the About modal

  // Calculate total possible stars in the active view
  const starsOnScreen = visibleStars.length;

  // Fetch the visited stars from local storage on render
  useEffect(() => {
    try {
      const visited = JSON.parse(localStorage.getItem("visitedStars")) || [];
      setDiscoveredCount(visited.length);
    } catch (error) {
      console.error("Failed to parse visited stars:", error);
      setDiscoveredCount(0);
    }
  }, [visibleStars]);


  const handleUniversalReset = () => {
    if (window.confirm("Initiate Universal Reset? All localized star data and exploration history will be wiped.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

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
            Sensors detect{" "}
            <span className="text-white font-bold">{starsOnScreen}</span>{" "}
            stellar bodies in range
          </span>
        </div>

        {/* Right Side: Galactic Progress & Engine Info */}
        <div className="flex items-center gap-6">
          <span className="text-blue-400">
            Galactic Archive:{" "}
            <span className="text-white font-bold">{discoveredCount}</span>{" "}
            Systems Logged
          </span>

          {/* The Trigger Button */}
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
