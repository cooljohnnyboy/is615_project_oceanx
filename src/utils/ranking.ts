/**
 * Standard Competition Ranking & Encouraging Nudges Generator
 * Used for Group B Leaderboard in the OceanX Explorer Score Prototype.
 */

import { ParticipantProfile, RankedCohortEntry } from '../types';
import { getOceanKnowledgeLevel } from '../data/cohortData';

export function computeCohortLeaderboard(
  cohort: ParticipantProfile[], 
  currentParticipantId: string
): RankedCohortEntry[] {
  // Only include Group B participants in the leaderboard
  const groupBCohort = cohort.filter(p => p.group === 'B');

  // Sort descending by overallScore
  const sorted = [...groupBCohort].sort((a, b) => {
    if (b.overallScore !== a.overallScore) {
      return b.overallScore - a.overallScore;
    }
    // If scores tie, prioritize current participant or tiebreak by learningJourneyProgress
    if (a.id === currentParticipantId) return -1;
    if (b.id === currentParticipantId) return 1;
    return (b.learningJourneyProgress || 0) - (a.learningJourneyProgress || 0);
  });

  // Assign standard competition ranks (1224 rule)
  const ranked: RankedCohortEntry[] = [];
  let currentRank = 1;

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0) {
      if (sorted[i].overallScore < sorted[i - 1].overallScore) {
        currentRank = i + 1;
      }
    } else {
      currentRank = 1;
    }

    const isCurrent = sorted[i].id.toUpperCase() === currentParticipantId.toUpperCase();

    ranked.push({
      rank: currentRank,
      participantId: sorted[i].id,
      name: sorted[i].name,
      group: sorted[i].group,
      score: sorted[i].overallScore,
      learningJourneyProgress: sorted[i].learningJourneyProgress,
      oceanKnowledgeLevel: getOceanKnowledgeLevel(sorted[i].overallScore),
      learningTopicsCompletedCount: sorted[i].learningTopicsCompletedCount,
      quizzesAttempted: sorted[i].quizzesAttempted,
      communityActions: sorted[i].communityActionsParticipated,
      isCurrentParticipant: isCurrent
    });
  }

  // Generate personalized encouraging nudge for the current participant
  const currentIndex = ranked.findIndex(r => r.isCurrentParticipant);
  if (currentIndex >= 0) {
    const current = ranked[currentIndex];
    let nudge = '';

    if (current.rank === 1) {
      nudge = '🌟 Leading Group B! Keep setting the pace by exploring advanced ocean topics or completing another community action.';
    } else {
      // Find the participant ahead
      const personAhead = ranked[currentIndex - 1];
      const gap = personAhead ? (personAhead.score - current.score) : 10;

      if (gap <= 25) {
        nudge = `🎯 You are only ${gap === 0 ? 'tied with' : `${gap} points behind`} Rank #${personAhead.rank}! Logging one Community Action (+25 pts) could leap you ahead.`;
      } else if (current.communityActions < 2) {
        nudge = `💡 Explorers in the top 5 of Group B have logged at least 2 Community Actions. Try the Single-Use Plastics Audit or Cleanup Log to accelerate your score!`;
      } else if (current.learningTopicsCompletedCount < 4) {
        nudge = `🚀 Your Learning Journey Progress is at ${current.oceanKnowledgeLevel} (${current.learningJourneyProgress}/4 topics). Exploring one more ocean topic will advance you to the next ocean level!`;
      } else {
        nudge = `👏 Great momentum! You are currently Rank #${current.rank} among ${ranked.length} Group B explorers. Pick an activity below to keep rising.`;
      }
    }

    ranked[currentIndex].nudgeMessage = nudge;
  }

  return ranked;
}
