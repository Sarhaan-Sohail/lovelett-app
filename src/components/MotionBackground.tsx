import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  color: string;
  type: 'sparkle' | 'heart' | 'orb';
  angle: number;
  angleSpeed: number;
}

export const MotionBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Color palette matching the anniversary mood (dusty rose, wine plum, warm gold, soft pink)
    const colors = [
      'rgba(247, 209, 220, ', // #F7D1DC soft pink
      'rgba(232, 61, 100, ',  // #E83D64 rose crimson
      'rgba(255, 179, 198, ', // #FFB3C6 light rose
      'rgba(255, 223, 186, ', // warm champagne sparkle
    ];

    const particles: Particle[] = Array.from({ length: 42 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 8 + 4,
      speedY: -(Math.random() * 0.4 + 0.15), // Slow romantic float upwards
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.6 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      type: Math.random() > 0.45 ? 'heart' : Math.random() > 0.5 ? 'sparkle' : 'orb',
      angle: Math.random() * Math.PI * 2,
      angleSpeed: (Math.random() - 0.5) * 0.02,
    }));

    const drawHeart = (x: number, y: number, size: number, color: string, opacity: number, angle: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.beginPath();
      const topCurveHeight = size * 0.3;
      ctx.moveTo(0, topCurveHeight);
      // Top left curve
      ctx.bezierCurveTo(-size / 2, -topCurveHeight, -size, size / 3, 0, size);
      // Top right curve
      ctx.bezierCurveTo(size, size / 3, size / 2, -topCurveHeight, 0, topCurveHeight);
      ctx.closePath();
      ctx.fillStyle = `${color}${opacity * 0.75})`;
      ctx.fill();
      ctx.restore();
    };

    const drawSparkle = (x: number, y: number, size: number, color: string, opacity: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.quadraticCurveTo(0, 0, size, 0);
      ctx.quadraticCurveTo(0, 0, 0, size);
      ctx.quadraticCurveTo(0, 0, -size, 0);
      ctx.quadraticCurveTo(0, 0, 0, -size);
      ctx.fillStyle = `${color}${opacity * 0.9})`;
      ctx.fill();
      ctx.restore();
    };

    const drawOrb = (x: number, y: number, size: number, color: string, opacity: number) => {
      ctx.save();
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
      gradient.addColorStop(0, `${color}${opacity})`);
      gradient.addColorStop(1, `${color}0)`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, size * 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render subtle glowing floating particles
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += Math.sin(p.angle) * 0.3;
        p.angle += p.angleSpeed;

        // Wrap around smoothly
        if (p.y < -20) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;

        if (p.type === 'heart') {
          drawHeart(p.x, p.y, p.size, p.color, p.opacity, p.angle);
        } else if (p.type === 'sparkle') {
          drawSparkle(p.x, p.y, p.size * 0.6, p.color, p.opacity);
        } else {
          drawOrb(p.x, p.y, p.size * 1.5, p.color, p.opacity * 0.5);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Dynamic ambient moving gradient orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#E83D64]/15 rounded-full blur-3xl animate-pulse duration-1000" />
      <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-[#6C225B]/20 rounded-full blur-3xl animate-pulse duration-700" />
      <div className="absolute bottom-10 left-1/4 w-[450px] h-[450px] bg-[#9B2C6E]/15 rounded-full blur-3xl animate-pulse duration-1000" />

      {/* Floating Canvas Particles */}
      <canvas ref={canvasRef} className="w-full h-full opacity-80" />
    </div>
  );
};
