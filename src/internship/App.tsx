import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useVerifyIntern } from './hooks/useVerifyIntern';
import HeroSearch from './components/HeroSearch';
import VerificationDashboard from './components/VerificationDashboard';
import ErrorScreen from './components/ErrorScreen';

const App: React.FC = () => {
  const { verify, loading, error, result, reset } = useVerifyIntern();

  // Check URL params for direct verification (from QR code)
  useEffect(() => {
    // URL params are handled in HeroSearch component
  }, []);

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {!result && !error && (
          <motion.div
            key="search"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
            <HeroSearch onVerify={verify} loading={loading} />
          </motion.div>
        )}

        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
            <ErrorScreen onRetry={reset} message={error} />
          </motion.div>
        )}

        {result && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
            className="w-full max-w-6xl mx-auto"
          >
            <VerificationDashboard intern={result} onReset={reset} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
