import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface ProjectCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  onClick: () => void;
}

export default function ProjectCard({
  title,
  description,
  icon,
  gradient,
  onClick,
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="h-full cursor-pointer"
      onClick={onClick}
    >
      <div className={`relative h-full rounded-2xl p-8 overflow-hidden group`}>
        {/* Background gradient with 3D depth effect */}
        <div
          className={`absolute inset-0 ${gradient} opacity-90 group-hover:opacity-100 transition-all duration-500`}
        />

        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-screen filter blur-3xl animate-float" />
          <div
            className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-screen filter blur-3xl animate-float"
            style={{ animationDelay: "2000ms" }}
          />
        </div>

        {/* Border glow effect */}
        <div className="absolute inset-0 rounded-2xl border border-white/20 group-hover:border-white/40 transition-all duration-500" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div>
            <div className="mb-6 inline-block p-3 bg-white/20 backdrop-blur-md rounded-xl group-hover:bg-white/30 transition-all duration-300">
              <div className="text-white text-3xl">{icon}</div>
            </div>

            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-white transition-all duration-300">
              {title}
            </h3>

            <p className="text-white/90 text-base md:text-lg leading-relaxed">
              {description}
            </p>
          </div>

          {/* Footer with CTA */}
          <motion.div
            className="flex items-center gap-2 text-white font-semibold mt-8 group-hover:gap-4 transition-all duration-300"
            whileHover={{ x: 5 }}
          >
            <span>View & Review</span>
            <motion.div whileHover={{ x: 5 }}>
              <ArrowRight size={20} />
            </motion.div>
          </motion.div>
        </div>

        {/* Hover shine effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)",
          }}
        />
      </div>
    </motion.div>
  );
}
