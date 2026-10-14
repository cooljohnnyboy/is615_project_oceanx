/**
 * Facilitator Research Panel
 * Monitors Group A vs Group B statistics (activity completion percentage),
 * tracks whether participants viewed the leaderboard and continued with activities,
 * displays the 20-participant live cohort roster, and provides CSV/JSON exports.
 */

import React, { useState } from 'react';
import { ParticipantProfile, CohortComparisonStats, ActivityEvent } from '../types';
import { 
  X, 
  Download, 
  BarChart2, 
  Users, 
  Trophy, 
  RotateCcw, 
  FileText, 
  CheckCircle2, 
  XCircle,
  AlertCircle, 
  ArrowRight,
  Activity,
  ShieldCheck
} from 'lucide-react';
import { 
  generateCohortSummaryCSV, 
  generateEventsCSV, 
  downloadExportFile 
} from '../utils/exportCohort';
import { getOceanKnowledgeLevel, getExplorerLevel } from '../data/cohortData';

interface FacilitatorPanelProps {
  isOpen: boolean;
  cohort: ParticipantProfile[];
  stats: CohortComparisonStats;
  events: ActivityEvent[];
  currentParticipantId: string;
  onClose: () => void;
  onSelectParticipant: (id: string) => void;
  onResetCohort: () => void;
}

