
export const starTypes = ['O', 'B', 'A', 'F', 'G', 'K', 'M'];

export const starTemperatures = {
    O: 'Extremely Hot',
    B: 'Very Hot',
    A: 'Hot',
    F: 'Warm',
    G: 'Moderate',
    K: 'Cool',
    M: 'Cold',
    L: 'Very Cold (1,300–2,400 K) – brown dwarf transition',
    T: 'Extremely Cold (<1,300 K) – cool brown dwarf',
    Y: 'Ultra-cold (<500 K) – rogue / failed star',
    W: 'Wolf-Rayet (extremely hot, >50,000 K, stripped envelope)',
    C: 'Carbon star (cool, sooty red giant)',
};

export const starDescriptions = {
    O: 'A massive, blazing blue star with intense radiation, rare and volatile.',
    B: 'A bright blue-white star, hot and luminous, often surrounded by nebulae.',
    A: 'A white star with strong stellar winds, a beacon in the cosmos.',
    F: 'A yellow-white star, stable and warm, with potential for vibrant systems.',
    G: 'A yellow star like Sol, often hosting habitable planets.',
    K: 'An orange star, cooler and steady, with long-lived systems.',
    M: 'A dim red dwarf, common and cool, with faint habitable zones.',
    L: 'A dark reddish-brown dwarf, transitioning from star to failed fusion. Dim infrared glow dominates; metal hydrides and dust clouds shroud its faint presence.',
    T: 'An extremely cool methane-rich brown dwarf, appearing deep magenta or near-invisible. Methane absorption bands make it ghostly quiet in visible light, thriving in infrared.',
    Y: 'An ultra-cold rogue or failed star, barely warmer than a planet. Ammonia and water clouds form; it drifts in darkness, detectable only by faint heat or gravitational lensing.',
    W: 'A ferocious Wolf-Rayet star, stripped bare of its outer layers. Extreme temperatures drive massive winds laden with heavy elements; its spectrum screams ionized helium, carbon, and oxygen.',
    C: 'A sooty carbon star, a late-stage red giant rich in carbon molecules. Deep crimson with strong Swan bands of C₂ and CN; it shrouds itself in carbon dust, veiling its light in soot.'
};

export const starClasses = [
    { type: 'O', color: '#3B82F6', temp: '>30,000K', size: 14, weight: 0.05 },
    { type: 'B', color: '#06B6D4', temp: '10,000–30,000K', size: 12, weight: 0.1 },
    { type: 'A', color: '#F8FAFC', temp: '7,500–10,000K', size: 10, weight: 0.1 },
    { type: 'F', color: '#FDE047', temp: '6,000–7,500K', size: 9, weight: 0.1 },
    { type: 'G', color: '#F59E0B', temp: '5,200–6,000K', size: 8, weight: 0.15 },
    { type: 'K', color: '#EA580C', temp: '3,700–5,200K', size: 7, weight: 0.2 },
    { type: 'M', color: '#EF4444', temp: '<3,700K', size: 6, weight: 0.4 },
];