import { useNavigate } from "react-router-dom";
import { ArrowRight, Lightbulb, Zap, Grid3x3, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
            ▲ REVIEW
          </h1>
          <nav className="flex items-center gap-6">
            <a
              href="#projects"
              className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300"
              style={{ fontFamily: '"Inter", sans-serif' }}
            >
              Projects
            </a>
            <button
              className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-all duration-200 interactive-button shadow-md hover:shadow-lg"
              style={{ fontFamily: '"Inter", sans-serif' }}
            >
              Start
            </button>
          </nav>
        </div>
      </div>

      {/* Hero Section with Particles */}
      <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">

        <div className="relative z-10 container mx-auto px-4 md:px-6 max-w-6xl text-center">
          <h2
            className="text-6xl md:text-7xl lg:text-8xl mb-8 mt-8 leading-tight animate-slide-up hero-heading"
            style={{
              fontFamily: '"Sora", sans-serif',
              fontWeight: 400,
            }}
          >
            <span
              className="hero-heading-line"
              style={{ animationDelay: "0.1s" }}
            >
              Review
            </span>
            <br />
            <span
              className="hero-heading-line relative inline-block"
              style={{ animationDelay: "0.3s" }}
            >
              Nest
              <div className="absolute bottom-2 left-0 w-full h-1 bg-gradient-to-r from-secondary to-primary opacity-50 animate-pulse"></div>
            </span>
          </h2>


          <blockquote
            className="text-xl md:text-2xl text-foreground max-w-2xl mx-auto mb-6 leading-relaxed animate-slide-up relative"
            style={{
              fontFamily: '"Inter", sans-serif',
              fontWeight: 300,
              animationDelay: "0.1s",
            }}
          >
            <span className="text-secondary font-bold mr-2">"</span>Your feedback can make a real difference.<span className="text-secondary font-bold ml-2">"</span>
          </blockquote>

          <p
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed animate-slide-up"
            style={{
              fontFamily: '"Inter", sans-serif',
              fontWeight: 300,
              animationDelay: "0.15s",
            }}
          >
            A lightweight platform to collect and display project reviews.
          </p>

          <button
            onClick={() =>
              document
                .getElementById("projects")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all duration-300 hover:shadow-xl animate-slide-up interactive-button"
            style={{
              fontFamily: '"Inter", sans-serif',
              animationDelay: "0.1s",
            }}
          >
            Explore Projects
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* Projects Section */}
      <div id="projects" className="relative py-32">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <AnimateOnScroll>
            <h3
              className="text-5xl md:text-6xl font-medium mb-20 text-center"
              style={{
                fontFamily: '"Sora", sans-serif',
                fontWeight: 400,
                letterSpacing: "-0.01em",
              }}
            >
              Projects
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
              className="text-5xl md:text-6xl font-medium mb-8"
              style={{
                fontFamily: '"Sora", sans-serif',
                fontWeight: 400,
                letterSpacing: "-0.01em",
              }}
            >
              Ready to review?
            </h3>
          </AnimateOnScroll>
          <AnimateOnScroll delay={100}>
            <p
              className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12"
              style={{ fontFamily: '"Inter", sans-serif', fontWeight: 300 }}
            >
              Your feedback can make a real difference.
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll delay={200}>
            <button
              className="px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all duration-200 hover:shadow-lg interactive-button"
              style={{ fontFamily: '"Inter", sans-serif' }}
            >
              Start Reviewing
            </button>
          </AnimateOnScroll>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border/50 bg-background/50">
        <div className="container mx-auto px-4 md:px-6 py-16 max-w-6xl">
          <div className="max-w-2xl mx-auto mb-12">
            <h4
              className="text-sm font-semibold text-foreground mb-4 uppercase tracking-widest"
              style={{ fontFamily: '"Inter", sans-serif' }}
            >
              About
            </h4>
            <p
              className="text-base text-muted-foreground leading-relaxed"
              style={{ fontFamily: '"Inter", sans-serif' }}
            >
              A platform for sharing honest, constructive feedback on projects.
              Help creators improve through thoughtful reviews.
            </p>
          </div>
          <div className="border-t border-border/30 pt-8 text-center">
            <p
              className="text-sm text-muted-foreground"
              style={{ fontFamily: '"Inter", sans-serif' }}
            >
              Built by{" "}
              <span className="font-semibold text-foreground">
                Mohammed Shahzaman
              </span>
            </p>
            <p
              className="text-xs text-muted-foreground/70 mt-2"
              style={{ fontFamily: '"Inter", sans-serif' }}
            >
              © 2024 Review Platform. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
