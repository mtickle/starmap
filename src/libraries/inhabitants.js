export const inhabitantList = [
    // Original entries (unchanged)
    {
        inhabitantId: 'humanoid-terran',
        inhabitantName: 'Terran Descendants',
        description: 'Adaptable and resilient humanoids, descendants of ancient colonial efforts. Technologically adept and socially complex.',
        disposition: 'Pragmatic and Expansionist',
        homePlanetType: ['Rocky', 'Oceanic'],
        techLevel: 'Advanced',
        societalTypes: ['Civilization'],
        canSettle: true // They are colonists
    },
    {
        inhabitantId: 'aquatic-cygnian',
        inhabitantName: 'Cygnian Aquatics',
        description: 'Graceful, amphibious beings with a deep connection to their planet\'s oceans. They are masters of biotechnology.',
        disposition: 'Philosophical and Territorial',
        homePlanetType: ['Oceanic'],
        techLevel: 'Biological Mastery',
        societalTypes: ['Civilization', 'Primitive'],
        canSettle: false // Tend to stay on their home worlds
    },
    {
        inhabitantId: 'silicon-krell',
        inhabitantName: 'The Krell',
        description: 'A silicon-based inhabitant that communicates through crystalline resonance. Their logic is as flawless as it is alien.',
        disposition: 'Scholarly and Cautious',
        homePlanetType: ['Crystaline', 'Barren'],
        techLevel: 'Post-Singularity',
        societalTypes: ['Civilization', 'Scattered Enclaves'],
        canSettle: true // Their advanced tech allows them to settle harsh worlds
    },
    {
        inhabitantId: 'synthetic-automata',
        inhabitantName: 'The Automata',
        description: 'A self-replicating synthetic consciousness born from a long-dead civilization. They endlessly seek data and purpose.',
        disposition: 'Logical and Inquisitive',
        homePlanetType: ['Artificial', 'Metallic'],
        techLevel: 'Machine Intelligence',
        societalTypes: ['Civilization'],
        canSettle: true // Can establish outposts anywhere
    },
    {
        inhabitantId: 'avian-avior',
        inhabitantName: 'Avior Ascendants',
        description: 'Feathered bipeds with hollow bones, perfectly adapted to low-gravity worlds or gas giant moons.',
        disposition: 'Artistic and Fiercely Independent',
        homePlanetType: ['Rocky', 'Gas Giant'],
        techLevel: 'Intermediate',
        societalTypes: ['Civilization', 'Primitive'],
        canSettle: true // Space-faring nomads
    },
    {
        inhabitantId: 'fungoid-mycelian',
        inhabitantName: 'Mycelian Collective',
        description: 'A hive-mind intelligence that exists as a vast, interconnected fungal network beneath the planet\'s surface.',
        disposition: 'Collective and Patient',
        homePlanetType: ['Exotic', 'Carbonaceous'],
        techLevel: 'Organic',
        societalTypes: ['Civilization', 'Primitive', 'Scattered Enclaves'],
        canSettle: false // Intrinsically tied to their home planet
    },
    {
        inhabitantId: 'ursine-glacialis',
        inhabitantName: 'Glacial Ursines',
        description: 'Massive, fur-covered beings adapted to sub-zero temperatures. They are formidable hunters who live in small, nomadic clans across the ice sheets.',
        disposition: 'Stoic and Territorial',
        homePlanetType: ['Ice World'],
        techLevel: 'Primitive',
        societalTypes: ['Primitive', 'Scattered Enclaves'],
        canSettle: false // Not space-faring
    },
    {
        inhabitantId: 'insectoid-cryo',
        inhabitantName: 'Cryo-Insectoids',
        description: 'A hive-minded insectoid inhabitant that burrows deep beneath the ice, thriving near geothermal vents. They build intricate cities of ice and organic resin.',
        disposition: 'Collective and Industrious',
        homePlanetType: ['Ice World'],
        techLevel: 'Geothermal',
        societalTypes: ['Civilization', 'Primitive'],
        canSettle: false // Tied to their specific environment
    },
    {
        inhabitantId: 'lithovore-igneous',
        inhabitantName: 'Igneous Lithovores',
        description: 'A slow-moving, silicon-based lifeform that consumes minerals for sustenance. They are impervious to extreme heat and pressure.',
        disposition: 'Patient and Unflinching',
        homePlanetType: ['Volcanic'],
        techLevel: 'Geological',
        societalTypes: ['Primitive', 'Scattered Enclaves'],
        canSettle: false
    },
    {
        inhabitantId: 'phasic-anomaly',
        inhabitantName: 'Phasic Beings',
        description: 'Beings of pure energy that thrive in high-radiation environments. Their physical form is unstable and difficult for scanners to resolve.',
        disposition: 'Enigmatic and Unpredictable',
        homePlanetType: ['Radiated'],
        techLevel: 'Exotic',
        societalTypes: ['Scattered Enclaves'], // They don't build traditional civilizations
        canSettle: false
    },

    // --- Greatly Expanded Additions ---

    // Mammalian / warm-blooded archetypes
    {
        inhabitantId: 'mammalian-predator',
        inhabitantName: 'Vorathian Apex Hunters',
        description: 'Pack-oriented carnivores with keen senses and powerful builds. They value strength, loyalty, and ritualistic hunts.',
        disposition: 'Honorable and Militaristic',
        homePlanetType: ['Savanna', 'Arid'],
        techLevel: 'Intermediate',
        societalTypes: ['Civilization', 'Tribal Clans'],
        canSettle: true // Aggressive colonizers
    },
    {
        inhabitantId: 'reptilian-imperial',
        inhabitantName: 'Saurian Dominion',
        description: 'Cold-blooded reptilians with hierarchical castes and ancient warrior traditions. They build vast pyramid-cities and conquer relentlessly.',
        disposition: 'Authoritarian and Expansionist',
        homePlanetType: ['Volcanic', 'Desert'],
        techLevel: 'Advanced',
        societalTypes: ['Civilization', 'Empire'],
        canSettle: true
    },

    // Plant / sessile life
    {
        inhabitantId: 'plantoid-symbiont',
        inhabitantName: 'Verdant Symbiotes',
        description: 'Mobile plant-animal hybrids that form symbiotic relationships with lesser inhabitant. They photosynthesize and spread vast living megastructures.',
        disposition: 'Harmonious and Communal',
        homePlanetType: ['Tropical', 'Gaia / Biosphere Rich'],
        techLevel: 'Biological Mastery',
        societalTypes: ['Civilization', 'Hive Network'],
        canSettle: true // Terraform via biomass
    },

    // Arthropod / hive variants
    {
        inhabitantId: 'arthropoid-swarm',
        inhabitantName: 'Zorath Swarm',
        description: 'Relentless hive-minded arthropods driven by consumption and adaptation. They strip worlds bare and evolve rapidly.',
        disposition: 'Devouring and Adaptive',
        homePlanetType: ['Carbonaceous', 'Exotic'],
        techLevel: 'Organic Evolution',
        societalTypes: ['Hive Mind'],
        canSettle: true // Invasive colonizers
    },

    // Exotic / non-traditional
    {
        inhabitantId: 'gaseous-nomad',
        inhabitantName: 'Nebulons',
        description: 'Floating, plasma-based entities that drift through gas giant atmospheres. They manipulate magnetic fields and communicate via auroras.',
        disposition: 'Elusive and Mystical',
        homePlanetType: ['Gas Giant', 'Storm Giant'],
        techLevel: 'Exotic',
        societalTypes: ['Scattered Enclaves', 'Nomadic Fleet'],
        canSettle: false // Atmosphere-bound
    },
    {
        inhabitantId: 'amoeboid-shifter',
        inhabitantName: 'Morphic Amoebae',
        description: 'Shapeshifting protoplasmic beings capable of mimicking other lifeforms. They infiltrate and observe.',
        disposition: 'Curious and Deceptive',
        homePlanetType: ['Oceanic', 'Subterranean / Subsurface Ocean'],
        techLevel: 'Adaptive',
        societalTypes: ['Infiltration Cells'],
        canSettle: true // Via mimicry
    },

    // Advanced / precursor-like
    {
        inhabitantId: 'precursor-relic',
        inhabitantName: 'Eldari Remnant',
        description: 'Ancient, long-lived beings who retreated into stasis after a cataclysm. They possess forgotten technologies and view younger races as children.',
        disposition: 'Isolationist and Condescending',
        homePlanetType: ['Relic / Ruined', 'Diamond Planet'],
        techLevel: 'Precursor',
        societalTypes: ['Fallen Empire', 'Enclaves'],
        canSettle: false // Dormant
    },

    // Nomadic / fleet-based
    {
        inhabitantId: 'nomadic-voidborn',
        inhabitantName: 'Void Wanderers',
        description: 'Spacefaring crustacean-like beings born aboard generation ships. They never settle planets, living eternally in mobile habitats.',
        disposition: 'Exploratory and Detached',
        homePlanetType: ['Rogue Planet', 'Shattered / Fragmented'],
        techLevel: 'Intermediate',
        societalTypes: ['Nomadic Fleet'],
        canSettle: false
    },

    // Aggressive / conquest-focused
    {
        inhabitantId: 'berserker-mech',
        inhabitantName: 'Kragthar Berserkers',
        description: 'Cybernetically enhanced mammalian warriors obsessed with glorious combat. They raid and conquer for honor and resources.',
        disposition: 'Aggressive and Glory-Seeking',
        homePlanetType: ['Metallic', 'Barren'],
        techLevel: 'Cybernetic',
        societalTypes: ['Warrior Clans'],
        canSettle: true // Raid-settlers
    },

    // Peaceful / trader
    {
        inhabitantId: 'cephalopod-merchant',
        inhabitantName: 'Tentacled Traders',
        description: 'Highly intelligent, multi-limbed cephalopods renowned for cunning deals and vast trade networks. They avoid conflict through economics.',
        disposition: 'Mercantile and Opportunistic',
        homePlanetType: ['Oceanic', 'Tropical'],
        techLevel: 'Advanced',
        societalTypes: ['Trade Guilds', 'Civilization'],
        canSettle: true // Commercial outposts
    },

    // Eldritch / horror
    {
        inhabitantId: 'eldritch-abyss',
        inhabitantName: 'Abyssal Whisperers',
        description: 'Multidimensional entities that corrupt minds and reality. Contact drives most inhabitant insane.',
        disposition: 'Malevolent and Insidious',
        homePlanetType: ['Exotic', 'Radiated'],
        techLevel: 'Beyond Comprehension',
        societalTypes: ['Cult Enclaves'],
        canSettle: false // Infects rather than settles
    }
];