import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft, SearchX } from 'lucide-react';

interface ErrorScreenProps {
  onRetry: () => void;
  message: string;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ onRetry, message }) => {
  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center text-center py-20 relative z-10">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 12, stiffness: 100 }}
        className="w-24 h-24 bg-red-500/10 border-2 border-red-500/30 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(239,68,68,0.2)]"
      >
        <SearchX className="w-10 h-10 text-red-400" />
      </motion.div>

      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-['Inter']">Verification Failed</h2>
      
      <div className="bg-white/5 border border-red-500/20 backdrop-blur-md rounded-xl p-6 mb-8 max-w-md w-full relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
          <p className="text-white/80 text-left text-lg">
            {message}
          </p>
        </div>
      </div>

      <button 
        onClick={onRetry}
        className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all font-medium group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Try Again
      </button>

      <p className="mt-8 text-white/50 text-sm">
        If you believe this is an error, please contact <a href="mailto:support@dremora.com" className="text-purple-400 hover:underline">support@dremora.com</a>
      </p>
    </div>
  );
};

export default ErrorScreen;
