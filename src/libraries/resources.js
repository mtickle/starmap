// libraries/resources.js

export const rarities = [
    { name: 'common', weight: 50 },
    { name: 'uncommon', weight: 30 },
    { name: 'rare', weight: 15 },
    { name: 'legendary', weight: 4 },
    { name: 'mythic', weight: 1 }
];

export const mineralPools = {
    // Original entries
    'Rocky': ['Bauxite', 'Iron Ore', 'Silica', 'Copper'],
    'Gas Giant': [],
    'Ice World': ['Water Ice', 'Methane Clathrates', 'Ammonia Crystals'],
    'Exotic': ['Xenocrystals', 'Bioluminescent Fungi', 'Sentient Spores'],
    'Oceanic': ['Magnesium Nodules', 'Bioluminescent Algae', 'Coral Fragments'],
    'Volcanic': ['Sulfur', 'Basalt', 'Obsidian', 'Heavy Metals'],
    'Barren': ['Iron Ore', 'Nickel', 'Cobalt', 'Helium-3'],
    'Crystaline': ['Quartz', 'Diamond Dust', 'Resonant Crystals'],
    'Radiated': ['Uranium', 'Thorium', 'Mutagenic Slime'],
    'Artificial': ['Nanites', 'Alloy Plates', 'Data Cores'],
    'Metallic': ['Iron Ore', 'Titanium', 'Platinum', 'Gold'],
    'Carbonaceous': ['Hydrocarbons', 'Graphite', 'Organic Polymers'],

    // Expanded environmental types
    'Desert': ['Silica Sand', 'Gypsum', 'Rare Earth Elements', 'Borax', 'Lithium Brine Traces'],
    'Arid': ['Copper', 'Uranium Ore', 'Phosphates', 'Potash'],
    'Tundra': ['Permafrost Volatiles', 'Natural Gas Hydrates', 'Rare Metals', 'Tungsten'],
    'Alpine': ['Titanium', 'Chromium', 'Molybdenum', 'Gemstones (Emeralds, Sapphires)'],
    'Savanna': ['Iron Oxides', 'Bauxite', 'Kaolin Clay', 'Zinc'],
    'Continental': ['Coal', 'Oil Shale', 'Limestone', 'Fertile Soil Minerals (Potassium, Phosphorus)'],
    'Tropical': ['Bauxite', 'Tin', 'Gem-quality Quartz', 'Bismuth'],
    'Super-Earth': ['Compressed Iron-Nickel', 'High-Pressure Silicates', 'Exotic Alloys', 'Dense Rare Metals'],
    'Tidally Locked': ['Refractory Metals', 'Volatiles and Hydrates', 'Cryogenic Ices'],
    'Rogue Planet': ['Frozen Methane', 'Helium-3', 'Dark Silicates', 'Primordial Organics'],
    'Subterranean / Subsurface Ocean': ['Manganese Nodules', 'Hydrothermal Vent Minerals', 'Magnesium Salts', 'Exotic Sulfur Compounds'],

    // Volcanic variants
    'Lava World': ['Magma Chambers', 'Chromite', 'Palladium', 'Iridium'],
    'Cryovolcanic': ['Ammonia Ice', 'Nitrogen Ice', 'Carbon Dioxide Ice', 'Tholins'],

    // Sci-fi types
    'Gaia / Biosphere Rich': ['Rare Biological Catalysts', 'Exotic Pollens', 'Neuroactive Compounds', 'Self-Replicating Nanofibers'],
    'Relic / Ruined': ['Ancient Alloys', 'Quantum Residue', 'Lost Isotopes', 'Memory Crystals'],
    'Shattered / Fragmented': ['Exposed Core Metals', 'Planetary Mantle Fragments', 'Differentiated Silicates'],
    'Diamond Planet': ['Carbonado Diamonds', 'Lonsdaleite', 'Metallic Hydrogen Traces'],
    'Chthonian': ['Exposed Core', 'Silicon Carbide', 'Ultra-Dense Refractories'],
    'Neutronium Contaminated': ['Neutronium Dust', 'Strange Matter', 'Degenerate Matter Fragments'],
    'Plasma World': ['Ionized Metals', 'Exotic Particles', 'Magnetic Monopoles'],
    'Hive / Organic World': ['Chitin Polymers', 'Bioplastics', 'Enzyme Crystals', 'Symbiotic Spores'],
    'Fungal / Mycelial': ['Mycelium Networks', 'Psilocybin Derivatives', 'Fungal Metals'],
    'Silicon-Based': ['Silane Compounds', 'Silicon Carbide Structures', 'Quartz Networks'],
    'Ammonia-Based': ['Ammonium Salts', 'Ammonia Ice', 'Methane-Ammonia Slurries'],

    // Industrial types
    'Forge World': ['Refined Steel', 'Tungsten Carbide', 'Depleted Uranium', 'Superconductors'],
    'Ecumenopolis / City Planet': ['Recycled Alloys', 'E-Waste Metals', 'Synthetic Rare Earths'],
    'Ringworld Segment': ['Advanced Composites', 'Carbon Nanotubes', 'Monofilament Wires'],
    'Dyson Swarm Remnant': ['Solar-Grade Silicon', 'Antimatter Containment Residue', 'Quantum Dots'],

    // Gas worlds
    'Venusian / Hellworld': ['Sulfuric Acid Aerosols', 'Mercury Vapors', 'Carbon Dioxide Crystals'],
    'Storm Giant': ['Helium-3', 'Deuterium', 'Exotic Atmospheric Metals'],
    'Hot Jupiter': ['Metallic Hydrogen', 'Alkali Metal Vapors']
};