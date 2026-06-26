import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Search, Loader2 } from 'lucide-react';
import api from '../utils/api';
import CertificateCard from './CertificateCard';

export default function VerificationForm() {
  const [internId, setInternId] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!internId.trim() || !fullName.trim()) {
      setError('Please fill in both fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/verify', {
        intern_id: internId,
        full_name: fullName
      });
      if (res.data.success) {
        setResult(res.data.data);
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Verification failed due to a server error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative p-4">
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div 
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="glass-panel w-full max-w-md"
          >
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <ShieldCheck size={48} color="var(--primary)" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Verify Your Dremora Internship</h1>
              <p className="text-sm text-gray-400" style={{ color: 'var(--text-muted)' }}>
                Enter your Internship ID and Full Name to verify your internship and access your certificate.
              </p>
            </div>

            <form onSubmit={handleVerify} className="flex flex-col gap-4">
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Internship ID</label>
                <input 
                  type="text" 
                  className="glass-input" 
                  placeholder="e.g. DRM-INT-2026-001"
                  value={internId}
                  onChange={(e) => setInternId(e.target.value)}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Full Name</label>
                <input 
                  type="text" 
                  className="glass-input" 
                  placeholder="e.g. Krushna Bhadale"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-3 rounded bg-red-500/20 text-red-400 text-sm border border-red-500/50"
                  style={{ color: 'var(--error)' }}
                >
                  {error}
                </motion.div>
              )}

              <button type="submit" className="glass-button flex items-center justify-center gap-2 mt-2" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : <Search size={20} />}
                {loading ? 'Verifying...' : 'Verify Internship'}
              </button>
            </form>
          </motion.div>
        ) : (
          <CertificateCard key="result" intern={result} onBack={() => setResult(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
