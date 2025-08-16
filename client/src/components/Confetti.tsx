import { useEffect, useState } from 'react';

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  delay: number;
}

export default function Confetti() {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);

  useEffect(() => {
    const colors = ['#22c55e', '#10b981', '#16a34a', '#3b82f6', '#f59e0b'];
    const particleCount = 50;
    
    const newParticles: ConfettiParticle[] = [];
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
      });
    }
    
    setParticles(newParticles);

    // Clean up particles after animation
    const timer = setTimeout(() => {
      setParticles([]);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="confetti-particle animate-confetti"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            animationDelay: `${particle.delay}s`,
            animationDuration: '2s',
            animationFillMode: 'forwards',
          }}
        />
      ))}
    </div>
  );
}
