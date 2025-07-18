import React, { useEffect, useState } from 'react';

interface RainDropProps {
  left: number;
  animationDuration: number;
  opacity: number;
  size: number;
}

const RainDrop: React.FC<RainDropProps> = ({ left, animationDuration, opacity, size }) => {
  return (
    <div
      className="absolute animate-rain pointer-events-none"
      style={{
        left: `${left}%`,
        animationDuration: `${animationDuration}s`,
        opacity: opacity,
        width: `${size}px`,
        height: `${size * 12}px`,
        background: 'linear-gradient(to bottom, transparent, rgba(173, 216, 230, 0.8), rgba(135, 206, 235, 0.6), transparent)',
        borderRadius: '50%',
        animation: `rain ${animationDuration}s linear infinite`,
        animationDelay: `${Math.random() * animationDuration}s`,
        boxShadow: '0 0 6px rgba(173, 216, 230, 0.4)',
      }}
    />
  );
};

const RainAnimation: React.FC = () => {
  const [rainDrops, setRainDrops] = useState<RainDropProps[]>([]);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setIsReducedMotion(prefersReducedMotion);
    
    if (prefersReducedMotion) return;

    const drops: RainDropProps[] = [];
    
    // Reduce number of raindrops on mobile for better performance
    const dropCount = window.innerWidth < 768 ? 30 : 50;
    
    for (let i = 0; i < dropCount; i++) {
      drops.push({
        left: Math.random() * 100,
        animationDuration: Math.random() * 1.5 + 1, // 1-2.5 seconds
        opacity: Math.random() * 0.6 + 0.3, // 0.3-0.9 opacity
        size: Math.random() * 3 + 2, // 2-5px width
      });
    }
    
    setRainDrops(drops);
  }, []);

  // Don't render rain if user prefers reduced motion
  if (isReducedMotion) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {rainDrops.map((drop, index) => (
        <RainDrop
          key={index}
          left={drop.left}
          animationDuration={drop.animationDuration}
          opacity={drop.opacity}
          size={drop.size}
        />
      ))}
    </div>
  );
};

export default RainAnimation;