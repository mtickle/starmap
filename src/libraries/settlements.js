export const settlementThemes = {
    'High-Tech': {
        condition: ['Pristine', 'Sterile', 'Functional'],
        buildings: [
            { name: 'Luxury Sky-Towers', type: 'Residential' },
            { name: 'Corporate Emporium', type: 'Commerce' },
            { name: 'Fusion Power Core', type: 'Energy' },
            { name: 'Cybernetics Lab', type: 'Science' },
            { name: 'Stellar Observatory', type: 'Science' }
        ]
    },
    'Agrarian': {
        condition: ['Verdant', 'Rustic', 'Peaceful'],
        buildings: [
            { name: 'Communal Shelters', type: 'Residential' },
            { name: 'Open-Air Market', type: 'Commerce' },
            { name: 'Hydroponics Farm', type: 'Agriculture' },
            { name: 'Herbalist Den', type: 'Medical' }
        ]
    },
    'Industrial': {
        condition: ['Polluted', 'Functional', 'Grimy'],
        buildings: [
            { name: 'Habitation Blocks', type: 'Residential' },
            { name: 'Trade Depot', type: 'Commerce' },
            { name: 'Nutrient Vats', type: 'Agriculture' },
            { name: 'Ore Refinery', type: 'Industry' },
            { name: 'Automated Factory', type: 'Industry' }
        ]
    },
    'Scavenger': {
        condition: ['Dilapidated', 'Chaotic', 'Makeshift'],
        buildings: [
            { name: 'Scrap-Built Shanties', type: 'Residential' },
            { name: 'Shady Cantina', type: 'Commerce' },
            { name: 'Fungus Caverns', type: 'Agriculture' },
            { name: 'Scavenged Generators', type: 'Energy' },
            { name: 'Ship Scrapyard', type: 'Industry' }
        ]
    }
};
