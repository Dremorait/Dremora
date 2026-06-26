import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Award, Calendar, Download, Eye, Share2, ArrowLeft } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import CertificateViewer from './CertificateViewer';

export default function CertificateCard({ intern, onBack }) {
  const [viewerOpen, setViewerOpen] = useState(false);

  // Generate verification URL for QR code
  const verifyUrl = `${window.location.origin}/verify?id=${intern.certificate_number}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Dremora Internship Certificate',
        text: `Verify ${intern.full_name}'s internship at Dremora IT Consultants & Services.`,
        url: verifyUrl,
      }).catch((err) => console.error('Share failed:', err));
    } else {
      navigator.clipboard.writeText(verifyUrl);
      alert('Verification link copied to clipboard!');
    }
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-panel w-full max-w-2xl relative"
      >
        <button 
          onClick={onBack} 
          style={{ position: 'absolute', top: '20px', left: '20px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          className="flex items-center gap-2 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <div className="flex flex-col md:flex-row gap-8 mt-8">
          <div className="flex flex-col items-center gap-4 border-r border-white/10 pr-0 md:pr-8" style={{ minWidth: '200px' }}>
            <div className="w-32 h-32 rounded-full border-4 border-[var(--primary)] overflow-hidden shadow-lg shadow-[var(--primary)]/30">
              <img 
                src={intern.photo ? `http://localhost:5000${intern.photo}` : `https://ui-avatars.com/api/?name=${intern.full_name}&background=6366f1&color=fff`} 
                alt={intern.full_name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold">{intern.full_name}</h2>
              <div className="flex items-center justify-center gap-1 mt-1 text-[var(--success)] font-medium bg-[var(--success)]/10 px-3 py-1 rounded-full text-sm border border-[var(--success)]/30">
                <CheckCircle size={16} />
                Verified ✅
              </div>
            </div>
            
            <div className="mt-4 p-2 bg-white rounded-lg shadow-md">
              <QRCodeSVG value={verifyUrl} size={120} />
            </div>
            <p className="text-xs text-[var(--text-muted)] text-center">Scan to verify authenticity</p>
          </div>

          <div className="flex-1 flex flex-col gap-4">
            <h3 className="text-2xl font-semibold border-b border-white/10 pb-2 flex items-center gap-2">
              <Award className="text-[var(--secondary)]" /> Internship Details
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[var(--text-muted)] text-sm block">Internship ID</span>
                <strong className="text-lg">{intern.intern_id}</strong>
              </div>
              <div>
                <span className="text-[var(--text-muted)] text-sm block">Certificate No.</span>
                <strong className="text-lg text-[var(--secondary)]">{intern.certificate_number}</strong>
              </div>
              <div>
                <span className="text-[var(--text-muted)] text-sm block">Domain</span>
                <strong>{intern.domain}</strong>
              </div>
              <div>
                <span className="text-[var(--text-muted)] text-sm block">Batch</span>
                <strong>{intern.batch}</strong>
              </div>
              <div>
                <span className="text-[var(--text-muted)] text-sm block">Status</span>
                <strong style={{ color: intern.status === 'Active' ? 'var(--success)' : 'inherit' }}>{intern.status}</strong>
              </div>
            </div>

            <div className="mt-2 border-t border-white/10 pt-4 flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="text-[var(--primary)]" size={18} />
                <div>
                  <span className="text-[var(--text-muted)] text-xs block">Duration</span>
                  <span className="text-sm">
                    {intern.start_date ? new Date(intern.start_date).toLocaleDateString() : 'N/A'} - {intern.end_date ? new Date(intern.end_date).toLocaleDateString() : 'Present'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-auto pt-6">
              <button onClick={() => setViewerOpen(true)} className="glass-button flex-1 flex items-center justify-center gap-2" style={{ padding: '10px 16px', fontSize: '1rem' }}>
                <Eye size={18} /> View Certificate
              </button>
              <button onClick={handleShare} className="glass-button flex items-center justify-center" style={{ width: 'auto', padding: '10px 16px', background: 'rgba(255,255,255,0.1)' }}>
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {viewerOpen && (
        <CertificateViewer 
          intern={intern} 
          onClose={() => setViewerOpen(false)} 
        />
      )}
    </>
  );
}
