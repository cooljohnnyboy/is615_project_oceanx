/**
 * Participant Dashboard: Integrated View
 * For Group B: Leaderboard is displayed FIRST, followed by Personal Progress, followed by Activity Choices.
 * For Group A: Personal Progress is displayed first, followed by Activity Choices (no leaderboard).
 */

import React, { useState } from 'react';
import { ActivityOption, ParticipantProfile } from '../types';
import { AVAILABLE_ACTIVITIES, getOceanKnowledgeLevel, getExplorerLevel, EXPLORER_LEVELS } from '../data/cohortData';
import { computeCohortLeaderboard } from '../utils/ranking';
import { 
  Award, 
  Compass, 
  HelpCircle, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  LogOut, 
  Sparkles, 
  Trophy,
  ArrowDown,
  Layers
} from 'lucide-react';

interface DashboardProps {
  participant: ParticipantProfile;
  cohort: ParticipantProfile[];
  onCompleteActivity: (activity: ActivityOption) => void;
  onExitToday: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  participant,
  cohort,
  onCompleteActivity,
  onExitToday
}) => {
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [recentlyCompleted, setRecentlyCompleted] = useState<ActivityOption | null>(null);

  const isGroupB = participant.group === 'B';

  // For Group B: Compute ranked leaderboard entries and personalized nudge
  const rankedEntries = isGroupB ? computeCohortLeaderboard(cohort, participant.id) : [];
  const currentRankEntry = isGroupB ? rankedEntries.find(r => r.isCurrentParticipant) : null;
  const currentRank = currentRankEntry?.rank ?? '—';
  const totalExplorers = rankedEntries.length;

  // Explorer Level progression state pegged to Explorer Score (0 - 600 points)
  const currentExplorerLevel = getExplorerLevel(participant.overallScore);
  const nextExplorerLevel = EXPLORER_LEVELS.find(l => l.level === currentExplorerLevel.level + 1);
  const pointsToNextLevel = nextExplorerLevel ? Math.max(0, nextExplorerLevel.minPoints - participant.overallScore) : 0;
  const progressPercent = Math.min(100, Math.max(0, (participant.overallScore / 600) * 100));

  const handleContinueWithActivity = (act: ActivityOption) => {
    onCompleteActivity(act);
    setRecentlyCompleted(act);
    setSelectedActivityId(null);

    // Clear celebration banner after 5 seconds
    setTimeout(() => {
      setRecentlyCompleted(null);
    }, 5000);
  };

  const scrollToActivities = () => {
    const el = document.getElementById('activities-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-sm border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1 bg-teal-500/20 text-teal-300 rounded-lg">
                <Compass className="w-4 h-4" />
              </span>
              <span className="text-xs font-mono uppercase tracking-widest text-teal-300">
                OceanX Learning Dashboard • Group {participant.group}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome back, {participant.name}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              {isGroupB 
                ? 'Review your cohort leaderboard standing below, check your personal progression, and choose your next activity.' 
                : 'Track your personal ocean literacy journey, review completed actions, and choose your next exploration step.'}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={onExitToday}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-2 shadow-sm"
              title="Save progress and wrap up your session"
            >
              <LogOut className="w-4 h-4 text-slate-400" />
              <span>Exit for today</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity Completion Alert */}
      {recentlyCompleted && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 text-xs text-emerald-900 animate-fadeIn shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-emerald-600 text-white rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <strong className="font-bold">Activity logged successfully:</strong> {recentlyCompleted.title}
              <span className="ml-2 font-mono text-emerald-700 font-extrabold">(+{recentlyCompleted.points} Explorer Points awarded!)</span>
            </div>
          </div>
          <span className="text-emerald-700 font-semibold text-[11px]">Progress & Standings updated</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* FOR GROUP B: SHOW EVERYTHING OF THE LEADERBOARD FIRST!    */}
      {/* ======================================================== */}
      {isGroupB && (
        <section id="leaderboard-section" className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-amber-500" />
                <span>Group B Leaderboard</span>
              </h2>
            </div>
            <span className="text-xs font-mono bg-teal-50 text-teal-800 border border-teal-200 px-3 py-1 rounded-full font-bold">
              Group B: Visible Leaderboard
            </span>
          </div>

          {/* Leaderboard Standing & Encouraging Nudge Spotlight Card */}
          <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-teal-700 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-amber-300 shrink-0">
                  <Trophy className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-teal-300 font-semibold">
                      Your Current Standing
                    </span>
                    <span className="text-[10px] bg-teal-700 text-white px-2 py-0.5 rounded-full font-bold">
                      Explorer {participant.id} (Group B)
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-white mt-0.5">
                    {participant.name}
                  </h3>
                  <p className="text-xs text-slate-300">
                    Explorer Score: <strong className="text-teal-300 font-mono text-sm">{participant.overallScore} pts</strong> • Level: <strong className="text-teal-200">{getExplorerLevel(participant.overallScore).name}</strong>
                  </p>
                </div>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 px-5 py-3 rounded-2xl text-left sm:text-center self-start sm:self-auto">
                <span className="text-[11px] text-slate-400 block uppercase tracking-wider font-semibold">Group B Rank</span>
                <span className="text-3xl font-black text-amber-300 font-mono">#{currentRank}</span>
                <span className="text-[11px] text-slate-400 block font-sans">of {totalExplorers} explorers</span>
              </div>
            </div>

            {/* Personalized Encouraging Nudge Box */}
            {currentRankEntry?.nudgeMessage && (
              <div className="p-4 rounded-2xl bg-teal-950/80 border border-teal-400/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-teal-100 animate-fadeIn">
                <div className="flex items-start gap-2.5">
                  <Sparkles className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold uppercase tracking-wider text-[10px] text-amber-300 block">
                      Group B Nudge
                    </span>
                    <p className="leading-relaxed font-medium mt-0.5">
                      {currentRankEntry.nudgeMessage}
                    </p>
                  </div>
                </div>

                <button
                  onClick={scrollToActivities}
                  className="px-3.5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl font-bold text-xs shrink-0 transition flex items-center justify-center gap-1.5 shadow self-start sm:self-auto"
                >
                  <span>Explore Activities Below</span>
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Full Group B Cohort Leaderboard Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/60">
              <div>
                <h4 className="text-sm font-bold text-slate-900">OceanX Group B Leaderboard</h4>
                <p className="text-xs text-slate-500">Live rankings based on Explorer Scores across Group B participants</p>
              </div>
              <span className="text-xs text-slate-500 bg-white px-3 py-1 rounded-lg border border-slate-200 font-mono">
                Standard competition ranking (1224 rule)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 w-16 text-center">Rank</th>
                    <th className="py-3 px-4">Explorer</th>
                    <th className="py-3 px-4 text-center">Learning Journey Progress</th>
                    <th className="py-3 px-4 text-center">Quizzes</th>
                    <th className="py-3 px-4 text-center">Community Actions</th>
                    <th className="py-3 px-4 text-right">Explorer Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rankedEntries.map((entry) => {
                    const isUser = entry.isCurrentParticipant;

                    return (
                      <tr
                        key={entry.participantId}
                        className={`transition-colors ${
                          isUser
                            ? 'bg-teal-50/80 hover:bg-teal-50 font-bold border-l-4 border-l-teal-600'
                            : 'hover:bg-slate-50/60 text-slate-700'
                        }`}
                      >
                        {/* Rank */}
                        <td className="py-3.5 px-4 text-center font-mono">
                          {entry.rank === 1 ? (
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-800 font-extrabold text-xs shadow-sm">
                              1
                            </span>
                          ) : entry.rank === 2 ? (
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-extrabold text-xs">
                              2
                            </span>
                          ) : entry.rank === 3 ? (
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-50 text-amber-900 border border-amber-200 font-extrabold text-xs">
                              3
                            </span>
                          ) : (
                            <span className="text-slate-500 text-xs font-semibold">
                              #{entry.rank}
                            </span>
                          )}
                        </td>

                        {/* Participant Name & Code */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                              isUser 
                                ? 'bg-teal-600 text-white ring-2 ring-teal-400' 
                                : 'bg-slate-200 text-slate-700'
                            }`}>
                              {isUser ? 'YOU' : entry.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className={isUser ? 'text-teal-950 font-bold text-sm' : 'font-semibold text-slate-900 text-sm'}>
                                  {entry.name}
                                </span>
                                <span className="font-mono text-xs text-slate-400">
                                  ({entry.participantId})
                                </span>
                                {isUser && (
                                  <span className="bg-teal-600 text-white text-[10px] uppercase font-extrabold px-1.5 py-0.2 rounded">
                                    YOU
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Learning Journey Progress: Topics completed */}
                        <td className="py-3.5 px-4 text-center font-mono text-xs font-semibold">
                          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-cyan-50 text-cyan-900 border border-cyan-200 font-bold">
                            {entry.learningJourneyProgress} Topics
                          </span>
                        </td>

                        {/* Quizzes */}
                        <td className="py-3.5 px-4 text-center text-xs font-mono text-slate-600">
                          {entry.quizzesAttempted}
                        </td>

                        {/* Community Actions */}
                        <td className="py-3.5 px-4 text-center text-xs font-mono text-slate-600">
                          {entry.communityActions}
                        </td>

                        {/* Explorer Score */}
                        <td className="py-3.5 px-4 text-right">
                          <span className={`font-mono text-base ${isUser ? 'text-teal-700 font-black' : 'font-bold text-slate-900'}`}>
                            {entry.score}
                          </span>
                          <span className="text-xs text-slate-400 ml-1 font-normal">pts</span>
                          <div className="text-[10px] text-teal-700 font-medium">
                            {getExplorerLevel(entry.score).name}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* PERSONAL PROGRESSION SECTION (FOLLOWS LEADERBOARD FOR B) */}
      {/* ======================================================== */}
      <section id="progress-section" className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-600" />
              <span>Personal Progression</span>
            </h2>
            <p className="text-xs text-slate-500">
              Detailed tracking of your Explorer Score, Learning Journey topics completed, quiz attempts, and community actions.
            </p>
          </div>
          <span className="text-xs font-mono bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-semibold">
            Individual Progress Record
          </span>
        </div>

        {/* 4 Core Metric Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Metric 1: Explorer Score */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Explorer Score</span>
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900 font-mono">
                {participant.overallScore} <span className="text-sm font-normal text-slate-500">pts</span>
              </div>
              <span className="text-[11px] text-teal-700 font-medium">Earned across all activities</span>
            </div>
          </div>

          {/* Metric 2: Learning Journey Progress */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Learning Journey Progress</span>
              <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900 font-mono">
                {participant.learningJourneyProgress}
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Learning topics completed</span>
            </div>
          </div>

          {/* Metric 3: Number of Quizzes Attempts */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Quiz Attempts</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900 font-mono">
                {participant.quizzesAttempted}
              </div>
              <span className="text-[11px] text-slate-500">Knowledge checks completed</span>
            </div>
          </div>

          {/* Metric 4: Number of Community Actions Participated */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Community Actions</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900 font-mono">
                {participant.communityActionsParticipated}
              </div>
              <span className="text-[11px] text-emerald-700 font-medium">Real-world ocean stewardship actions</span>
            </div>
          </div>

        </div>

        {/* Detailed Progress Track Visual for Explorer Level Progression */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Explorer Level Progression
            </span>
            <span className="text-xs text-slate-500">
              Current: <strong className="text-teal-700 font-bold">{currentExplorerLevel.name}</strong> ({participant.overallScore} / 600 points)
              {nextExplorerLevel ? (
                <span className="text-slate-400 font-normal"> • {pointsToNextLevel} pts to {nextExplorerLevel.name}</span>
              ) : (
                <span className="text-teal-600 font-semibold"> • Maximum Explorer Level Reached</span>
              )}
            </span>
          </div>

          {/* Progress bar pegged to Explorer Score points (0 to 600 points) */}
          <div className="relative pt-2">
            <div className="relative w-full bg-slate-100 rounded-full h-3.5 overflow-hidden border border-slate-200">
              <div 
                className="bg-gradient-to-r from-teal-500 via-teal-600 to-cyan-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Threshold tick marks pegged to points */}
            <div className="relative w-full h-2 pointer-events-none mt-1">
              <span className="absolute left-0 -translate-x-1/2 w-0.5 h-2 bg-slate-300" title="Surface Zone: 0 points" />
              <span className="absolute left-[25%] -translate-x-1/2 w-0.5 h-2 bg-slate-300" title="Sunlight Zone: 150 points" />
              <span className="absolute left-[41.667%] -translate-x-1/2 w-0.5 h-2 bg-slate-300" title="Twilight Zone: 250 points" />
              <span className="absolute left-[66.667%] -translate-x-1/2 w-0.5 h-2 bg-slate-300" title="Midnight Zone: 400 points" />
              <span className="absolute left-[100%] -translate-x-1/2 w-0.5 h-2 bg-slate-300" title="Abyssal Zone: 600 points" />
            </div>

            {/* Explorer Levels pegged to points */}
            <div className="grid grid-cols-5 text-xs mt-1.5 font-bold gap-1">
              <div className={participant.overallScore >= 0 ? "text-teal-800 font-extrabold" : "text-slate-400 font-medium"}>
                <div className="flex items-center gap-1">
                  {participant.overallScore >= 0 && <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block"></span>}
                  <span>Surface Zone</span>
                </div>
                <span className="text-[10px] text-slate-500 font-normal block">0 points</span>
              </div>
              <div className={`text-center ${participant.overallScore >= 150 ? "text-teal-800 font-extrabold" : "text-slate-400 font-medium"}`}>
                <div className="flex items-center justify-center gap-1">
                  {participant.overallScore >= 150 && <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block"></span>}
                  <span>Sunlight Zone</span>
                </div>
                <span className="text-[10px] text-slate-500 font-normal block">150 points</span>
              </div>
              <div className={`text-center ${participant.overallScore >= 250 ? "text-teal-800 font-extrabold" : "text-slate-400 font-medium"}`}>
                <div className="flex items-center justify-center gap-1">
                  {participant.overallScore >= 250 && <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block"></span>}
                  <span>Twilight Zone</span>
                </div>
                <span className="text-[10px] text-slate-500 font-normal block">250 points</span>
              </div>
              <div className={`text-center ${participant.overallScore >= 400 ? "text-teal-800 font-extrabold" : "text-slate-400 font-medium"}`}>
                <div className="flex items-center justify-center gap-1">
                  {participant.overallScore >= 400 && <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block"></span>}
                  <span>Midnight Zone</span>
                </div>
                <span className="text-[10px] text-slate-500 font-normal block">400 points</span>
              </div>
              <div className={`text-right ${participant.overallScore >= 600 ? "text-teal-800 font-extrabold" : "text-slate-400 font-medium"}`}>
                <div className="flex items-center justify-end gap-1">
                  {participant.overallScore >= 600 && <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block"></span>}
                  <span>Abyssal Zone</span>
                </div>
                <span className="text-[10px] text-slate-500 font-normal block">600 points</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* ACTIVITY CONTINUATION & EXIT PROMPT SECTION               */}
      {/* ======================================================== */}
      <section id="activities-section" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-600" />
              <span>What would you like to explore next?</span>
            </h2>
            <p className="text-xs text-slate-500">
              Select an activity below to continue your ocean journey, or choose to wrap up for today.
            </p>
          </div>

          <button
            onClick={onExitToday}
            className="self-start sm:self-auto px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit for today</span>
          </button>
        </div>

        {/* Activity Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {AVAILABLE_ACTIVITIES.map((act) => {
            const isSelected = selectedActivityId === act.id;

            return (
              <div
                key={act.id}
                className={`bg-white rounded-2xl border p-5 flex flex-col justify-between transition-all duration-200 shadow-sm ${
                  isSelected 
                    ? 'border-teal-500 ring-2 ring-teal-500/20 shadow-md' 
                    : 'border-slate-200 hover:border-slate-300 hover:shadow'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${act.badgeColor}`}>
                      {act.category}
                    </span>
                    <span className="text-xs font-mono font-extrabold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      +{act.points} pts
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-1.5 leading-snug">
                    {act.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {act.shortDescription}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
                  <span className="text-[11px] text-slate-400">
                    Est. {act.estimatedMinutes}
                  </span>

                  <button
                    onClick={() => handleContinueWithActivity(act)}
                    className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Continue with this activity</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Exit Prompt Strip */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <span className="text-slate-600">
            Finished your learning session? You can save your progress and return anytime.
          </span>

          <button
            onClick={onExitToday}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-300 rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm self-start sm:self-auto"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit for today</span>
          </button>
        </div>
      </section>

    </div>
  );
};
