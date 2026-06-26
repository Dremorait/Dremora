import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { ShieldCheck, Search, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface HeroSearchProps {
  onVerify: (id: string, name: string) => void;
  loading: boolean;
}

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const HeroSearch: React.FC<HeroSearchProps> = ({ onVerify, loading }) => {
  const [internId, setInternId] = useState('');
  const [fullName, setFullName] = useState('');
  const controls = useAnimation();

  useEffect(() => {
    // Check URL params for prefilled data from QR code
    const params = new URLSearchParams(window.location.search);
    const id = params.get('verify');
    if (id) {
      setInternId(id);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (internId.trim() && fullName.trim()) {
      onVerify(internId, fullName);
    } else {
      // Shake animation on error
      controls.start({
        x: [-10, 10, -10, 10, 0],
        transition: { duration: 0.4 }
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center relative z-10 pt-10 pb-20">
      
      {/* Background Blobs for Glassmorphism Context */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6"
      >
        <ShieldCheck className="w-5 h-5 text-purple-400" />
        <span className="text-sm font-medium tracking-wide text-white/90">Official Digital Verification</span>
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-white mb-6 font-['Inter']"
        style={{ lineHeight: 1.2 }}
      >
        Verify Your Dremora <br className="hidden md:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Internship Record</span>
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-lg md:text-xl text-white/70 max-w-2xl mb-12 font-['Inter']"
      >
        Enter your Internship ID and Full Name to instantly verify your credentials and access your official certificate.
      </motion.p>

      <motion.div 
        animate={controls}
        className="w-full max-w-md"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full relative">
          
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative flex items-center bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden focus-within:border-purple-500/50 transition-colors">
              <div className="pl-4 pr-3 text-white/40">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <input 
                type="text" 
                placeholder="Internship ID (e.g. DRM-INT-2026-001)"
                value={internId}
                onChange={(e) => setInternId(e.target.value)}
                disabled={loading}
                className="w-full bg-transparent py-4 pr-4 text-white placeholder-white/40 outline-none font-['Inter'] text-lg"
              />
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative flex items-center bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden focus-within:border-blue-500/50 transition-colors">
              <div className="pl-4 pr-3 text-white/40">
                <Search className="w-5 h-5" />
              </div>
              <input 
                type="text" 
                placeholder="Full Name (as on certificate)"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
                className="w-full bg-transparent py-4 pr-4 text-white placeholder-white/40 outline-none font-['Inter'] text-lg"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading || !internId.trim() || !fullName.trim()}
            className={cn(
              "relative w-full py-4 rounded-xl font-bold text-lg text-white transition-all overflow-hidden group mt-2",
              loading ? "opacity-80 cursor-not-allowed bg-purple-600/50 border border-purple-500/30" : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-[0_0_20px_rgba(138,43,226,0.4)]"
            )}
          >
            {/* Ripple effect background */}
            <div className="absolute inset-0 w-full h-full bg-white/20 scale-0 group-hover:scale-150 rounded-full transition-transform duration-700 ease-out origin-center opacity-0 group-hover:opacity-100"></div>
            
            <div className="relative flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying Record...
                </>
              ) : (
                <>
                  Verify Internship
                  <Search className="w-5 h-5 ml-1" />
                </>
              )}
            </div>
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default HeroSearch;
