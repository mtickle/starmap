import React from 'react';

const StarSystemViewer = ({ activeSystem, onClose }) => {
    if (!activeSystem) return null;

    console.log('Rendering StarSystemViewer for system:', activeSystem);

    return (
        <div className="flex flex-col h-full w-full bg-gray-900 text-gray-200 p-6 overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-700 pb-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <span
                            className="w-4 h-4 rounded-full shadow-md"
                            style={{ backgroundColor: activeSystem.color, boxShadow: `0 0 10px ${activeSystem.color}` }}
                        ></span>
                        {activeSystem.name} System
                    </h1>
                    <p className="text-gray-400 mt-1">
                        Class {activeSystem.type} Star | Controlled by: <span className="text-blue-400">{activeSystem.faction?.name || 'Uncharted'}</span>
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-red-900/50 hover:bg-red-700 text-red-200 rounded border border-red-800 transition-colors"
                >
                    Close Scanner
                </button>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* Left Sidebar: System Summary */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                        <h2 className="text-xl font-semibold mb-3 text-white border-b border-gray-700 pb-2">System Profile</h2>
                        <ul className="space-y-2 text-sm">
                            <li><span className="text-gray-400">Coordinates:</span> {activeSystem.id}</li>
                            <li><span className="text-gray-400">Planets:</span> {activeSystem.planets?.length || 0}</li>
                            <li><span className="text-gray-400">Space Stations:</span> {activeSystem.stations?.length || 0}</li>
                            <li><span className="text-gray-400">Economy:</span> {activeSystem.economy || 'None'}</li>
                        </ul>
                    </div>

                    {activeSystem.stations?.length > 0 && (
                        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                            <h2 className="text-xl font-semibold mb-3 text-white border-b border-gray-700 pb-2">Orbital Stations</h2>
                            <ul className="space-y-2 text-sm">
                                {activeSystem.stations.map((station, idx) => (
                                    <li key={idx} className="flex items-center gap-2">
                                        <span className="text-yellow-500">⬡</span> {station.name} ({station.type})
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Right Area: Planet Cards */}
                <div className="lg:col-span-3">
                    <h2 className="text-2xl font-semibold mb-4 text-white">Planetary Bodies</h2>

                    {(!activeSystem.planets || activeSystem.planets.length === 0) ? (
                        <div className="p-8 text-center text-gray-500 bg-gray-800 rounded-lg border border-gray-700 border-dashed">
                            No planetary bodies detected in this system.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {activeSystem.planets.map((planet, idx) => (
                                <div key={idx} className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-gray-500 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                            <span
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: planet.planetColor }}
                                            ></span>
                                            {planet.planetName}
                                        </h3>
                                        <span className="text-xs px-2 py-1 bg-gray-900 rounded text-gray-300">
                                            {planet.planetType}
                                        </span>
                                    </div>

                                    <div className="text-sm text-gray-400 mb-4">
                                        <p>Gravity: {planet.gravity}G | Orbit: {planet.orbitalPeriod} days</p>
                                    </div>

                                    {/* Procedural Data Summaries */}
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="bg-gray-900 p-2 rounded">
                                            <span className="block text-gray-500 mb-1">Resources</span>
                                            {planet.resourceList?.length > 0 ? (
                                                <ul className="text-blue-300 space-y-1">
                                                    {planet.resourceList.map((res, rIdx) => (
                                                        <li key={rIdx} className="flex items-center justify-between">
                                                            <span>
                                                                {res.specificName} <span className="text-gray-500 text-[10px]">({res.baseMaterial})</span>
                                                            </span>
                                                            {res.rarity === 'rare' && (
                                                                <span className="px-1.5 py-0.5 bg-purple-900/50 text-purple-300 text-[9px] rounded uppercase border border-purple-700">
                                                                    Rare
                                                                </span>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : <span className="text-gray-600">Depleted</span>}
                                        </div>
                                        <div className="bg-gray-900 p-2 rounded">
                                            <span className="block text-gray-500 mb-1">Biosphere</span>
                                            <ul className="text-green-300">
                                                <li>Flora: {planet.floraList?.length || 0} species</li>
                                                <li>Fauna: {planet.faunaList?.length || 0} species</li>
                                                {planet.moons?.length > 0 && (
                                                    <li className="text-purple-300 mt-1 pt-1 border-t border-gray-700">
                                                        Moons: {planet.moons.length}
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Settlement Quick-Glance */}
                                    {planet.settlements?.length > 0 && (
                                        <div className="mt-3 pt-3 border-t border-gray-700 text-xs">
                                            <span className="text-gray-500">Major Settlements: </span>
                                            <span className="text-orange-300">
                                                {planet.settlements.map(s => s.name).join(', ')}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default StarSystemViewer;