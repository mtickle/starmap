// utils/dialects/settlementDialect.js

export const settlementDialect = {
    // Frontier and colonial descriptive prefixes
    start: [
        'New', 'Elder', 'Sky', 'Dawn', 'Iron', 'Frost', 'Sun', 'Storm',
        'Ash', 'River', 'Bright', 'Dusk', 'Star', 'Wind', 'Thorn', 'Crystal',
        'Shadow', 'Gold', 'Oasis', 'Ember', 'Sea', 'High', 'Moon', 'Sand',
        'Fire', 'Mist', 'Light'
    ],

    // Empty middle keeps compound words clean (e.g. Iron + Hold instead of Iron + o + Hold)
    middle: [''],

    // Fortified or geographic settlement suffixes
    end: [
        'Haven', 'Gate', 'Reach', 'Spire', 'Hold', 'Crest', 'Watch', 'Fall',
        'Stone', 'Moor', 'Vale', 'Keep', 'Ville', 'Ton', 'Ridge', 'Shade',
        'City', 'Watch'
    ]
};