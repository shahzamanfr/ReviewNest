import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  size: number;
  opacity: number;
  hue: number;
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, influence: 80 });
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize particles spread everywhere evenly
    const particleCount = 200;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      // Uniform distribution across entire screen
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const yNormalized = y / canvas.height; // 0 to 1

      // Color gradient: Blue (top) → Purple → Red/Orange → Yellow (bottom)
      let hue;
      if (yNormalized < 0.25) {
        hue = 220 + Math.random() * 30; // Blue range
      } else if (yNormalized < 0.5) {
        hue = 250 + Math.random() * 40; // Purple range
      } else if (yNormalized < 0.75) {
        hue = 10 + Math.random() * 30; // Red-Orange range
      } else {
        hue = 45 + Math.random() * 15; // Yellow range
      }

      // More consistent opacity throughout
      const opacity = Math.random() * 0.5 + 0.3;

      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        baseX: x,
        baseY: y,
        size: Math.random() * 1.5 + 0.8,
        opacity,
        hue,
      });
    }

    particlesRef.current = particles;

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    let frameCount = 0;
    const animate = () => {
      // Clear canvas with transparency
      ctx.fillStyle = "rgba(255, 255, 255, 0)";
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      particles.forEach((particle) => {
        // Distance to mouse
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Magnetic influence (gentle attraction/repulsion)
        if (distance < mouse.influence) {
          const force = (1 - distance / mouse.influence) * 0.12;
          const angle = Math.atan2(dy, dx);

          // Gentle drift towards cursor direction (not away)
          particle.vx += Math.cos(angle) * force * 0.08;
          particle.vy += Math.sin(angle) * force * 0.08;
        }

        // Gentle floating motion - particles drift freely
        const floatSpeed = 0.0015;
        particle.vx +=
          Math.sin(frameCount * floatSpeed + particle.baseX * 0.01) * 0.015;
        particle.vy +=
          Math.cos(frameCount * floatSpeed + particle.baseY * 0.01) * 0.015;

        // Light damping for smooth motion
        particle.vx *= 0.95;
        particle.vy *= 0.95;

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Boundary wrapping
        if (particle.x < -10) particle.x = canvas.width + 10;
        if (particle.x > canvas.width + 10) particle.x = -10;
        if (particle.y < -10) particle.y = canvas.height + 10;
        if (particle.y > canvas.height + 10) particle.y = -10;

        // Draw particle as tiny rectangular confetti
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = `hsl(${particle.hue}, 85%, 50%)`;

        // Tiny rectangular strokes with rotation
        ctx.translate(particle.x, particle.y);
        ctx.rotate((frameCount * 0.01 + particle.baseX) * 0.05);
        ctx.fillRect(
          -particle.size / 2,
          -particle.size * 1.5,
          particle.size,
          particle.size * 3,
        );

        ctx.restore();
      });

      frameCount++;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{
        background: "transparent",
        zIndex: 1,
      }}
    />
  );
}