export const FacilitatorPanel: React.FC<FacilitatorPanelProps> = ({
  isOpen,
  cohort,
  stats,
  events,
  currentParticipantId,
  onClose,
  onSelectParticipant,
  onResetCohort
}) => {
  const [activeTab, setActiveTab] = useState<'comparison' | 'roster' | 'events'>('comparison');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOpen) return null;

  const handleExportSummaryCSV = () => {
    const csv = generateCohortSummaryCSV(cohort, stats);
    downloadExportFile(csv, `oceanx_cohort_research_summary_${Date.now()}.csv`);
  };

  const handleExportEventsCSV = () => {
    const csv = generateEventsCSV(events);
    downloadExportFile(csv, `oceanx_cohort_event_logs_${Date.now()}.csv`);
  };

  const handleExportJSON = () => {
    const data = {
      cohort,
      stats,
      events,
      exportedAt: new Date().toISOString()
    };
    downloadExportFile(JSON.stringify(data, null, 2), `oceanx_full_cohort_data_${Date.now()}.json`, 'application/json');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div className="w-full max-w-3xl bg-white min-h-screen shadow-2xl flex flex-col border-l border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span>
              <h2 className="text-base font-bold tracking-tight">Facilitator Experiment Console</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              20-Participant Cohort Experiment: Group A (Personal Only) vs Group B (Personal + Leaderboard)
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('comparison')}
            className={`pb-2.5 px-3 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'comparison'
                ? 'border-teal-600 text-teal-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Group A vs B Statistics</span>
          </button>

          <button
            onClick={() => setActiveTab('roster')}
            className={`pb-2.5 px-3 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'roster'
                ? 'border-teal-600 text-teal-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>20-Participant Live Roster</span>
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`pb-2.5 px-3 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'events'
                ? 'border-teal-600 text-teal-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Live Action Logs ({events.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          {/* TAB 1: Group Comparison Statistics */}
          {activeTab === 'comparison' && (
            <div className="space-y-6">
              
              {/* PRIMARY RESEARCH OUTCOME: Activity Completion Percentage Comparison */}
              <div className="bg-gradient-to-r from-teal-950 to-slate-900 rounded-2xl p-6 text-white border border-teal-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-white">
                      Total Activities Completed by Groups
                    </h3>
                  </div>
                  <span className="text-xs bg-teal-800/80 text-teal-200 px-2.5 py-1 rounded-full font-mono font-bold">
                    20 Participants
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Group A Card */}
                  <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-300 uppercase">Group A (Control)</span>
                      <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded font-mono">
                        Personal Only (n=10)
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white font-mono">
                        {stats.groupA.totalActivitiesCompleted}
                      </span>
                      <span className="text-xs text-slate-400">total activities</span>
                    </div>
                    <span className="text-xs text-slate-300 block mt-1.5 font-medium">
                      Avg. Activities Completed: <strong>{stats.groupA.avgActivitiesCompleted}</strong> activities / participant
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Avg. Learning Topics: <strong>{stats.groupA.avgLearningJourneyProgress}</strong> • Quizzes: {stats.groupA.avgQuizzes} • Actions: {stats.groupA.avgCommunityActions} • Score: {stats.groupA.avgScore} pts
                    </span>
                  </div>

                  {/* Group B Card */}
                  <div className="bg-teal-900/50 rounded-xl p-4 border border-teal-500/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-teal-200 uppercase">Group B (Treatment)</span>
                      <span className="text-[10px] bg-teal-800 text-teal-200 px-2 py-0.5 rounded font-mono">
                        + Leaderboard (n=10)
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between gap-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-teal-300 font-mono">
                          {stats.groupB.totalActivitiesCompleted}
                        </span>
                        <span className="text-xs text-teal-300/80">total activities</span>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-teal-800 text-teal-200 font-mono font-bold">
                        +{stats.comparison.groupBMorePercent}% vs Group A
                      </span>
                    </div>
                    <span className="text-xs text-teal-200 block mt-1.5 font-medium">
                      Avg. Activities Completed: <strong>{stats.groupB.avgActivitiesCompleted}</strong> activities / participant
                    </span>
                    <span className="text-[11px] text-teal-300/80 block mt-0.5">
                      Avg. Learning Topics: <strong>{stats.groupB.avgLearningJourneyProgress}</strong> • Quizzes: {stats.groupB.avgQuizzes} • Actions: {stats.groupB.avgCommunityActions} • Score: {stats.groupB.avgScore} pts
                    </span>
                  </div>
                </div>

                {/* Comparative Difference callout */}
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-slate-300 flex items-center justify-between">
                  <span>
                    Group Comparison: Group B completed <strong className="text-teal-300">+{stats.comparison.groupBMorePercent}% more activities</strong> than Group A (+{stats.comparison.activityDifference} activities)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Δ +{(stats.groupB.avgActivitiesCompleted - stats.groupA.avgActivitiesCompleted).toFixed(1)} avg. per participant
                  </span>
                </div>
              </div>

              {/* BEHAVIORAL TELEMETRY: Group B De-motivation Monitoring */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Group B de-motivation monitoring
                      </h3>
                      <p className="text-xs text-slate-500">
                        Median activity benchmark vs individual bottom 3 ranked in Group B.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl font-mono font-bold border border-slate-200">
                      Group B Median Total Activities: <strong className="text-teal-700 font-black text-sm">{stats.groupB.demotivation.medianTotalActivities}</strong>
                    </span>
                  </div>
                </div>

                {/* Individual comparison for the last 3 ranked in Group B */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
                    <span>Individual Comparison: Last 3 Ranked in Group B</span>
                    <span className="font-mono text-[11px]">Threshold: &lt; 40% (✅) | ≥ 40% (❌)</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {stats.groupB.demotivation.bottomThreeRanked.map((item) => {
                      const isWithinThreshold = item.differencePercentFromMedian < 40;

                      return (
                        <div 
                          key={item.participantId}
                          className={`p-4 rounded-xl border transition-all ${
                            isWithinThreshold 
                              ? 'bg-emerald-50/40 border-emerald-200' 
                              : 'bg-rose-50/40 border-rose-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-extrabold text-slate-700 font-mono">
                              Rank #{item.rankInGroup} in Group B
                            </span>
                            <span className="text-xs font-mono font-bold text-slate-500">
                              {item.overallScore} pts
                            </span>
                          </div>

                          <div className="text-sm font-bold text-slate-900 mb-2">
                            {item.name} <span className="text-xs text-slate-500 font-mono">({item.participantId})</span>
                          </div>

                          <div className="text-xs text-slate-600 space-y-0.5 font-mono mb-3 bg-white/80 p-2.5 rounded-lg border border-slate-200/80">
                            <div>Total Activities: <strong className="text-slate-900 font-black">{item.totalActivities}</strong></div>
                            <div className="text-[11px] text-slate-500">
                              {item.learningTopicsCompleted} Topics • {item.quizzesAttempted} Quizzes • {item.communityActions} Actions
                            </div>
                          </div>

                          {/* Difference vs Median with Green Tick (<40%) or Red Cross (>=40%) */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                            <div>
                              <span className="text-slate-500 block text-[10px] uppercase font-bold">Diff vs Median</span>
                              <span className={`text-sm font-black font-mono ${isWithinThreshold ? 'text-emerald-700' : 'text-rose-700'}`}>
                                {item.differencePercentFromMedian}%
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {isWithinThreshold ? (
                                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 shadow-xs">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                  <span>&lt; 40%</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 text-xs font-bold border border-rose-300 shadow-xs">
                                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                                  <span>≥ 40%</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Explanatory research note */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <span>💡 De-motivation Research Benchmark:</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Compares total activities (learning topics + quizzes + community actions) completed by each of the last 3 ranked participants in Group B against the Group B median ({stats.groupB.demotivation.medianTotalActivities} activities). A <strong className="text-emerald-700">green tick (&lt; 40%)</strong> confirms participation remains resilient, whereas a <strong className="text-rose-700">red cross (≥ 40%)</strong> warns of significant disengagement and de-motivation risk due to visible rank disparity.
                  </p>
                </div>
              </div>

              {/* Data Export Center */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Download className="w-4 h-4 text-teal-600" />
                  <span>Export Research Data</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Export complete cohort spreadsheets and event streams for statistical analysis.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={handleExportSummaryCSV}
                    className="py-2.5 px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Summary CSV</span>
                  </button>

                  <button
                    onClick={handleExportEventsCSV}
                    className="py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-teal-600" />
                    <span>Event Logs CSV</span>
                  </button>

                  <button
                    onClick={handleExportJSON}
                    className="py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-teal-600" />
                    <span>Cohort JSON</span>
                  </button>
                </div>
              </div>

              {/* Reset / Resimulate Cohort */}
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-rose-950">Reset Simulated Cohort</h4>
                  <p className="text-[11px] text-rose-800">
                    Resets all 20 participants back to default baseline progression values.
                  </p>
                </div>

                {!showResetConfirm ? (
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="px-3 py-1.5 bg-white border border-rose-300 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-bold transition flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Cohort</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onResetCohort();
                        setShowResetConfirm(false);
                      }}
                      className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="px-2 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: Full 20-Participant Cohort Roster */}
          {activeTab === 'roster' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Select any participant to immediately switch to their perspective:</span>
                <span className="font-mono">Active: {currentParticipantId}</span>
              </div>

              <div className="divide-y divide-slate-200 border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
                {cohort.map((p) => {
                  const isActive = p.id === currentParticipantId;

                  return (
                    <div
                      key={p.id}
                      className={`p-3.5 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition ${
                        isActive ? 'bg-teal-50/70 border-l-4 border-l-teal-600' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-slate-400 w-8">{p.id}</span>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-2">
                            <span>{p.name}</span>
                            <span className={`px-2 py-0.2 rounded font-mono text-[10px] ${
                              p.group === 'A' ? 'bg-slate-100 text-slate-700' : 'bg-teal-100 text-teal-800 font-bold'
                            }`}>
                              Group {p.group}
                            </span>
                            {isActive && (
                              <span className="bg-teal-600 text-white text-[9px] uppercase px-1.5 rounded font-extrabold">
                                Active
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500">
                            {p.overallScore} pts ({getExplorerLevel(p.overallScore).name}) • {p.learningJourneyProgress} Topics • {p.quizzesAttempted} Quizzes • {p.communityActionsParticipated} Actions
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 pl-11 sm:pl-0">
                        {!isActive ? (
                          <button
                            onClick={() => {
                              onSelectParticipant(p.id);
                              onClose();
                            }}
                            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition"
                          >
                            Login as {p.id}
                          </button>
                        ) : (
                          <span className="text-xs text-teal-700 font-bold px-2 py-1">Current User</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: Live Event Logs Stream */}
          {activeTab === 'events' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Real-time participant behavioral logs ({events.length})</span>
                <button
                  onClick={handleExportEventsCSV}
                  className="text-teal-700 font-semibold hover:underline"
                >
                  Download CSV
                </button>
              </div>

              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {events.slice().reverse().map((ev) => (
                  <div key={ev.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center justify-between font-mono mb-1">
                      <span className="font-bold text-teal-800">{ev.eventType}</span>
                      <span className="text-slate-400 text-[11px]">{new Date(ev.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 mb-1">
                      Participant: <strong>{ev.participantId}</strong> (Group {ev.group})
                    </div>
                    <pre className="text-[10px] text-slate-600 bg-white p-2 rounded border border-slate-100 overflow-x-auto">
                      {JSON.stringify(ev.details, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-end">
          <span>OceanX Explorer Score Prototype v3.0</span>
        </div>

      </div>
    </div>
  );
};
