/**
 * Learning Sources and Research Disclaimers Modal / View
 * Cites the verified sources and clarifies student prototype scope.
 */

import React from 'react';
import { BookOpen, ExternalLink, ShieldCheck, X } from 'lucide-react';

interface SourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SourcesModal: React.FC<SourcesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-500/20 text-teal-300 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Learning Sources & Academic Attribution</h2>
              <p className="text-xs text-slate-400">Master’s in IT Digital Transformation Individual Assignment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-sm text-slate-700 max-h-[75vh] overflow-y-auto">
          
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
            <div className="font-bold text-amber-950">Scope & Disclaimers:</div>
            <p>
              • <strong>Student Prototype:</strong> This software is a functional prototype built for an academic research assignment. It is not an official OceanX service, nor an official OceanX curriculum.
            </p>
            <p>
              • <strong>Educational Exploration:</strong> Progress metrics and Explorer Points within this prototype are engagement mechanisms for testing learner motivation and do not confer credentials, certificates, or real-world prizes.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Scientific Reference Citations
            </h3>

            <div className="space-y-3 text-xs">
              
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <div className="font-bold text-slate-900">Topic 1: Seagrass Meadows & Blue Carbon</div>
                <p className="text-slate-600">
                  Smithsonian National Museum of Natural History: Ocean Portal — <em>“Seagrass and Seagrass Beds”</em> (Smithsonian Ocean).
                </p>
                <p className="text-slate-500 text-[11px]">
                  Reference facts: Seagrass taxonomic classification as flowering marine plants, nursery biodiversity support (up to 40,000 fish/acre), and anoxic sediment carbon burial rates up to 35x higher than tropical rainforests.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <div className="font-bold text-slate-900">Topic 2: Coral Bleaching & Ecological Recovery</div>
                <p className="text-slate-600">
                  National Oceanic and Atmospheric Administration (NOAA) Coral Reef Conservation Program — <em>“What is Coral Bleaching?”</em>
                </p>
                <p className="text-slate-500 text-[11px]">
                  Reference facts: Coral-zooxanthellae endosymbiosis breakdown during prolonged elevated seawater temperatures, expulsion mechanism, physiological distinction between bleached and dead corals, and recovery factors.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <div className="font-bold text-slate-900">Topic 3: Ocean Exploration Technology & Deep-Sea Imaging</div>
                <p className="text-slate-600">
                  NOAA Office of Ocean Exploration and Research — <em>“What is an ROV?”</em> & Deep-Sea Imaging Systems.
                </p>
                <p className="text-slate-500 text-[11px]">
                  Reference facts: Remotely Operated Vehicle tethering via umbilical cable (power and high-bandwidth fiber optics), illumination below the 200m photic threshold, and calibrated parallel laser measurement systems.
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition"
          >
            Close Sources
          </button>
        </div>

      </div>
    </div>
  );
};
