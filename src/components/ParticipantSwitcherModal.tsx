/**
 * Participant Switcher / Login Modal
 * Allows logging in as any of the 20 simulated cohort participants:
 * Group A (P01 - P10): Personal Progress Only
 * Group B (P11 - P20): Personal Progress + Leaderboard
 */

import React from 'react';
import { ParticipantProfile } from '../types';
import { X, User, ArrowRight, CheckCircle2, Trophy, BarChart2 } from 'lucide-react';
import { getOceanKnowledgeLevel, getExplorerLevel } from '../data/cohortData';

interface ParticipantSwitcherModalProps {
  isOpen: boolean;
  cohort: ParticipantProfile[];
  currentParticipantId: string;
  onSelectParticipant: (id: string) => void;
  onClose: () => void;
}

export const ParticipantSwitcherModal: React.FC<ParticipantSwitcherModalProps> = ({
  isOpen,
  cohort,
  currentParticipantId,
  onSelectParticipant,
  onClose
}) => {
  if (!isOpen) return null;

  const groupA = cohort.filter(p => p.group === 'A');
  const groupB = cohort.filter(p => p.group === 'B');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span>
              <h2 className="text-lg font-bold">Select Cohort Participant Login</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Choose any of the 20 simulated participants to explore their personal dashboard experience
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Group A Section */}
          <div>
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
              <BarChart2 className="w-4 h-4 text-slate-700" />
              <h3 className="text-sm font-bold text-slate-900">
                Group A (P01 - P10): Personal Progress Only
              </h3>
              <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-mono">
                10 Participants (Control)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {groupA.map((p) => {
                const isActive = p.id === currentParticipantId;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectParticipant(p.id);
                      onClose();
                    }}
                    className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
                      isActive
                        ? 'border-teal-600 bg-teal-50/80 ring-2 ring-teal-500 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-xs font-bold text-slate-500">{p.id}</span>
                        {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{p.name}</h4>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-0.5 font-mono">
                      <div className="font-bold text-slate-900 text-xs">{p.overallScore} pts</div>
                      <div>{getExplorerLevel(p.overallScore).name} • {p.learningJourneyProgress} Topics</div>
                      <div>{p.quizzesAttempted} Q • {p.communityActionsParticipated} CA</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Group B Section */}
          <div>
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
              <Trophy className="w-4 h-4 text-teal-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Group B (P11 - P20): Personal Progress + Leaderboard
              </h3>
              <span className="text-[11px] bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-full font-mono font-bold">
                10 Participants (Treatment)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {groupB.map((p) => {
                const isActive = p.id === currentParticipantId;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectParticipant(p.id);
                      onClose();
                    }}
                    className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
                      isActive
                        ? 'border-teal-600 bg-teal-50/80 ring-2 ring-teal-500 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-xs font-bold text-teal-700">{p.id}</span>
                        {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{p.name}</h4>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-0.5 font-mono">
                      <div className="font-bold text-teal-800 text-xs">{p.overallScore} pts</div>
                      <div>{getExplorerLevel(p.overallScore).name} • {p.learningJourneyProgress} Topics</div>
                      <div>{p.quizzesAttempted} Q • {p.communityActionsParticipated} CA</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
          <span>Active Explorer: <strong className="text-slate-900">{currentParticipantId}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
