// utils/nebulaBackground.js

export const NEBULA_PRESETS = {
    deepSpace: {
        background: `
      radial-gradient(circle at 30% 25%, rgba(88, 28, 135, 0.2) 0%, transparent 60%),
      radial-gradient(circle at 75% 65%, rgba(30, 58, 138, 0.25) 0%, transparent 65%),
      radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.1) 0%, transparent 70%),
      linear-gradient(to bottom, #040408, #0c0c16, #040408)
    `,
        backgroundSize: "200% 200%",
        animation: "nebula-drift 45s ease infinite alternate",
    }
};

export const nebulaKeyframes = `
  @keyframes nebula-drift {
    0% { background-position: 0% 30%; }
    50% { background-position: 100% 70%; }
    100% { background-position: 0% 30%; }
  }
`;