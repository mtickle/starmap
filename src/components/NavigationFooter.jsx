import React, { useState, useEffect } from 'react';

const NavigationFooter = ({ visibleStars = [] }) => {
    const [discoveredCount, setDiscoveredCount] = useState(0);

    // Calculate total possible stars in the active view
    const starsOnScreen = visibleStars.length;

    // Fetch the visited stars from local storage on render
    useEffect(() => {
        try {
            const visited = JSON.parse(localStorage.getItem('visitedStars')) || [];
            setDiscoveredCount(visited.length);
        } catch (error) {
            console.error("Failed to parse visited stars:", error);
            setDiscoveredCount(0);
        }
    }, [visibleStars]); // Re-run if the sector changes (optional, keeps it fresh)

    return (
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

            {/* Right Side: Galactic Progress */}
            <div className="flex items-center gap-4">
                <span className="text-blue-400">
                    Galactic Archive: <span className="text-white font-bold">{discoveredCount}</span> Systems Logged
                </span>
            </div>

        </div>
    );
};

export default NavigationFooter;