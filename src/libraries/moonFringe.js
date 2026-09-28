export const moonEconomies = [
    { name: "Company Town Scrip", description: "Workers are paid in corporate credits only valid at the local company store. Leaving is economically impossible." },
    { name: "Black Market Barter", description: "Untraceable goods exchanged for other untraceable goods. No questions asked, no refunds given." },
    { name: "Salvage Economy", description: "Wealth is measured entirely by the tonnage of reclaimed starship parts and refined scrap." },
    { name: "Hazard Pay", description: "Extremely high credit payouts designed to offset a frankly alarming worker mortality rate." },
    { name: "Smuggler's Haven", description: "A localized shadow economy propped up by syndicate bribes and tariff-free contraband." }
];

export const moonIndustries = [
    { name: "Derelict Freighter Salvage", description: "Stripping orbital wrecks and crashed dreadnoughts for valuable tech, ignoring the structural risks." },
    { name: "Runaway Mould Farming", description: "Harvesting rapidly expanding, slightly aggressive fungal clusters to refine into high-grade nanites." },
    { name: "Deep-Crust Extraction", description: "Drilling directly into unstable tectonic fault lines to siphon rare, highly volatile isotopes." },
    { name: "Syndicate Operations", description: "Moving unregistered cargo, fencing stolen ships, and avoiding planetary authorities." },
    { name: "Black-Site Research", description: "Classified experimental facilities conducting tests that planetary governments prefer to keep off the books." },
    { name: "Automated Penal Colony", description: "Involuntary laborers processing toxic minerals under the watchful eyes of automated sentinels." }
];

export const moonThemes = {
    'Mining Outpost': { condition: ['Dust-Choked', 'Vibrating', 'Utilitarian'], buildings: ['Ore Refinery', 'Worker Barracks', 'Heavy Landing Pad', 'Thermal Bore'] },
    'Pirate Haven': { condition: ['Hidden', 'Chaotic', 'Heavily Defended'], buildings: ['Cantina', 'Chop Shop', 'Black Market Stalls', 'Turret Network'] },
    'Research Station': { condition: ['Sterile', 'Isolated', 'Humming'], buildings: ['Bio-Laboratory', 'Server Array', 'Containment Unit', 'Comms Array'] },
    'Salvage Yard': { condition: ['Cluttered', 'Dangerous', 'Rusted'], buildings: ['Magnetic Crane', 'Scrap Heaps', 'Smelter', 'Junker Tents'] }
};

export const moonSettlementNames = [
    'Terminus', 'Dust Hole', 'Rust Point', 'Echo Base', 'Krayt’s Fall', 'The Anvil', 'Scrapper’s Reach',
    'Void Station', 'Outpost 31', 'Grit', 'Smuggler’s Run', 'Tether', 'Apex Drill', 'Shatter', 'Bleak'
];