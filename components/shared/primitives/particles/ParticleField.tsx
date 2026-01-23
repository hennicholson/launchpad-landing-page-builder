"use client";

import { useEffect, useRef } from "react";

export interface ParticleFieldProps {
  count?: number; // number of particles, default 50
  color?: string; // particle color, default '#D6FC51'
  size?: number; // particle size in px, default 2
  speed?: number; // movement speed, default 0.5
  interactive?: boolean; // particles react to mouse, default true
  interactionRadius?: number; // mouse interaction radius, default 150
  connectionDistance?: number; // connect nearby particles, default 120
  connectionOpacity?: number; // connection line opacity, default 0.2
  fadeEdges?: boolean; // fade particles at edges, default true
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

/**
 * ParticleField
 *
 * Canvas-based particle system with physics and mouse interaction.
 * Particles move randomly and can be attracted/repelled by mouse cursor.
 *
 * @example
 * ```tsx
 * <ParticleField
 *   count={80}
 *   color="#D6FC51"
 *   interactive
 *   connectionDistance={150}
 * />
 * ```
 */
export function ParticleField({
  count = 50,
  color = "#D6FC51",
  size = 2,
  speed = 0.5,
  interactive = true,
  interactionRadius = 150,
  connectionDistance = 120,
  connectionOpacity = 0.2,
  fadeEdges = true,
  className = "",
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        size: size + Math.random() * 2,
      }));
    };
    initParticles();

    // Mouse tracking
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    };

    if (interactive) {
      canvas.addEventListener("mousemove", handleMouseMove);
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current.forEach((particle, i) => {
        // Mouse interaction
        if (interactive) {
          const dx = mouseRef.current.x - particle.x;
          const dy = mouseRef.current.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < interactionRadius) {
            const force = (interactionRadius - distance) / interactionRadius;
            particle.vx -= (dx / distance) * force * 0.2;
            particle.vy -= (dy / distance) * force * 0.2;
          }
        }

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx *= -1;
          particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy *= -1;
          particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        }

        // Apply friction
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        // Maintain minimum speed
        const currentSpeed = Math.sqrt(particle.vx ** 2 + particle.vy ** 2);
        if (currentSpeed < speed * 0.5) {
          const angle = Math.random() * Math.PI * 2;
          particle.vx += Math.cos(angle) * 0.1;
          particle.vy += Math.sin(angle) * 0.1;
        }

        // Calculate opacity based on edge distance if fadeEdges is true
        let opacity = 1;
        if (fadeEdges) {
          const edgeDistance = Math.min(
            particle.x,
            particle.y,
            canvas.width - particle.x,
            canvas.height - particle.y
          );
          const fadeZone = 100;
          if (edgeDistance < fadeZone) {
            opacity = edgeDistance / fadeZone;
          }
        }

        // Draw connections to nearby particles
        particlesRef.current.slice(i + 1).forEach((otherParticle) => {
          const dx = otherParticle.x - particle.x;
          const dy = otherParticle.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const connectionOpacityValue =
              (1 - distance / connectionDistance) * connectionOpacity * opacity;
            ctx.strokeStyle = `${color}${Math.floor(connectionOpacityValue * 255)
              .toString(16)
              .padStart(2, "0")}`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });

        // Draw particle
        ctx.fillStyle = `${color}${Math.floor(opacity * 255)
          .toString(16)
          .padStart(2, "0")}`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (interactive) {
        canvas.removeEventListener("mousemove", handleMouseMove);
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [
    count,
    color,
    size,
    speed,
    interactive,
    interactionRadius,
    connectionDistance,
    connectionOpacity,
    fadeEdges,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ willChange: "transform" }}
    />
  );
}
