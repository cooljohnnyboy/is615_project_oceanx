/**
 * Main application header with participant switcher, group badges, and facilitator console.
 */

import React from 'react';
import { 
  Trophy, 
  User, 
  BarChart2, 
  Settings, 
  BookOpen,
  ArrowRightLeft,
  Award
} from 'lucide-react';
import { ParticipantProfile, ScreenView } from '../types';

interface HeaderProps {
  currentParticipant: ParticipantProfile;
  currentScreen: ScreenView;
  onNavigate: (screen: ScreenView) => void;
  onOpenSwitcher: () => void;
  onOpenFacilitator: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentParticipant,
  currentScreen,
  onNavigate,
  onOpenSwitcher,
  onOpenFacilitator
}) => {
  const isGroupB = currentParticipant.group === 'B';

  return (
    <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-40 border-b border-slate-800">
      {/* Top Academic Disclaimer Ribbon */}
      <div className="bg-slate-950 text-slate-400 text-xs px-4 py-1.5 flex flex-wrap justify-between items-center border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-teal-400"></span>
          <span>OceanX Education Research Project • Master’s in IT Digital Transformation</span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline text-slate-400 font-medium">Student prototype — not an official OceanX service.</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenFacilitator}
            className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1.5 font-mono hover:underline focus:outline-none"
            title="Open Facilitator Research Panel"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Facilitator Panel</span>
          </button>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Brand & Participant Meta */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center font-black text-white text-base shadow-sm ring-1 ring-teal-400/30">
                OX
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                    OceanX Explorer Score
                  </h1>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-mono text-teal-300 bg-slate-800 px-2 py-0.5 rounded">
                    <User className="w-3 h-3 text-teal-400" />
                    {currentParticipant.name} ({currentParticipant.id})
                  </span>
                  <span className={`px-2 py-0.5 rounded font-mono font-semibold text-[11px] ${
                    isGroupB ? 'bg-teal-900/80 text-teal-200 border border-teal-700/60' : 'bg-slate-800 text-slate-300'
                  }`}>
                    Group {currentParticipant.group}: {isGroupB ? 'Leaderboard + Personal Progress' : 'Personal Progress Only'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Controls: Participant Switcher & Score */}
          <div className="flex items-center justify-between sm:justify-end gap-3 flex-wrap">
            
            {/* Quick Participant Switcher */}
            <button
              onClick={onOpenSwitcher}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-3 py-1.5 rounded-lg font-medium border border-slate-700 transition flex items-center gap-1.5 shadow-sm"
              title="Switch to another participant in the 20-person cohort"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-teal-400" />
              <span>Switch Explorer (20 Cohort)</span>
            </button>

            {/* Explorer Score Badge */}
            <div className="bg-teal-950/70 border border-teal-500/40 px-3.5 py-1.5 rounded-lg flex items-center gap-2 shadow-inner">
              <Award className="w-4 h-4 text-teal-400" />
              <div className="text-xs">
                <span className="text-teal-300 block leading-none font-medium">Explorer Score</span>
                <span className="text-white font-black text-sm font-mono">{currentParticipant.overallScore} <span className="text-teal-400 font-normal">pts</span></span>
              </div>
            </div>

          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none text-xs sm:text-sm">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`px-3.5 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition ${
              currentScreen === 'dashboard'
                ? 'bg-teal-600 text-white shadow'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {isGroupB ? (
              <>
                <Trophy className="w-4 h-4 text-amber-300" />
                <span>Leaderboard & Personal Progress</span>
              </>
            ) : (
              <>
                <BarChart2 className="w-4 h-4" />
                <span>Personal Progress</span>
              </>
            )}
          </button>

          <button
            onClick={() => onNavigate('sources')}
            className={`px-3.5 py-1.5 rounded-md font-medium flex items-center gap-1.5 ml-auto transition ${
              currentScreen === 'sources'
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Academic Sources</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
