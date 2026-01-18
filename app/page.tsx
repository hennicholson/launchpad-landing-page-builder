"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, useInView } from "framer-motion";

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [accentColor, setAccentColor] = useState("#f59e0b");
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(howItWorksRef, { once: false, margin: "-100px" });

  // Mouse tracking for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (howItWorksRef.current) {
        const rect = howItWorksRef.current.getBoundingClientRect();
        setMousePos({
          x: (e.clientX - rect.left - rect.width / 2) / rect.width,
          y: (e.clientY - rect.top - rect.height / 2) / rect.height,
        });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Auto-cycle through steps
  useEffect(() => {
    if (isInView) {
      const interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % 5);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isInView]);

  const handleNavigate = () => {
    setIsLoading(true);
    // Show animation for 2 seconds before navigating
    setTimeout(() => {
      router.push("/dashboard");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white font-['DM_Sans',sans-serif] relative overflow-hidden">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center">
          <div className="relative">
            {/* Outer glow ring */}
            <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-xl scale-110" />
            {/* Animated ring */}
            <div className="absolute -inset-2 rounded-full border-2 border-amber-500/30 animate-ping" />
            {/* Inner shadow ring */}
            <div className="absolute inset-0 rounded-full shadow-[inset_0_0_30px_rgba(0,0,0,0.8)]" style={{ zIndex: 10 }} />
            {/* Circular GIF container */}
            <div className="relative w-48 h-48 rounded-full overflow-hidden shadow-2xl shadow-amber-500/20 border-4 border-white/10">
              <img
                src="/launchpad-loading.gif"
                alt="Loading..."
                className="w-full h-full object-cover scale-125"
              />
            </div>
          </div>
          <p className="mt-8 text-white/60 text-lg font-medium animate-pulse">
            Launching...
          </p>
        </div>
      )}

      {/* Noise texture */}
      <div
        className="fixed inset-0 opacity-[0.015] pointer-events-none z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Ambient gradients */}
      <div className="fixed top-[-30%] right-[-20%] w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-[-40%] left-[-20%] w-[700px] h-[700px] bg-violet-500/8 rounded-full blur-[130px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/launchpad-logo.png" alt="LaunchPad" className="h-8 w-auto" />
            <span className="font-['Sora',sans-serif] text-2xl font-bold">
              <span className="text-amber-500">Launch</span>
              <span className="text-white">Pad</span>
            </span>
          </div>

          <button
            onClick={handleNavigate}
            className="px-5 py-2.5 rounded-xl bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors"
          >
            Open Dashboard
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/60 mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              AI-Powered Landing Pages
            </div>

            <h1 className="font-['Sora',sans-serif] text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Build landing pages
              <br />
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
                that convert
              </span>
            </h1>

            <p className="text-xl text-white/50 mb-10 max-w-xl mx-auto leading-relaxed">
              Describe your vision and let AI create stunning, high-converting landing pages.
              Customize every detail. Deploy in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleNavigate}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold text-lg hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02]"
              >
                Start Building Free
              </button>
              <a
                href="#how-it-works"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-medium text-lg hover:bg-white/10 transition-all"
              >
                See How It Works
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Behind the Developer Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/videos/landscape.mp4" type="video/mp4" />
          </video>
          {/* White blur overlay */}
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden"
          >
            <div className="flex flex-col lg:flex-row">

              {/* Portrait Video */}
              <div
                className="lg:w-[320px] flex-shrink-0 bg-gray-50 cursor-pointer"
                onMouseEnter={() => videoRef.current?.play()}
                onMouseLeave={() => {
                  if (videoRef.current) {
                    videoRef.current.pause();
                    videoRef.current.currentTime = 0;
                  }
                }}
              >
                <video ref={videoRef} loop muted playsInline className="w-full h-full object-cover">
                  <source src="/videos/potrait.mp4" type="video/mp4" />
                </video>
              </div>

              {/* Text Content */}
              <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-medium mb-4">
                  behind the developer
                </p>
                <h2 className="font-['Sora',sans-serif] text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Henry Nicholson
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Henry found a flaw stopping digital business owners from maximizing their revenue on Whop. So he built the solution.
                </p>
                <p className="font-['Sora',sans-serif] text-xl font-bold text-amber-500">
                  Convert Convert Convert
                </p>
              </div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        ref={howItWorksRef}
        className="py-24 bg-[#0a0a0b] relative overflow-hidden"
      >
        {/* Ambient particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-amber-500/30 rounded-full"
              style={{
                left: `${(i * 17) % 100}%`,
                top: `${(i * 23) % 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + (i % 3),
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-amber-500 font-medium mb-4">
              How It Works
            </p>
            <h2 className="font-['Sora',sans-serif] text-3xl lg:text-5xl font-bold text-white mb-4">
              Start with a template.{" "}
              <span className="text-amber-500">Make it yours.</span>
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              Pick a conversion-optimized template, customize everything, and deploy to your Whop in minutes.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Steps */}
            <div className="space-y-4">
              {[
                { title: "Pick Your Template", desc: "Choose from SaaS, E-commerce, Courses, Crypto, and more", icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" },
                { title: "Customize Your Copy", desc: "AI-powered headlines or write your own compelling text", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
                { title: "Set Brand Colors", desc: "One click to match your brand identity across every section", icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" },
                { title: "Add Your Assets", desc: "Upload images, videos, logos, and make it uniquely yours", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
                { title: "Deploy to Whop", desc: "Go live on your .onwhop.com domain with one click", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  onClick={() => setActiveStep(i)}
                  className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                    activeStep === i
                      ? "bg-amber-500/10 border border-amber-500/30"
                      : "bg-white/[0.02] border border-transparent hover:bg-white/[0.05]"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      activeStep === i ? "bg-amber-500 text-black" : "bg-white/10 text-white/60"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                    </svg>
                  </div>
                  <div>
                    <h3 className={`font-semibold mb-1 transition-colors ${activeStep === i ? "text-amber-500" : "text-white"}`}>
                      {step.title}
                    </h3>
                    <p className="text-sm text-white/40">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right: Interactive Mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
              style={{
                transform: `perspective(1000px) rotateY(${mousePos.x * 5}deg) rotateX(${-mousePos.y * 5}deg)`,
                transition: "transform 0.1s ease-out",
              }}
            >
              {/* Glow effect */}
              <div
                className="absolute -inset-4 rounded-3xl opacity-50 blur-2xl transition-colors duration-500"
                style={{ backgroundColor: accentColor + "40" }}
              />

              {/* Mockup container */}
              <div className="relative bg-[#141417] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-4 py-3 bg-[#1a1a1f] border-b border-white/5">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-[#0a0a0b] rounded-lg px-3 py-1.5 text-xs text-white/40 text-center">
                      yourbrand.onwhop.com
                    </div>
                  </div>
                </div>

                {/* Page content */}
                <div className="p-6 space-y-4">
                  {/* Hero mockup */}
                  <motion.div
                    className="space-y-3"
                    animate={{ opacity: activeStep === 1 ? [1, 0.5, 1] : 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div
                      className="h-8 rounded-lg w-3/4 transition-colors duration-500"
                      style={{ backgroundColor: activeStep === 2 ? accentColor : "#ffffff20" }}
                    />
                    <div className="h-4 bg-white/10 rounded w-full" />
                    <div className="h-4 bg-white/10 rounded w-2/3" />
                  </motion.div>

                  {/* CTA Button */}
                  <motion.div
                    className="h-10 rounded-lg w-1/3 transition-colors duration-500"
                    style={{ backgroundColor: accentColor }}
                    animate={{ scale: activeStep === 4 ? [1, 1.05, 1] : 1 }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Image placeholder */}
                  <motion.div
                    className="h-32 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-500"
                    animate={{
                      borderColor: activeStep === 3 ? accentColor : "rgba(255,255,255,0.1)",
                    }}
                  >
                    <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </motion.div>

                  {/* Feature cards */}
                  <div className="grid grid-cols-3 gap-2">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="h-16 rounded-lg bg-white/5 border transition-all duration-300"
                        style={{
                          borderColor: activeStep === 0 && i === 1 ? accentColor : "rgba(255,255,255,0.05)",
                        }}
                        animate={{
                          scale: activeStep === 0 && i === 1 ? 1.05 : 1,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Color picker (visible on step 2) */}
              <motion.div
                className="absolute -right-4 top-1/2 -translate-y-1/2 bg-[#1a1a1f] rounded-xl p-3 border border-white/10 shadow-xl"
                initial={{ opacity: 0, x: 20 }}
                animate={{
                  opacity: activeStep === 2 ? 1 : 0,
                  x: activeStep === 2 ? 0 : 20,
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-2">
                  {["#f59e0b", "#3b82f6", "#10b981", "#ec4899", "#8b5cf6"].map((color) => (
                    <button
                      key={color}
                      onClick={() => setAccentColor(color)}
                      className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${
                        accentColor === color ? "ring-2 ring-white ring-offset-2 ring-offset-[#1a1a1f]" : ""
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Deploy Domain Bar */}
      <div className="bg-[#0a0a0b] py-6 border-y border-white/5">
        <div className="flex items-center justify-center gap-2 text-lg font-medium">
          <span className="text-white/50">Deploy on:</span>
          <span className="inline-flex items-center">
            <span className="h-7 overflow-hidden relative">
              <span className="flex flex-col animate-slot">
                {["fitnessby", "cryptoalpha", "tradingpros", "coachmax", "coursehub", "betwise", "fitnessby"].map((name, i) => (
                  <span key={i} className="h-7 flex items-center text-white font-semibold">{name}</span>
                ))}
              </span>
            </span>
            <span className="text-amber-500">.onwhop.com</span>
          </span>
        </div>
      </div>

      {/* Features Section */}
      <section className="relative z-10 bg-[#0a0a0b]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="font-['Sora',sans-serif] text-3xl lg:text-5xl font-bold text-white mb-4">
                <span className="text-white">Whop</span> is where you sell.
              </h2>
              <h2 className="font-['Sora',sans-serif] text-3xl lg:text-5xl font-bold">
                <span className="text-amber-500">LaunchPad</span> <span className="text-white">is where you convert.</span>
              </h2>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-white/50 text-lg mt-6 max-w-2xl mx-auto"
            >
              Templates built for every niche. Pick your industry and launch in minutes.
            </motion.p>
          </div>

          {/* Template Categories */}
          <div id="features" className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: "SaaS", icon: "M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" },
              { name: "E-commerce", icon: "M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" },
              { name: "Courses", icon: "M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" },
              { name: "Crypto", icon: "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
              { name: "Sports Betting", icon: "M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m3.044-1.35a6.726 6.726 0 01-2.748 1.35m0 0a6.772 6.772 0 01-3.044 0" },
              { name: "Coaching", icon: "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" },
            ].map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="group p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-500/40 hover:bg-white/[0.06] transition-all duration-300 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:border-amber-500 transition-all duration-300">
                  <svg className="w-6 h-6 text-amber-500 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={category.icon} />
                  </svg>
                </div>
                <h3 className="font-['Sora',sans-serif] font-semibold text-lg text-white">{category.name}</h3>
              </motion.div>
            ))}
          </div>

          {/* CTA Bar - seamlessly integrated */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <div className="relative rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-amber-500/10 border border-amber-500/20 p-8 md:p-12 overflow-hidden">

              <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <h3 className="font-['Sora',sans-serif] text-2xl md:text-3xl font-bold text-white mb-2">
                    Ready to launch?
                  </h3>
                  <p className="text-white/50 text-lg">
                    Your high-converting landing page is minutes away.
                  </p>
                </div>

                <button
                  onClick={handleNavigate}
                  className="group flex-shrink-0 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold text-lg hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] flex items-center gap-2"
                >
                  Start Building
                  <span className="relative w-5 h-5">
                    {/* Arrow - visible by default */}
                    <svg className="absolute inset-0 w-5 h-5 transition-all duration-200 group-hover:opacity-0 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    {/* Hammer - visible on hover */}
                    <svg className="absolute inset-0 w-5 h-5 transition-all duration-200 opacity-0 -rotate-12 group-hover:opacity-100 group-hover:rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
          <p className="text-sm text-white/30">
            &copy; {new Date().getFullYear()} Launchpad. Built with AI.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-white/30 hover:text-white/60 transition-colors">Terms</a>
            <a href="#" className="text-sm text-white/30 hover:text-white/60 transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
