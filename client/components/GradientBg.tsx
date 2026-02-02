export default function GradientBg() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background opacity-100"></div>

      {/* Subtle animated color overlays */}
      <div
        className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: "8s" }}
      ></div>
      <div
        className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-secondary/5 to-primary/5 rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: "10s", animationDelay: "2s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-primary/3 to-secondary/3 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse"
        style={{ animationDuration: "12s", animationDelay: "4s" }}
      ></div>
    </div>
  );
}
