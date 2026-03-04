import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../../styles/word-cloud.scss';

export default function WordCloud({ title, words = [], accent = '#1eead0' }) {
    const cloudRef = useRef(null);
    const velocityRef = useRef({ x: 0.005, y: 0.006 });
    const [angles, setAngles] = useState({ x: 0.4, y: 0.6 });

    const normalizedWords = useMemo(() => {
        if (!Array.isArray(words)) {
            return [];
        }

        return words
            .filter(Boolean)
            .map((word, index) => {
                if (typeof word === 'string') {
                    return {
                        text: word,
                        weight: 1 + (index % 3) * 0.15,
                    };
                }

                return {
                    text: word.text || '',
                    weight: Number(word.weight) || 1,
                };
            })
            .filter((word) => word.text.trim().length > 0);
    }, [words]);

    const points = useMemo(() => {
        const count = normalizedWords.length;
        if (count === 0) {
            return [];
        }

        return normalizedWords.map((word, index) => {
            const k = -1 + (2 * (index + 1) - 1) / count;
            const phi = Math.acos(k);
            const theta = Math.sqrt(count * Math.PI) * phi;

            return {
                ...word,
                phi,
                theta,
            };
        });
    }, [normalizedWords]);

    useEffect(() => {
        let rafId;
        let lastTime = performance.now();

        const animate = (currentTime) => {
            const deltaTime = currentTime - lastTime;
            
            // Limiter à ~60fps pour éviter les sauts
            if (deltaTime >= 16) {
                setAngles((prev) => ({
                    x: prev.x + velocityRef.current.x,
                    y: prev.y + velocityRef.current.y,
                }));
                lastTime = currentTime;
            }
            
            rafId = requestAnimationFrame(animate);
        };

        rafId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(rafId);
    }, []);

    const handleMouseMove = (event) => {
        const rect = cloudRef.current?.getBoundingClientRect();
        if (!rect) {
            return;
        }

        const nx = (event.clientX - rect.left) / rect.width - 0.5;
        const ny = (event.clientY - rect.top) / rect.height - 0.5;

        velocityRef.current = {
            x: 0.004 + ny * 0.012,
            y: 0.005 + nx * 0.012,
        };
    };

    const handleMouseLeave = () => {
        velocityRef.current = { x: 0.005, y: 0.006 };
    };

    const radius = 130;
    const perspective = 420;

    return (
        <section className="word-cloud-block">
            <h3 className="word-cloud-heading">{title}</h3>
            <div
                className="word-cloud-stage"
                ref={cloudRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                {points.map((point, index) => {
                    const x0 = radius * Math.sin(point.phi) * Math.cos(point.theta + angles.y);
                    const y0 = radius * Math.cos(point.phi);
                    const z0 = radius * Math.sin(point.phi) * Math.sin(point.theta + angles.y);

                    const cosX = Math.cos(angles.x);
                    const sinX = Math.sin(angles.x);

                    const y = y0 * cosX - z0 * sinX;
                    const z = y0 * sinX + z0 * cosX;

                    const scale = perspective / (perspective - z);
                    const opacity = Math.max(0.28, Math.min(1, (z + radius) / (2 * radius) + 0.2));
                    const size = (14 + point.weight * 2.5) * scale;

                    return (
                        <span
                            key={`${point.text}-${index}`}
                            className="word-cloud-tag"
                            style={{
                                color: accent,
                                opacity,
                                fontSize: `${size}px`,
                                transform: `translate(calc(-50% + ${x0 * scale}px), calc(-50% + ${y * scale}px))`,
                                zIndex: Math.floor((z + radius) * 10),
                            }}
                        >
                            {point.text}
                        </span>
                    );
                })}
            </div>
        </section>
    );
}
