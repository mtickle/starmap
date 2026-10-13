// utils/textureUtils.js

export const getPlanetTexture = (planet) => {
    const shading = `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0.85) 85%)`;

    const type = planet.planetType?.toLowerCase() || "";
    const variant = (planet.planetName || "").length % 3;

    let layers = [shading];

    // --- GAS GIANTS ---
    if (type.includes("gas")) {
        if (variant === 0) {
            layers.push(`repeating-linear-gradient(0deg, transparent 0%, rgba(0,0,0,0.2) 8%, transparent 15%, rgba(255,255,255,0.15) 20%, transparent 25%)`);
        } else if (variant === 1) {
            layers.push(`radial-gradient(ellipse 35% 20% at 70% 60%, rgba(0,0,0,0.4) 0%, transparent 60%)`);
            layers.push(`linear-gradient(0deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.15) 30%, transparent 50%, rgba(255,255,255,0.1) 75%, rgba(0,0,0,0.2) 100%)`);
        } else {
            layers.push(`repeating-linear-gradient(0deg, rgba(0,0,0,0.3) 0%, transparent 5%, transparent 12%, rgba(255,255,255,0.2) 16%, rgba(255,255,255,0.05) 20%)`);
        }
        return layers.join(", ");
    }

    // --- ATMOSPHERE & CLOUDS CHECK ---
    const hasBiosphere = (planet.floraList?.length > 0) || (planet.faunaList?.length > 0);
    const hasAtmosphere = ["lush", "tropical", "toxic", "ice", "water", "marsh", "frozen", "paradise"].some(t => type.includes(t));

    if (hasBiosphere || hasAtmosphere) {
        layers.push(`radial-gradient(ellipse 80% 50% at 40% 30%, rgba(255,255,255,0.35) 0%, transparent 55%)`);
        layers.push(`radial-gradient(ellipse 60% 40% at 75% 70%, rgba(255,255,255,0.25) 0%, transparent 50%)`);
    }

    // --- ROCKY / TERRESTRIAL SURFACES ---
    if (variant === 0) {
        layers.push(`radial-gradient(circle at 20% 30%, rgba(0,0,0,0.3) 0%, transparent 35%)`);
        layers.push(`radial-gradient(circle at 75% 65%, rgba(255,255,255,0.2) 0%, transparent 45%)`);
        layers.push(`radial-gradient(circle at 80% 20%, rgba(0,0,0,0.2) 0%, transparent 25%)`);
    } else if (variant === 1) {
        layers.push(`radial-gradient(circle at 15% 45%, rgba(0,0,0,0.4) 0%, transparent 8%)`);
        layers.push(`radial-gradient(circle at 75% 25%, rgba(0,0,0,0.5) 0%, transparent 12%)`);
        layers.push(`radial-gradient(circle at 55% 80%, rgba(0,0,0,0.3) 0%, transparent 10%)`);
        layers.push(`radial-gradient(circle at 35% 15%, rgba(255,255,255,0.2) 0%, transparent 15%)`);
    } else {
        layers.push(`linear-gradient(45deg, transparent 20%, rgba(0,0,0,0.3) 22%, transparent 24%, transparent 65%, rgba(255,255,255,0.2) 68%, transparent 70%)`);
        layers.push(`linear-gradient(-45deg, transparent 40%, rgba(0,0,0,0.2) 42%, transparent 45%)`);
    }

    return layers.join(", ");
};