import React, { useEffect, useRef } from 'react';

const MeteorEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    
    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Meteor/Rain properties
    const particles: { x: number; y: number; length: number; speed: number; opacity: number }[] = [];
    const particleCount = 150; // Number of particles

    const createParticle = (reset = false) => {
      const x = Math.random() * (width + 200) - 100;
      const y = reset ? -100 : Math.random() * height;
      return {
        x,
        y,
        length: Math.random() * 20 + 10, // Short length like rain/small meteors
        speed: Math.random() * 3 + 2,
        opacity: Math.random() * 0.3 + 0.1 // Subtle opacity
      };
    };

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        ctx.beginPath();
        // Create a gradient for the trail
        // Angle is roughly 45 degrees (x-1, y-1) or steeper for rain
        // Let's do a slight angle: x - 0.5 * length, y - length
        const tailX = p.x + 0.5 * p.length; // Coming from top-right to bottom-left? 
        // Usually meteors go top-right to bottom-left or top-left to bottom-right.
        // Let's do top-right to bottom-left (classic diagonal)
        // So head is (x, y), tail is (x + offset, y - offset)
        
        // Actually, let's do top-left to bottom-right for "rain" often, or just vertical.
        // User said "meteor effect... like small raindrops".
        // Let's do a steep diagonal from top-right to bottom-left.
        
        const angleX = -0.5; // Move left
        const angleY = 1;    // Move down
        
        const tailLengthX = p.length * angleX;
        const tailLengthY = p.length * angleY;

        const gradient = ctx.createLinearGradient(p.x, p.y, p.x - tailLengthX, p.y - tailLengthY);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${p.opacity})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        
        ctx.moveTo(p.x - tailLengthX, p.y - tailLengthY);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        // Update position
        p.x += p.speed * angleX;
        p.y += p.speed * angleY;

        // Reset if out of bounds
        if (p.y > height + 50 || p.x < -50) {
          const newP = createParticle(true);
          // Respawn at top or right side
          if (Math.random() > 0.5) {
             p.x = Math.random() * width;
             p.y = -50;
          } else {
             p.x = width + 50;
             p.y = Math.random() * height / 2; // Mostly top half for side entry
          }
          p.length = newP.length;
          p.speed = newP.speed;
          p.opacity = newP.opacity;
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default MeteorEffect;
