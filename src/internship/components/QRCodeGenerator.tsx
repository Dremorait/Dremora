import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';

interface QRCodeGeneratorProps {
  internId: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ internId }) => {
  // Construct the verification URL
  const baseUrl = window.location.origin + window.location.pathname;
  const verificationUrl = `${baseUrl}?verify=${internId}`;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-4 rounded-xl shadow-xl inline-block"
    >
      <QRCodeSVG 
        value={verificationUrl} 
        size={150}
        bgColor={"#ffffff"}
        fgColor={"#000000"}
        level={"H"}
        includeMargin={false}
      />
      <div className="text-center mt-2">
        <p className="text-xs text-gray-500 font-medium">Scan to Verify</p>
      </div>
    </motion.div>
  );
};

export default QRCodeGenerator;
