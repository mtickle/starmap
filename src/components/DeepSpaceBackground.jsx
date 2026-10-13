import { useState, useMemo } from "react";

// ==========================================
// COMPONENT: Background Starfield
// ==========================================
const DeepSpaceBackground = () => {
    const { stars, nebulas } = useMemo(() => {
        const generatedStars = Array.from({ length: 200 }).map(() => ({
            cx: `${Math.random() * 100}%`,
            cy: `${Math.random() * 100}%`,
            r: Math.random() * 1.5 + 0.2,
            opacity: Math.random() * 0.6 + 0.1,
        }));

        const generatedNebulas = [
            { cx: "20%", cy: "30%", r: "150", fill: "rgba(100, 100, 255, 0.05)" },
            { cx: "80%", cy: "70%", r: "200", fill: "rgba(255, 100, 100, 0.04)" },
            { cx: "50%", cy: "50%", r: "250", fill: "rgba(150, 50, 200, 0.03)" },
        ];
        return { stars: generatedStars, nebulas: generatedNebulas };
    }, []);

    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <filter id="nebula-blur" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="40" />
                </filter>
            </defs>
            {nebulas.map((neb, i) => (
                <circle key={`neb-${i}`} cx={neb.cx} cy={neb.cy} r={neb.r} fill={neb.fill} filter="url(#nebula-blur)" />
            ))}
            {stars.map((star, i) => (
                <circle key={`star-${i}`} cx={star.cx} cy={star.cy} r={star.r} fill={`rgba(255,255,255,${star.opacity})`} />
            ))}
        </svg>
    );
};

export default DeepSpaceBackground;