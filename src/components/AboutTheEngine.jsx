import { useState } from "react";

const AboutTheEngine = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("lore");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 w-full max-w-4xl max-h-[90vh] rounded-lg border border-gray-700 shadow-2xl shadow-blue-900/20 flex flex-col overflow-hidden text-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800 bg-gray-950">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-widest uppercase flex items-center gap-3">
              <span className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]"></span>
              Engine Architecture
            </h2>
            <p className="text-gray-500 text-sm mt-1 font-mono">
              // SYSTEM_QUERY: GENERATION_MECHANICS
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2"
            >
              ✕
            </button>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-800 bg-gray-900/50 text-sm uppercase tracking-wider font-semibold font-mono">
          <button
            onClick={() => setActiveTab("lore")}
            className={`flex-1 py-4 text-center transition-colors ${
              activeTab === "lore"
                ? "text-blue-400 border-b-2 border-blue-500 bg-gray-800/50"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            Terminal Access: Lore
          </button>
          <button
            onClick={() => setActiveTab("eli5")}
            className={`flex-1 py-4 text-center transition-colors ${
              activeTab === "eli5"
                ? "text-green-400 border-b-2 border-green-500 bg-gray-800/50"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            Developer Logs: ELI5
          </button>
        </div>

        {/* Content Area */}
        <div className="p-8 overflow-y-auto font-sans leading-relaxed">
          {activeTab === "lore" && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-l-4 border-blue-500 pl-4 mb-6">
                <p className="text-blue-400 font-mono text-xs mb-1">
                  Source: The Continuum Archive
                </p>
                <h3 className="text-xl text-white font-bold">
                  Quantum Determinism & Holographic Cartography
                </h3>
              </div>

              <p>
                The galaxy is vastly too large for any ship's mainframe to hold
                in standard memory banks. Attempting to store the topography,
                atmospheric data, and biological profiles of billions of
                celestial bodies would instantly overload a standard navigation
                computer.
              </p>
              <p>
                Instead, modern exploratory vessels utilize{" "}
                <strong>Quantum Determinism</strong>.
              </p>
              <p>
                The universe exists not as a hard-coded map, but as a dense,
                mathematical probability equation. When your ship's sensors
                target a specific coordinate in the void, the nav-computer
                forces the quantum wave to collapse into a defined reality. The
                planets, the flora, the weather patterns, and the civilizations
                you encounter aren't retrieved from a central database; they are
                calculated into existence the exact moment you observe them.
              </p>
              <div className="bg-gray-800/50 p-4 rounded border border-gray-700 italic text-gray-400">
                "We do not explore a galaxy that is already built. We explore a
                galaxy that builds itself to meet our sensors." — Lead
                Cartographer, The Solar Accord
              </div>
            </div>
          )}

          {activeTab === "eli5" && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-l-4 border-green-500 pl-4 mb-6">
                <p className="text-green-400 font-mono text-xs mb-1">
                  Architecture: Procedural Generation
                </p>
                <h3 className="text-xl text-white font-bold">
                  The Filing Cabinet vs. The Calculator
                </h3>
              </div>

              <p>
                In traditional web architecture, creating a universe requires a{" "}
                <strong>Filing Cabinet</strong> (like PostgreSQL). When a planet
                is created, the app writes the results down and locks them in
                the database. Whenever a player looks at that sector, the app
                has to open the cabinet, find the file, and send it over the
                network.
              </p>
              <p>
                This procedural engine throws away the filing cabinet entirely.
                The universe is no longer a storage problem; it is a math
                problem.
              </p>

              <h4 className="text-lg font-semibold text-white mt-8 border-b border-gray-800 pb-2">
                The Magic of Seeded Randomness
              </h4>
              <p>
                Normal computer randomness (like{" "}
                <code className="bg-gray-800 text-pink-400 px-1 py-0.5 rounded text-sm">
                  Math.random()
                </code>
                ) pulls a completely unpredictable number out of thin air. But
                procedural generation uses a{" "}
                <strong>Pseudo-Random Number Generator (PRNG)</strong>. A PRNG
                requires a "seed" to start its math. If you feed a PRNG the
                exact same seed, it will output the exact same sequence of
                "random" numbers every single time, until the end of time.
              </p>
              <p>
                In this engine, the seed is simply the coordinate of the star
                (e.g.,{" "}
                <code className="bg-gray-800 text-green-400 px-1 py-0.5 rounded text-sm">
                  10_-45
                </code>
                ). When the camera pans to that coordinate:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-2">
                <li>
                  The engine rolls the first number: It determines the star is a
                  Blue Dwarf.
                </li>
                <li>It rolls the second number: It generates 3 planets.</li>
                <li>
                  It rolls a third number: Planet 1 is assigned a Tropical
                  biome.
                </li>
              </ul>
              <p>
                Because the math formula never changes, and the coordinate never
                changes, that exact Tropical world will generate today,
                tomorrow, and ten years from now, with zero database lookups.
              </p>

              <h4 className="text-lg font-semibold text-white mt-8 border-b border-gray-800 pb-2">
                Why It Needs No Database
              </h4>
              <p>
                Using the exact same technological foundation that allows No
                Man's Sky to fit 18 quintillion planets into a small hard drive
                install, this universe only exists when you are actively looking
                at it.
              </p>
              <p>
                When you pan the camera away, the star objects are completely
                wiped from your browser's memory. They vanish. But the second
                you pan back, the engine runs the coordinates through the exact
                same math, and the Tropical world instantly pops back into
                existence perfectly intact. The only data that requires saving
                to{" "}
                <code className="bg-gray-800 text-yellow-400 px-1 py-0.5 rounded text-sm">
                  localStorage
                </code>{" "}
                is your personal log of which mathematical coordinates you have
                actively visited.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-950 p-4 border-t border-gray-800 text-center text-xs font-mono text-gray-600">
          Procedural Engine v2.0 • Deterministic Generation Matrix Active
        </div>
      </div>
    </div>
  );
};

export default AboutTheEngine;
