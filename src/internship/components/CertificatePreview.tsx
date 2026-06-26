import React, { useState } from 'react';
import { Download, Maximize2, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CertificatePreviewProps {
  certificateUrl: string | null;
  internName: string;
}

const CertificatePreview: React.FC<CertificatePreviewProps> = ({ certificateUrl, internName }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!certificateUrl) {
    return (
      <div className="w-full h-64 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center text-white/50 backdrop-blur-md">
        <ImageIcon className="w-12 h-12 mb-3 opacity-50" />
        <p>Certificate not uploaded yet</p>
      </div>
    );
  }

  // Handle Supabase Storage public URLs or full URLs
  const fullUrl = certificateUrl.startsWith('http') 
    ? certificateUrl 
    : `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/intern-portal-uploads/${certificateUrl}`;

  const isPdf = fullUrl.toLowerCase().endsWith('.pdf');

  return (
    <>
      <div className="relative group rounded-xl overflow-hidden border border-white/20 bg-black/50 aspect-[1.414/1] shadow-2xl">
        {/* Loading Skeleton */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/5 animate-pulse flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {isPdf ? (
          <iframe 
            src={fullUrl} 
            className="w-full h-full border-none"
            onLoad={() => setIsLoading(false)}
            title={`Certificate for ${internName}`}
          />
        ) : (
          <img 
            src={fullUrl} 
            alt={`Certificate for ${internName}`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onLoad={() => setIsLoading(false)}
          />
        )}

        {/* Action Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <div className="flex justify-end gap-2">
            {!isPdf && (
              <button 
                onClick={() => setIsFullscreen(true)}
                className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg text-white transition-colors"
                title="Fullscreen"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
            )}
            <a 
              href={fullUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg text-white transition-colors"
              title="Open externally"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
            <a 
              href={fullUrl}
              download
              className="p-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white transition-colors"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal (for images only, PDFs usually handle their own via iframe) */}
      <AnimatePresence>
        {isFullscreen && !isPdf && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setIsFullscreen(false)}
          >
            <button 
              className="absolute top-6 right-6 text-white/50 hover:text-white"
              onClick={() => setIsFullscreen(false)}
            >
              Close (Esc)
            </button>
            <motion.img 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={fullUrl} 
              alt="Fullscreen Certificate"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CertificatePreview;
