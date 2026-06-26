import React from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, Calendar, Briefcase, Mail, ArrowLeft, ShieldCheck, User } from 'lucide-react';
import { Intern } from '../types';
import QRCodeGenerator from './QRCodeGenerator';
import CertificatePreview from './CertificatePreview';

interface DashboardProps {
  intern: Intern;
  onReset: () => void;
}

const VerificationDashboard: React.FC<DashboardProps> = ({ intern, onReset }) => {
  const isVerified = intern.status === 'Active' || intern.status === 'Completed';

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="w-full pb-20 relative z-10 font-['Inter']">
      
      {/* Back Button */}
      <motion.button 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onReset}
        className="flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Verify Another Record
      </motion.button>

      {/* Main Grid */}
      <motion.div 
        variants={container as any}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Left Column: Profile & Details */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Profile Card */}
          <motion.div variants={item as any} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-[40px] pointer-events-none"></div>
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 p-1">
                <div className="w-full h-full bg-black rounded-full flex items-center justify-center overflow-hidden">
                  {intern.photo ? (
                    <img src={intern.photo} alt={intern.full_name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-white/50" />
                  )}
                </div>
              </div>
              {isVerified && (
                <div className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <BadgeCheck className="w-4 h-4" /> VERIFIED
                </div>
              )}
            </div>

            <h2 className="text-2xl font-bold text-white mb-1 relative z-10">{intern.full_name}</h2>
            <p className="text-purple-400 font-medium text-sm mb-6 relative z-10">{intern.intern_id}</p>

            <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-3 text-white/80">
                <Briefcase className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider">Domain</p>
                  <p className="font-medium">{intern.domain}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <Calendar className="w-5 h-5 text-pink-400" />
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider">Batch</p>
                  <p className="font-medium">Class of {intern.batch}</p>
                </div>
              </div>
              {intern.email && (
                <div className="flex items-center gap-3 text-white/80">
                  <Mail className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider">Email</p>
                    <p className="font-medium truncate">{intern.email}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Verification Badge & QR */}
          <motion.div variants={item as any} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg flex flex-col items-center text-center">
            <div className="mb-4">
              <QRCodeGenerator internId={intern.intern_id} />
            </div>
            <div className="flex items-center justify-center gap-2 text-green-400 font-bold mb-1">
              <ShieldCheck className="w-5 h-5" />
              Digitally Tamper-Proof
            </div>
            <p className="text-xs text-white/40">Secured by Dremora Cryptographic Verification</p>
            <p className="text-xs text-white/30 mt-2">Verified at: {new Date().toLocaleString()}</p>
          </motion.div>

        </div>

        {/* Right Column: Certificate & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Certificate Preview */}
          <motion.div variants={item as any} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Official Certificate</h3>
              <div className="text-xs font-mono bg-black/50 text-white/60 px-3 py-1 rounded border border-white/10">
                CERT: {intern.certificate_number}
              </div>
            </div>
            
            <CertificatePreview 
              certificateUrl={intern.certificate_url} 
              internName={intern.full_name} 
            />
          </motion.div>

          {/* Internship Timeline */}
          <motion.div variants={item as any} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6">Internship Journey</h3>
            
            <div className="relative border-l border-white/10 ml-3 space-y-8 pb-4">
              
              <div className="relative pl-6">
                <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-purple-500 ring-4 ring-purple-500/20"></div>
                <h4 className="text-white font-medium">Application Selected</h4>
                <p className="text-sm text-white/50">Top 5% of applicants chosen for the {intern.batch} cohort.</p>
              </div>

              <div className="relative pl-6">
                <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-blue-500/20"></div>
                <h4 className="text-white font-medium">Internship Commenced</h4>
                <p className="text-sm text-white/50">{intern.start_date ? new Date(intern.start_date).toLocaleDateString() : 'Joined the elite engineering fellowship.'}</p>
              </div>

              <div className="relative pl-6">
                <div className={`absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full ${intern.status === 'Completed' ? 'bg-green-500 ring-4 ring-green-500/20' : 'bg-yellow-500 ring-4 ring-yellow-500/20 animate-pulse'}`}></div>
                <h4 className="text-white font-medium">{intern.status === 'Completed' ? 'Internship Completed' : 'In Progress'}</h4>
                <p className="text-sm text-white/50">
                  {intern.status === 'Completed' 
                    ? `Successfully completed on ${intern.end_date ? new Date(intern.end_date).toLocaleDateString() : 'schedule'}.`
                    : 'Currently working on live commercial projects.'}
                </p>
              </div>

              {intern.status === 'Completed' && (
                <div className="relative pl-6">
                  <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-green-400 shadow-[0_0_10px_#4ade80]"></div>
                  <h4 className="text-green-400 font-bold">Certificate Issued</h4>
                  <p className="text-sm text-white/50">Globally verifiable certificate generated and cryptographically signed.</p>
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
};

export default VerificationDashboard;
