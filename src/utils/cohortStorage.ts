/**
 * Storage and statistical computation for the 20-participant cohort prototype.
 */

import { ParticipantProfile, CohortComparisonStats, ActivityEvent } from '../types';
import { generateDefaultCohort, AVAILABLE_ACTIVITIES } from '../data/cohortData';

const COHORT_STORAGE_KEY = 'oceanx_simulated_cohort_v12';
const EVENTS_STORAGE_KEY = 'oceanx_cohort_events_v12';
const ACTIVE_PARTICIPANT_KEY = 'oceanx_active_participant_v12';

export function loadCohort(): ParticipantProfile[] {
  try {
    const raw = localStorage.getItem(COHORT_STORAGE_KEY);
    if (!raw) {
      const initial = generateDefaultCohort();
      saveCohort(initial);
      return initial;
    }
    const parsed = JSON.parse(raw) as ParticipantProfile[];
    // Ensure all required fields exist on loaded profiles
    return parsed.map(p => {
      const topics = p.learningTopicsCompletedCount ?? p.learningJourneyProgress ?? 1;
      return {
        ...p,
        learningJourneyProgress: topics,
        total_activities_completed: p.total_activities_completed ?? (topics + p.quizzesAttempted + p.communityActionsParticipated)
      };
    });
  } catch (err) {
    console.error('Failed to load cohort from localStorage:', err);
    return generateDefaultCohort();
  }
}

export function saveCohort(cohort: ParticipantProfile[]): void {
  try {
    localStorage.setItem(COHORT_STORAGE_KEY, JSON.stringify(cohort));
  } catch (err) {
    console.error('Failed to save cohort to localStorage:', err);
  }
}

export function resetCohortToDefault(): ParticipantProfile[] {
  const fresh = generateDefaultCohort();
  saveCohort(fresh);
  return fresh;
}

export function loadActiveParticipantId(): string {
  try {
    return localStorage.getItem(ACTIVE_PARTICIPANT_KEY) || 'P01';
  } catch {
    return 'P01';
  }
}

export function saveActiveParticipantId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_PARTICIPANT_KEY, id);
  } catch (err) {
    console.error('Failed to save active participant ID:', err);
  }
}

