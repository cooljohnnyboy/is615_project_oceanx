/**
 * Exit For Today Modal
 * Concludes the participant's daily exploration session with a clean summary.
 */

import React from 'react';
import { ParticipantProfile } from '../types';
import { CheckCircle2, Award, Compass, Users, HelpCircle, ArrowRight, X } from 'lucide-react';
import { getOceanKnowledgeLevel } from '../data/cohortData';

interface ExitTodayModalProps {
  isOpen: boolean;
  participant: ParticipantProfile;
  onClose: () => void;
  onOpenSwitcher: () => void;
}

export const ExitTodayModal: React.FC<ExitTodayModalProps> = ({
  isOpen,
  participant,
  onClose,
  onOpenSwitcher
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 mx-auto mb-3">
            <CheckCircle2 className="w-8 h-8 text-teal-400" />
          </div>

          <h3 className="text-xl font-black">
            Session Completed, {participant.name}!
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Thank you for exploring OceanX today. Your progress has been safely logged.
          </p>
        </div>

        {/* Progression Summary */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">Explorer Score</span>
              <div className="text-xl font-black text-slate-900 font-mono mt-0.5">
                {participant.overallScore} <span className="text-xs font-normal text-slate-400">pts</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">Learning Journey Progress</span>
              <div className="text-xl font-black text-teal-700 font-mono mt-0.5">
                {participant.learningJourneyProgress} <span className="text-xs font-normal text-slate-500">Topics</span>
              </div>
              <span className="text-[10px] text-teal-800 font-semibold block mt-0.5">
                {getOceanKnowledgeLevel(participant.overallScore)}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">Quiz Attempts</span>
              <div className="text-xl font-black text-slate-900 font-mono mt-0.5">
                {participant.quizzesAttempted}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">Community Actions</span>
              <div className="text-xl font-black text-slate-900 font-mono mt-0.5">
                {participant.communityActionsParticipated}
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 font-medium leading-relaxed">
            🌊 <em>“Every small action and explored topic contributes to protecting and understanding our global ocean.”</em>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenSwitcher();
              }}
              className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Switch to Another Explorer (20 Cohort)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onClose}
              className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
