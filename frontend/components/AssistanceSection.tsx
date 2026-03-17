'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const capabilities = [
  "Operational Efficiency & Optimization",
  "Digital Transformation & Health Tech",
  "Regulatory Compliance & Risk Management",
  "Strategic Growth & Market Entry",
  "Financial Advisory"
];

const industries = [
  "Medical"
];

export default function AssistanceSection() {
  const [activeTab, setActiveTab] = useState<'capabilities' | 'industries' | null>(null);
  const [selectedCapability, setSelectedCapability] = useState("Capabilities");
  const [selectedIndustry, setSelectedIndustry] = useState("Industries");

  return (
    <section className="flex flex-col md:flex-row min-h-[600px] w-full overflow-hidden bg-white">
      {/* Left Column: Interactive Selection */}
      <div className="w-full md:w-1/2 bg-white p-12 lg:p-24 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl"
        >
          <h2 className="text-5xl lg:text-6xl font-black text-[#1B3022] mb-8 leading-tight tracking-tighter">
            How can we assist you today?
          </h2>
          <p className="text-lg text-slate-500 mb-12 font-medium">
            Learn more about our core areas of expertise by selecting your topic of interest.
          </p>

          <div className="flex flex-wrap gap-4 relative">
            {/* Capabilities Selector */}
            <div className="relative z-30">
              <button
                onClick={() => setActiveTab(activeTab === 'capabilities' ? null : 'capabilities')}
                className={`flex items-center justify-between gap-4 px-6 py-4 rounded-full border border-[#143D2C]/10 bg-slate-50 min-w-[240px] text-[#143D2C] font-semibold transition-all ${activeTab === 'capabilities' ? 'ring-2 ring-emerald-500 bg-white shadow-lg' : 'hover:bg-slate-100'}`}
              >
                {selectedCapability}
                {activeTab === 'capabilities' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              <AnimatePresence>
                {activeTab === 'capabilities' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-full bg-white rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden"
                  >
                    <div className="max-h-[300px] overflow-y-auto py-4 custom-scrollbar">
                      {capabilities.map((cap) => (
                        <button
                          key={cap}
                          onClick={() => {
                            setSelectedCapability(cap);
                            setActiveTab(null);
                          }}
                          className="w-full text-left px-6 py-3 hover:bg-emerald-50 text-[#143D2C] text-sm font-medium transition-colors"
                        >
                          {cap}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Industry Selector */}
            <div className="relative z-20">
              <button
                onClick={() => setActiveTab(activeTab === 'industries' ? null : 'industries')}
                className={`flex items-center justify-between gap-4 px-6 py-4 rounded-full border border-[#143D2C]/10 bg-slate-50 min-w-[240px] text-[#143D2C] font-semibold transition-all ${activeTab === 'industries' ? 'ring-2 ring-emerald-500 bg-white shadow-lg' : 'hover:bg-slate-100'}`}
              >
                {selectedIndustry}
                {activeTab === 'industries' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              <AnimatePresence>
                {activeTab === 'industries' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-full bg-white rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden"
                  >
                    <div className="py-4">
                      {industries.map((ind) => (
                        <button
                          key={ind}
                          onClick={() => {
                            setSelectedIndustry(ind);
                            setActiveTab(null);
                          }}
                          className="w-full text-left px-6 py-3 hover:bg-emerald-50 text-[#143D2C] text-sm font-medium transition-colors"
                        >
                          {ind}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Column: Visual Component */}
      <div className="w-full md:w-1/2 relative bg-[#0a0f1e] overflow-hidden min-h-[400px]">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2 }}
          src="/dark_emerald_waves.png"
          alt="Consultancy Visual"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #A1F28B;
          border-radius: 10px;
        }
      `}</style>
    </section>
  );
}
