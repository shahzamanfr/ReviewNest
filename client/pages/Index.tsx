import { useNavigate } from "react-router-dom";
import { ArrowRight, Lightbulb, Zap, Grid3x3, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ParticleField from "../components/ParticleField";

const projects = [
  {
    id: "merit-one",
    title: "MeritOne",
    description:
      "A skill-exchange platform where ability matters more than affordability. Trade skills, build experience, prove yourself through real work.",
    icon: Lightbulb,
  },
  {
    id: "interpret",
    title: "Interpret",
    description:
      "Communication analysis and feedback. Understand how you communicate, where you can improve, and why it matters.",
    icon: Sparkles,
  },
  {
    id: "automation-system",
    title: "Automation System",
    description:
      "A self-running content pipeline. Scripts, audio, visuals, publishing—all automated. Built cleanly, from concept to execution.",
    icon: Zap,
  },
  {
    id: "movella",
    title: "Movella",
    description:
      "Adapting books into cinematic narratives. Stories preserved, visuals added, fully designed and ready to experience.",
    icon: Grid3x3,
  },
];

function FloatingParticles() {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const container = canvasRef.current;
    const particleCount = 100;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.left = Math.random() * 100 + "%";
      particle.style.top = Math.random() * 100 + "%";
      particle.style.width = 1 + Math.random() * 3 + "px";
      particle.style.height = particle.style.width;
      container.appendChild(particle);
    }
  }, []);

  return (
    <div ref={canvasRef} className="floating-particles text-foreground/30" />
  );
}

function CursorFollower() {
  const glowRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.left = e.clientX - 20 + "px";
        glowRef.current.style.top = e.clientY - 20 + "px";
      }
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX - 4 + "px";
        dotRef.current.style.top = e.clientY - 4 + "px";
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <div ref={glowRef} className="cursor-glow" />
      <div ref={dotRef} className="cursor-dot" />
    </>
  );
}

function AnimateOnScroll({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 },
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={elementRef}
      className={isVisible ? "animate-slide-up" : "opacity-0"}
    >
      {children}
    </div>
  );
}

export default function Index() {
  const navigate = useNavigate();
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background overflow-hidden cursor-none">
      <ParticleField />
      <CursorFollower />

      {/* Header/Navigation */}
      <div className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl animate-fade-in">
        <div className="container mx-auto px-4 md:px-6 py-4 max-w-7xl flex items-center justify-between">
          <h1
            className="text-sm font-semibold tracking-widest text-foreground"
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontWeight: 500,
            }}
          >
            ▲ SYSTEMS
          </h1>
          <nav className="flex items-center gap-8">
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-110"
            >
              Work
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-110"
            >
              About
            </a>
            <button className="px-5 py-2 bg-foreground text-background text-sm font-medium rounded-full hover:opacity-90 transition-all duration-300 transform hover:scale-110 interactive-button shadow-lg hover:shadow-xl">
              Get Started
            </button>
          </nav>
        </div>
      </div>

      {/* Hero Section with Particles */}
      <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <FloatingParticles />

        <div className="relative z-10 container mx-auto px-4 md:px-6 max-w-6xl text-center">
          <h2
            className="text-7xl md:text-8xl lg:text-9xl mb-8 mt-8 leading-tight animate-slide-up hero-heading"
            style={{
              fontFamily: '"Sora", sans-serif',
              fontWeight: 400,
            }}
          >
            <span
              className="hero-heading-line"
              style={{ animationDelay: "0.1s" }}
            >
              Build with
            </span>
            <br />
            <span
              className="hero-heading-line relative inline-block"
              style={{ animationDelay: "0.3s" }}
            >
              Intent
              <div className="absolute bottom-2 left-0 w-full h-1 bg-gradient-to-r from-secondary to-primary opacity-50 animate-pulse"></div>
            </span>
          </h2>

          <p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed animate-slide-up"
            style={{
              fontFamily: '"Inter", sans-serif',
              fontWeight: 400,
              animationDelay: "0.05s",
            }}
          >
            Real problems deserve practical solutions. We explore, iterate, and
            build systems designed to last.
          </p>

          <button
            onClick={() =>
              document
                .getElementById("projects")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background font-semibold rounded-full hover:opacity-90 transition-all duration-300 transform hover:scale-110 hover:shadow-2xl animate-slide-up interactive-button relative"
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              animationDelay: "0.1s",
            }}
          >
            → Explore Our Work
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* Projects Section */}
      <div id="projects" className="relative py-32">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <AnimateOnScroll>
            <h3
              className="text-6xl md:text-7xl font-bold mb-20 text-center"
              style={{
                fontFamily: '"IBM Plex Sans", sans-serif',
                fontWeight: 600,
                letterSpacing: "-0.02em",
              }}
            >
              Our Systems
            </h3>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            {projects.map((project, index) => {
              return (
                <AnimateOnScroll key={project.id} delay={index * 100}>
                  <button
                    onClick={() => navigate(`/${project.id}`)}
                    className="group text-left py-8 border-b border-border/30 hover:border-foreground/50 transition-all duration-500"
                  >
                    <h4
                      className="text-2xl md:text-3xl font-medium text-foreground mb-4 group-hover:text-primary transition-colors duration-300"
                      style={{
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 500,
                      }}
                    >
                      {project.title}
                    </h4>
                    <p
                      className="text-base text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-300"
                      style={{
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 400,
                      }}
                    >
                      {project.description}
                    </p>
                  </button>
                </AnimateOnScroll>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-32 border-t border-border/50">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl text-center">
          <AnimateOnScroll>
            <h3
              className="text-6xl md:text-7xl font-medium mb-8"
              style={{
                fontFamily: '"Sora", sans-serif',
                fontWeight: 400,
                letterSpacing: "-0.01em",
              }}
            >
              Ready to explore?
            </h3>
          </AnimateOnScroll>
          <AnimateOnScroll delay={100}>
            <p
              className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12"
              style={{ fontFamily: '"Inter", sans-serif', fontWeight: 400 }}
            >
              Each system here started with genuine curiosity and evolved
              through thinking, building, and iteration.
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll delay={200}>
            <button
              className="px-8 py-4 bg-foreground text-background font-semibold rounded-full hover:opacity-90 transition-all duration-300 transform hover:scale-110 hover:shadow-2xl interactive-button"
              style={{ fontFamily: '"JetBrains Mono", monospace' }}
            >
              → View All Projects
            </button>
          </AnimateOnScroll>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border/50">
        <div className="container mx-auto px-4 md:px-6 py-16 max-w-6xl text-center">
          <p
            className="text-sm text-muted-foreground"
            style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}
          >
            Built with engineering rigor. Your feedback shapes what comes next.
          </p>
          <div className="flex items-center justify-center gap-8 mt-8 text-xs text-muted-foreground">
            <a
              href="#"
              className="hover:text-foreground transition-all duration-300 hover:scale-110"
            >
              Twitter
            </a>
            <a
              href="#"
              className="hover:text-foreground transition-all duration-300 hover:scale-110"
            >
              GitHub
            </a>
            <a
              href="#"
              className="hover:text-foreground transition-all duration-300 hover:scale-110"
            >
              Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