export function loadEvents(): ActivityEvent[] {
  try {
    const raw = localStorage.getItem(EVENTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function appendEvent(event: Omit<ActivityEvent, 'id' | 'timestamp'>): void {
  try {
    const existing = loadEvents();
    const newEvent: ActivityEvent = {
      ...event,
      id: `ev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString()
    };
    existing.push(newEvent);
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(existing));
  } catch (err) {
    console.error('Failed to log event:', err);
  }
}

export function clearEvents(): void {
  try {
    localStorage.removeItem(EVENTS_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear events:', err);
  }
}

/**
 * Calculates comparative research metrics between Group A and Group B
 */
export function computeCohortComparisonStats(cohort: ParticipantProfile[]): CohortComparisonStats {
  const groupA = cohort.filter(p => p.group === 'A');
  const groupB = cohort.filter(p => p.group === 'B');

  const calcGroupA = () => {
    const total = groupA.length || 1;
    const sumScore = groupA.reduce((acc, p) => acc + p.overallScore, 0);
    const sumProgress = groupA.reduce((acc, p) => acc + (p.learningJourneyProgress || 0), 0);
    const sumQuizzes = groupA.reduce((acc, p) => acc + p.quizzesAttempted, 0);
    const sumCommunity = groupA.reduce((acc, p) => acc + p.communityActionsParticipated, 0);
    const sumActivities = groupA.reduce((acc, p) => acc + ((p.learningTopicsCompletedCount || 1) + p.quizzesAttempted + p.communityActionsParticipated), 0);

    const avgActivities = Math.round((sumActivities / total) * 10) / 10;

    return {
      totalParticipants: groupA.length,
      avgScore: Math.round((sumScore / total) * 10) / 10,
      avgLearningJourneyProgress: Math.round((sumProgress / total) * 10) / 10,
      avgQuizzes: Math.round((sumQuizzes / total) * 10) / 10,
      avgCommunityActions: Math.round((sumCommunity / total) * 10) / 10,
      avgActivitiesCompleted: avgActivities,
      totalActivitiesCompleted: sumActivities
    };
  };

  const calcGroupB = () => {
    const total = groupB.length || 1;
    const sumScore = groupB.reduce((acc, p) => acc + p.overallScore, 0);
    const sumProgress = groupB.reduce((acc, p) => acc + (p.learningJourneyProgress || 0), 0);
    const sumQuizzes = groupB.reduce((acc, p) => acc + p.quizzesAttempted, 0);
    const sumCommunity = groupB.reduce((acc, p) => acc + p.communityActionsParticipated, 0);
    const sumActivities = groupB.reduce((acc, p) => acc + ((p.learningTopicsCompletedCount || 1) + p.quizzesAttempted + p.communityActionsParticipated), 0);

    const avgActivities = Math.round((sumActivities / total) * 10) / 10;

    // Group B de-motivation monitoring calculation:
    // Uses the data field total_activities_completed
    const groupBWithTotals = groupB.map(p => {
      const total_activities_completed = p.total_activities_completed ?? 
        ((p.learningTopicsCompletedCount ?? p.learningJourneyProgress ?? 1) + p.quizzesAttempted + p.communityActionsParticipated);
      return {
        ...p,
        total_activities_completed
      };
    });

    // 2. Median of Group B total_activities_completed
    const allTotals = groupBWithTotals.map(p => p.total_activities_completed).sort((a, b) => a - b);
    const mid = Math.floor(allTotals.length / 2);
    const medianTotalActivities = allTotals.length === 0
      ? 0
      : allTotals.length % 2 !== 0
        ? allTotals[mid]
        : Math.round(((allTotals[mid - 1] + allTotals[mid]) / 2) * 10) / 10;

    // 3. Last 3 ranked in Group B (ranks 8, 9, 10 within Group B by overallScore)
    const groupBRanked = [...groupBWithTotals].sort((a, b) => b.overallScore - a.overallScore);
    const bottomThreeRanked = groupBRanked.slice(-3).map((p, idx, arr) => {
      const rankInGroup = groupBRanked.length - arr.length + idx + 1; // 8, 9, 10
      const diffPercent = medianTotalActivities > 0
        ? Math.round((Math.abs(medianTotalActivities - p.total_activities_completed) / medianTotalActivities) * 1000) / 10
        : 0;
      return {
        rankInGroup,
        participantId: p.id,
        name: p.name,
        overallScore: p.overallScore,
        learningTopicsCompleted: p.learningTopicsCompletedCount ?? p.learningJourneyProgress ?? 1,
        quizzesAttempted: p.quizzesAttempted,
        communityActions: p.communityActionsParticipated,
        totalActivities: p.total_activities_completed,
        differencePercentFromMedian: diffPercent,
        isDemotivatedRisk: diffPercent >= 40
      };
    });

    return {
      totalParticipants: groupB.length,
      avgScore: Math.round((sumScore / total) * 10) / 10,
      avgLearningJourneyProgress: Math.round((sumProgress / total) * 10) / 10,
      avgQuizzes: Math.round((sumQuizzes / total) * 10) / 10,
      avgCommunityActions: Math.round((sumCommunity / total) * 10) / 10,
      avgActivitiesCompleted: avgActivities,
      totalActivitiesCompleted: sumActivities,
      demotivation: {
        medianTotalActivities,
        bottomThreeRanked
      }
    };
  };

  const statsA = calcGroupA();
  const statsB = calcGroupB();

  const activityDifference = statsB.totalActivitiesCompleted - statsA.totalActivitiesCompleted;
  const groupBMorePercent = statsA.totalActivitiesCompleted > 0
    ? Math.round(((statsB.totalActivitiesCompleted - statsA.totalActivitiesCompleted) / statsA.totalActivitiesCompleted) * 1000) / 10
    : 0;

  return {
    groupA: statsA,
    groupB: statsB,
    comparison: {
      activityDifference,
      groupBMorePercent
    }
  };
}
