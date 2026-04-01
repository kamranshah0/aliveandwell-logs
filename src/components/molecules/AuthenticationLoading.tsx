import { useEffect, useState } from "react";
import { Shield, Lock, LockOpen, CheckCircle } from "lucide-react";

const AuthenticationLoading = () => {
  const [progress, setProgress] = useState(10);
  const [stage, setStage] = useState("verifying");
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    // Create floating particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 2,
    }));
    setParticles(newParticles);

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    // Stage transitions with unlock animation
    const timer1 = setTimeout(() => {
      setStage("authenticating");
      setIsUnlocking(true);
    }, 800);

    const timer2 = setTimeout(() => {
      setIsUnlocking(false);
      setStage("securing");
    }, 1600);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const stages = {
    verifying: { text: "Verifying credentials", icon: Shield },
    authenticating: {
      text: "Authenticating session",
      icon: isUnlocking ? LockOpen : Lock,
    },
    securing: { text: "Securing connection", icon: CheckCircle },
  } as const;

  const CurrentIcon = stages[stage as keyof typeof stages].icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#194652] via-[#1e5a68] to-[#32831A]">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        {/* Floating particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animation: `float ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0; }
          50% { transform: translateY(-30px) translateX(10px); opacity: 1; }
        }
        @keyframes unlock {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(-10deg) scale(1.1); }
          100% { transform: rotate(0deg) scale(1); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .unlock-animation {
          animation: unlock 0.6s ease-in-out;
        }
      `}</style>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center space-y-8 px-6">
        {/* Logo/Icon container */}
        <div className="relative">
          {/* Rotating ring */}
          <div className="absolute inset-0 w-28 h-28 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>

          {/* Pulsing secondary ring */}
          <div className="absolute inset-2 w-24 h-24 border-2 border-white/10 rounded-full animate-pulse"></div>

          {/* Icon */}
          <div
            className={`relative w-28 h-28 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full border border-white/20 transition-all duration-500 ${
              isUnlocking ? "unlock-animation bg-white/20 border-white/40" : ""
            }`}
          >
            <CurrentIcon
              className={`w-14 h-14 text-white transition-all duration-500 ${
                stage === "securing" ? "scale-110" : ""
              } ${isUnlocking ? "text-green-300" : ""}`}
            />
          </div>

          {/* Success burst effect */}
          {stage === "securing" && (
            <>
              <div className="absolute inset-0 w-28 h-28 bg-green-400/20 rounded-full animate-ping"></div>
              <div className="absolute inset-0 w-28 h-28 bg-green-400/10 rounded-full animate-pulse"></div>
            </>
          )}
        </div>

        {/* Text content */}
        <div className="text-center space-y-3">
          <h2
            className="text-2xl font-semibold text-white tracking-wide"
            style={{
              background:
                "linear-gradient(90deg, #fff 0%, #a0f0a0 50%, #fff 100%)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "shimmer 3s linear infinite",
            }}
          >
            HIPAA Secure Alive & Well Portal
          </h2>
          <p className="text-white/90 text-base font-medium transition-all duration-500">
            {stages[stage as keyof typeof stages].text}
            <span className="inline-block animate-pulse">...</span>
          </p>
        </div>

        {/* Progress bar with glow */}
        <div className="relative w-72">
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm shadow-lg">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-400 rounded-full transition-all duration-500 ease-out relative"
              style={{
                width: `${progress}%`,
                backgroundSize: "200% 100%",
                animation: "shimmer 2s linear infinite",
              }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse"></div>
            </div>
          </div>
          {/* Progress percentage */}
          <div className="absolute -top-6 right-0 text-white/60 text-sm font-medium">
            {progress}%
          </div>
        </div>

        {/* Security badges */}
        <div className="flex items-center gap-6">
          <div className="flex items-center space-x-2 text-white/60 text-sm">
            <Shield className="w-4 h-4" />
            <span>256-bit Encrypted</span>
          </div>
          <div className="w-px h-4 bg-white/20"></div>
          <div className="flex items-center space-x-2 text-white/60 text-sm">
            <Lock className="w-4 h-4" />
            <span>HIPAA Compliant</span>
          </div>
        </div>

        {/* Status indicators */}
        <div className="flex gap-2">
          {["verifying", "authenticating", "securing"].map((s, idx) => (
            <div
              key={s}
              className={`w-2 h-2 rounded-full transition-all duration-500 ${
                stages[stage as keyof typeof stages].text ===
                stages[s as keyof typeof stages].text
                  ? "bg-white w-8"
                  : idx <
                    ["verifying", "authenticating", "securing"].indexOf(stage)
                  ? "bg-green-400"
                  : "bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom text */}
      <div className="absolute bottom-8 text-center">
        <div className="text-white/40 text-xs">
          Protected Health Information (PHI) - Secure Access
        </div>
        <div className="text-white/30 text-xs mt-1">
          Establishing secure connection...
        </div>
      </div>
    </div>
  );
};

export default AuthenticationLoading;
