import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ZoomIn, ZoomOut, Printer, Download, Share2 } from 'lucide-react';

export default function CertificateViewer({ intern, onClose }) {
  const [zoom, setZoom] = useState(1);

  const handlePrint = () => {
    window.print();
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 2.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));

  // If a PDF or image URL is uploaded by admin, show it. Otherwise show a placeholder for the demo.
  const certificateSource = intern.certificate_url 
    ? \`http://localhost:5000\${intern.certificate_url}\`
    : 'https://cdn.pixabay.com/photo/2017/08/17/09/39/certificate-2650570_1280.jpg'; // Placeholder high-res cert image

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-sm"
      style={{ margin: 0, padding: 0 }}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 bg-black/50 border-b border-white/10" style={{ '@media print': { display: 'none' } }}>
        <h3 className="text-white font-semibold">Certificate: {intern.certificate_number}</h3>
        <div className="flex gap-2">
          <button onClick={handleZoomOut} className="p-2 text-white/70 hover:text-white bg-white/5 rounded-lg transition-colors"><ZoomOut size={20} /></button>
          <button onClick={handleZoomIn} className="p-2 text-white/70 hover:text-white bg-white/5 rounded-lg transition-colors"><ZoomIn size={20} /></button>
          <div className="w-px h-8 bg-white/20 mx-2"></div>
          <button onClick={handlePrint} className="p-2 text-white/70 hover:text-white bg-white/5 rounded-lg transition-colors" title="Print"><Printer size={20} /></button>
          <a href={certificateSource} download=\`\${intern.full_name}_Certificate.pdf\` target="_blank" rel="noreferrer" className="p-2 text-white/70 hover:text-white bg-white/5 rounded-lg transition-colors" title="Download"><Download size={20} /></a>
          <button onClick={onClose} className="p-2 text-red-400 hover:text-red-300 bg-red-400/10 rounded-lg transition-colors ml-4"><X size={24} /></button>
        </div>
      </div>

      {/* Viewer Area */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-8">
        <motion.div 
          animate={{ scale: zoom }} 
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative max-w-5xl w-full flex justify-center"
          style={{ transformOrigin: 'center center' }}
        >
          {certificateSource.endsWith('.pdf') ? (
            <iframe 
              src={certificateSource} 
              className="w-full h-[80vh] border-0 rounded-lg shadow-2xl" 
              title="Certificate PDF"
            ></iframe>
          ) : (
            <div className="relative">
              <img 
                src={certificateSource} 
                alt="Certificate" 
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl ring-1 ring-white/20"
              />
              {!intern.certificate_url && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-black">
                  <h1 className="text-4xl font-serif font-bold mb-4">Certificate of Internship</h1>
                  <p className="text-xl">This is to certify that</p>
                  <h2 className="text-3xl font-bold italic my-4 text-indigo-900">{intern.full_name}</h2>
                  <p className="text-xl">has successfully completed the internship in</p>
                  <h3 className="text-2xl font-bold my-4">{intern.domain}</h3>
                  <div className="mt-8 flex justify-between w-full px-16 opacity-80 text-sm font-bold">
                    <div>
                      ID: {intern.intern_id}
                    </div>
                    <div>
                      Date: {new Date().toLocaleDateString()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .fixed { position: absolute; background: white; }
          img, iframe, .relative { visibility: visible; max-height: none !important; box-shadow: none !important; }
          img { width: 100%; height: auto; }
          button { display: none !important; }
        }
      `}</style>
    </motion.div>
  );
}
