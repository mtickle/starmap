import { useState, useEffect } from "react";

const WelcomeModal = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Check if user has already seen the welcome message in this browser session
        const hasSeenWelcome = sessionStorage.getItem("starmap_welcomed");
        if (!hasSeenWelcome) {
            setIsOpen(true);
        }
    }, []);

    const handleDismiss = () => {
        sessionStorage.setItem("starmap_welcomed", "true");
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
            <div className="bg-gray-950 border border-purple-900/60 rounded-xl max-w-lg w-full p-6 shadow-2xl shadow-purple-950/40 font-mono text-gray-300 space-y-4">

                {/* Header */}
                <div className="border-b border-gray-800 pb-3 flex items-center justify-between">
                    <h2 className="text-lg font-bold tracking-widest text-white uppercase">
                        Welcome to Stellar Cartography
                    </h2>
                    <span className="text-xs text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800">
                        v1.0.4
                    </span>
                </div>

                {/* Body Description */}
                <div className="text-xs space-y-3 leading-relaxed text-gray-400">
                    <p>
                        Sector telemetry online. You are viewing the localized procedural star map. Use this command deck to navigate celestial coordinates, audit planetary resources, and inspect system factions.
                    </p>

                    <div className="bg-gray-900/80 p-3 rounded border border-gray-800 space-y-1.5 text-gray-300">
                        <span className="text-purple-300 font-bold uppercase block text-[10px] tracking-wider">Operational Directives:</span>
                        <p>• <strong className="text-white">Pan & Zoom:</strong> Click and drag to navigate coordinates, use your scroll wheel to adjust sector magnification.</p>
                        <p>• <strong className="text-white">System Audit:</strong> Click any star node to open the planetary system matrix and scan individual worlds.</p>
                        <p>• <strong className="text-white">Sector Filters:</strong> Use the top header controls to isolate star classes, factions, and inhabited worlds.</p>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="pt-2 flex justify-end">
                    <button
                        type="button"
                        onClick={handleDismiss}
                        className="bg-purple-950 hover:bg-purple-900 text-purple-200 hover:text-white px-5 py-2 rounded border border-purple-700 transition-all text-xs tracking-wider uppercase font-semibold shadow-[0_0_10px_rgba(147,51,234,0.3)]"
                    >
                        Initialize Cartography
                    </button>
                </div>

            </div>
        </div>
    );
};

export default WelcomeModal;