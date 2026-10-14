/**
 * OceanX Explorer Score Prototype
 * Master's in IT Digital Transformation Individual Assignment
 * Testing: Personal Progress (Group A, n=10) vs Personal Progress + Leaderboard (Group B, n=10)
 * For Group B: Leaderboard is displayed together with personal progress at the top of the page.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  ParticipantProfile, 
  ScreenView, 
  ActivityOption, 
  ActivityEvent 
} from './types';
import { 
  loadCohort, 
  saveCohort, 
  resetCohortToDefault, 
  loadActiveParticipantId, 
  saveActiveParticipantId,
  loadEvents,
  appendEvent,
  computeCohortComparisonStats
} from './utils/cohortStorage';
import { getOceanKnowledgeLevel } from './data/cohortData';

// Components
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ParticipantSwitcherModal } from './components/ParticipantSwitcherModal';
import { ExitTodayModal } from './components/ExitTodayModal';
import { FacilitatorPanel } from './components/FacilitatorPanel';
import { SourcesModal } from './components/SourcesModal';

export default function App() {
  // State: 20-Participant Cohort
  const [cohort, setCohort] = useState<ParticipantProfile[]>(() => loadCohort());

  // State: Active Participant ID (defaults to P01)
  const [activeParticipantId, setActiveParticipantId] = useState<string>(() => loadActiveParticipantId());

  // Navigation Screen View (dashboard or sources)
  const [currentScreen, setCurrentScreen] = useState<ScreenView>('dashboard');

  // Activity Event Stream
  const [events, setEvents] = useState<ActivityEvent[]>(() => loadEvents());

  // Modals
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [isFacilitatorOpen, setIsFacilitatorOpen] = useState(false);
  const [isExitTodayOpen, setIsExitTodayOpen] = useState(false);
  const [isSourcesOpen, setIsSourcesOpen] = useState(false);

  // Active Participant Lookup
  const currentParticipant = cohort.find(p => p.id.toUpperCase() === activeParticipantId.toUpperCase()) || cohort[0];

  // Helper to record events
  const recordEvent = useCallback((
    eventType: ActivityEvent['eventType'], 
    details: Record<string, any> = {}
  ) => {
    appendEvent({
      participantId: currentParticipant.id,
      group: currentParticipant.group,
      eventType,
      details
    });
    setEvents(loadEvents());
  }, [currentParticipant]);

  // Handler: Switch Participant
  const handleSelectParticipant = (newId: string) => {
    setActiveParticipantId(newId);
    saveActiveParticipantId(newId);
    setCurrentScreen('dashboard');

    // Register last active timestamp for the switched participant
    setCohort(prev => {
      const updated = prev.map(p => {
        if (p.id.toUpperCase() === newId.toUpperCase()) {
          return {
            ...p,
            lastActiveTimestamp: new Date().toISOString()
          };
        }
        return p;
      });
      saveCohort(updated);
      return updated;
    });

    const target = cohort.find(p => p.id.toUpperCase() === newId.toUpperCase());
    if (target) {
      appendEvent({
        participantId: target.id,
        group: target.group,
        eventType: 'participant_login',
        details: { 
          name: target.name, 
          group: target.group,
          score: target.overallScore,
          learningJourneyProgress: target.learningJourneyProgress,
          oceanKnowledgeLevel: getOceanKnowledgeLevel(target.overallScore)
        }
      });
      setEvents(loadEvents());
    }
  };

  // Handler: Navigation
  const handleNavigate = (screen: ScreenView) => {
    if (screen === 'sources') {
      setIsSourcesOpen(true);
      recordEvent('screen_visited', { screen: 'sources_modal' });
      return;
    }

    recordEvent('screen_visited', { screen });
    setCurrentScreen(screen);
  };

  // Handler: Complete Activity Prompt Choice
  const handleCompleteActivity = (activity: ActivityOption) => {
    setCohort(prev => {
      const updated = prev.map(p => {
        if (p.id === currentParticipant.id) {
          const newScore = p.overallScore + activity.points;
          const newQuizzes = activity.type === 'quiz' ? p.quizzesAttempted + 1 : p.quizzesAttempted;
          const newCommunity = activity.type === 'community_action' ? p.communityActionsParticipated + 1 : p.communityActionsParticipated;
          
          // Topics completed & calculate learning journey progress
          // "For the score for the learning journey progress, it is not the pts from the learning topics,
          // it is the number of learning topics completed. e.g completion of one learning topic is 15 pts,
          // the learning journey progress should only plus 1 because its one learning topic."
          const currentTopicsCount = p.learningTopicsCompletedCount ?? p.learningJourneyProgress ?? 1;
          const newTopicsCount = activity.type === 'topic' ? currentTopicsCount + 1 : currentTopicsCount;
          const newProgressCount = newTopicsCount;

          const newTotalActivities = newTopicsCount + newQuizzes + newCommunity;

          return {
            ...p,
            overallScore: newScore,
            quizzesAttempted: newQuizzes,
            communityActionsParticipated: newCommunity,
            learningTopicsCompletedCount: newTopicsCount,
            learningJourneyProgress: newProgressCount,
            total_activities_completed: newTotalActivities,
            completedActivityIds: [...p.completedActivityIds, activity.id],
            lastActiveTimestamp: new Date().toISOString()
          };
        }
        return p;
      });

      saveCohort(updated);
      return updated;
    });

    recordEvent('activity_completed', {
      activityId: activity.id,
      category: activity.category,
      title: activity.title,
      pointsAwarded: activity.points
    });
  };

  // Handler: Exit For Today
  const handleExitToday = () => {
    setIsExitTodayOpen(true);
    recordEvent('exit_today', {
      score: currentParticipant.overallScore,
      learningJourneyProgress: currentParticipant.learningJourneyProgress
    });
  };

  // Handler: Reset Cohort
  const handleResetCohort = () => {
    const fresh = resetCohortToDefault();
    setCohort(fresh);
    recordEvent('cohort_reset', { resetTimestamp: new Date().toISOString() });
  };

  // Compute statistics between Group A and Group B
  const cohortStats = computeCohortComparisonStats(cohort);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      
      {/* Header */}
      <Header
        currentParticipant={currentParticipant}
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        onOpenSwitcher={() => setIsSwitcherOpen(true)}
        onOpenFacilitator={() => setIsFacilitatorOpen(true)}
      />

      {/* Main Screen View: Unified Dashboard */}
      <main className="flex-1 pb-16">
        <Dashboard
          participant={currentParticipant}
          cohort={cohort}
          onCompleteActivity={handleCompleteActivity}
          onExitToday={handleExitToday}
        />
      </main>

      {/* Participant Switcher Modal */}
      <ParticipantSwitcherModal
        isOpen={isSwitcherOpen}
        cohort={cohort}
        currentParticipantId={currentParticipant.id}
        onSelectParticipant={handleSelectParticipant}
        onClose={() => setIsSwitcherOpen(false)}
      />

      {/* Exit For Today Modal */}
      <ExitTodayModal
        isOpen={isExitTodayOpen}
        participant={currentParticipant}
        onClose={() => setIsExitTodayOpen(false)}
        onOpenSwitcher={() => setIsSwitcherOpen(true)}
      />

      {/* Facilitator Research Panel */}
      <FacilitatorPanel
        isOpen={isFacilitatorOpen}
        cohort={cohort}
        stats={cohortStats}
        events={events}
        currentParticipantId={currentParticipant.id}
        onClose={() => setIsFacilitatorOpen(false)}
        onSelectParticipant={handleSelectParticipant}
        onResetCohort={handleResetCohort}
      />

      {/* Academic Sources Modal */}
      <SourcesModal
        isOpen={isSourcesOpen}
        onClose={() => setIsSourcesOpen(false)}
      />

      {/* Academic Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-4 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-semibold text-slate-300">OceanX Education Explorer Score Prototype</span>
            <span className="mx-2 text-slate-600">•</span>
            <span>Master’s Programme in IT Digital Transformation</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>Student prototype — not an official OceanX service</span>
            <button
              onClick={() => setIsSourcesOpen(true)}
              className="text-teal-400 hover:underline"
            >
              Academic Sources
            </button>
            <button
              onClick={() => setIsFacilitatorOpen(true)}
              className="text-teal-400 hover:underline"
            >
              Facilitator Console
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
