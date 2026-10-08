# Procedural Star System Viewer

A React-based procedural universe generator and interactive tactical display. This project renders unique, mathematically deterministic star systems, planets, and biosphere data based on X_Y grid coordinates, drawing heavy inspiration from the exploration and discovery mechanics of No Man's Sky.

The application utilizes advanced CSS compositing to generate 3D volumetric planets, animated orbital paths, and procedural textures entirely in the browser without relying on external WebGL libraries or image assets.

# Core Features

- 3D Orbital Radar: A fully animated, isometric representation of the star system using transform-style: preserve-3d. Planets orbit the central star on staggered planes while CSS gyroscopes maintain level UI tooltips.
- Procedural CSS Textures: Planetary surfaces are generated dynamically using stacked CSS radial-gradient and linear-gradient properties. Gas giants feature atmospheric bands and hurricane spots, while rocky worlds display continents, craters, or tectonic fractures. Atmospheric clouds render automatically on planets with detected biospheres.
- Target Lock UI: Selecting a planet triggers a CSS-driven depth-of-field transition. The orbital map pushes into the background with a blur effect, pulling a macro-scale, high-resolution procedural render of the planet and its tactical HUD to the foreground.
- Navigational Telemetry: Players can designate a "Home System" saved via LocalStorage. The engine calculates the linear distance in Lightyears from the home coordinates to any newly discovered system using the Pythagorean theorem.
- Dynamic Planetary Data: Generates detailed stat blocks including Star Class, Faction Control, Economic Status, Gravity Profiles, Orbital Cycles, and Biosphere scans (Flora/Fauna/Rare Deposits).

# Tech Stack

- Frontend: React, Vite
- Styling: Tailwind CSS (Procedural gradients, animated keyframes, and 3D transforms)
- Local State: React useState and localStorage for coordinate caching
- Backend (Planned): Supabase (PostgreSQL) for hybrid multiplayer state

# How it Works
## Deterministic Generation
The entire universe is deterministic. A coordinate string like 10_-45 acts as the seed. The PRNG (Pseudo-Random Number Generator) ensures that visiting 10_-45 will always yield the exact same Star Class, number of planets, biome types, and orbital velocities every single time.

## CSS Texture Engine
Instead of loading static textures, the getPlanetTexture function analyzes the planet's data and stacks background images:
- Shading: A core radial gradient provides the 3D spherical shadow.
- Weather: White, semi-transparent overlapping ellipses create cloud layers for lush or life-bearing worlds.
- Crust: Name length modulo math (% 3) deterministically assigns sharp ridges, crater impacts, or continental landmasses to terrestrial worlds.
