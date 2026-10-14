/**
 * CSV and JSON Export Utilities for the 20-Participant Cohort
 */

import { ParticipantProfile, CohortComparisonStats, ActivityEvent } from '../types';
import { getOceanKnowledgeLevel } from '../data/cohortData';

function escapeCSV(val: any): string {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

export function generateCohortSummaryCSV(
  cohort: ParticipantProfile[], 
  stats: CohortComparisonStats
): string {
  const headers = [
    'participant_id',
    'participant_name',
    'experimental_group',
    'overall_score',
    'ocean_knowledge_level',
    'learning_topics_completed_count',
    'quizzes_attempted_count',
    'community_actions_participated_count',
    'total_activities_completed',
    'last_active_timestamp'
  ];

  const rows = cohort.map(p => {
    const topicsCount = p.learningTopicsCompletedCount || p.learningJourneyProgress || 1;
    const totalActivities = topicsCount + p.quizzesAttempted + p.communityActionsParticipated;
    return [
      escapeCSV(p.id),
      escapeCSV(p.name),
      escapeCSV(p.group === 'A' ? 'Group A (Personal Progress Only)' : 'Group B (Leaderboard + Personal Progress)'),
      escapeCSV(p.overallScore),
      escapeCSV(getOceanKnowledgeLevel(p.overallScore)),
      escapeCSV(topicsCount),
      escapeCSV(p.quizzesAttempted),
      escapeCSV(p.communityActionsParticipated),
      escapeCSV(totalActivities),
      escapeCSV(p.lastActiveTimestamp)
    ].join(',');
  });

  // Append summary stats footer
  const statsRows = [
    '',
    '--- RESEARCH COMPARISON SUMMARY ---',
    `Group A Total Activities Completed:,"${stats.groupA.totalActivitiesCompleted}"`,
    `Group A Average Activities Completed:,"${stats.groupA.avgActivitiesCompleted}"`,
    `Group A Average Score:,"${stats.groupA.avgScore} pts"`,
    `Group B Total Activities Completed:,"${stats.groupB.totalActivitiesCompleted}"`,
    `Group B Average Activities Completed:,"${stats.groupB.avgActivitiesCompleted}"`,
    `Group B Average Score:,"${stats.groupB.avgScore} pts"`,
    `Group B More Activities Than Group A:,"${stats.comparison.groupBMorePercent}% (+${stats.comparison.activityDifference} activities)"`,
    `Group B Median Total Activities:,"${stats.groupB.demotivation.medianTotalActivities}"`,
    ...stats.groupB.demotivation.bottomThreeRanked.map(b => 
      `Group B Rank #${b.rankInGroup} (${b.name}):,"${b.totalActivities} activities, ${b.differencePercentFromMedian}% diff from median (${b.isDemotivatedRisk ? 'DEMOTIVATION ALERT ≥40%' : 'HEALTHY <40%'})"`
    )
  ];

  return [headers.join(','), ...rows, ...statsRows].join('\r\n');
}

export function generateEventsCSV(events: ActivityEvent[]): string {
  const headers = [
    'event_id',
    'timestamp_iso',
    'participant_id',
    'group',
    'event_type',
    'details_json'
  ];

  const rows = events.map(ev => [
    escapeCSV(ev.id),
    escapeCSV(ev.timestamp),
    escapeCSV(ev.participantId),
    escapeCSV(ev.group),
    escapeCSV(ev.eventType),
    escapeCSV(JSON.stringify(ev.details || {}))
  ].join(','));

  return [headers.join(','), ...rows].join('\r\n');
}

export function downloadExportFile(content: string, filename: string, mimeType: string = 'text/csv;charset=utf-8;'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
