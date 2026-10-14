/**
 * Type definitions for OceanX Explorer Score Prototype
 * Master's in IT Digital Transformation Experiment
 * Focus: Personal Progress vs Visible Leaderboard with 20-participant cohort simulation
 */

export type CohortGroup = 'A' | 'B'; // Group A: Personal progress only, Group B: Personal progress + Leaderboard

export type ScreenView = 'dashboard' | 'sources';

export type ActivityType = 'topic' | 'quiz' | 'community_action';

export interface ActivityOption {
  id: string;
  type: ActivityType;
  title: string;
  category: 'Learning Topic' | 'Knowledge Quiz' | 'Community Action';
  shortDescription: string;
  points: number; // e.g. 10 - 25 pts
  estimatedMinutes: string;
  badgeColor: string;
}

export interface ParticipantProfile {
  id: string; // e.g. P01 to P20
  name: string; // e.g. Kai, Maya
  group: CohortGroup; // A or B
  overallScore: number;
  learningJourneyProgress: number; // Number of learning topics completed (1, 2, 3, 4)
  learningTopicsCompletedCount: number; // Number of learning topics completed
  quizzesAttempted: number;
  communityActionsParticipated: number;
  total_activities_completed?: number; // Total activities completed
  completedActivityIds: string[];
  lastActiveTimestamp: string;
}

export interface GroupDemotivationEntry {
  rankInGroup: number;
  participantId: string;
  name: string;
  overallScore: number;
  learningTopicsCompleted: number;
  quizzesAttempted: number;
  communityActions: number;
  totalActivities: number;
  differencePercentFromMedian: number;
  isDemotivatedRisk: boolean; // true if difference >= 40%
}

export interface GroupDemotivationStats {
  medianTotalActivities: number;
  bottomThreeRanked: GroupDemotivationEntry[];
}

export interface CohortComparisonStats {
  groupA: {
    totalParticipants: number;
    avgScore: number;
    avgLearningJourneyProgress: number; // Avg topics completed
    avgQuizzes: number;
    avgCommunityActions: number;
    avgActivitiesCompleted: number;
    totalActivitiesCompleted: number; // Sum of all activities in Group A
  };
  groupB: {
    totalParticipants: number;
    avgScore: number;
    avgLearningJourneyProgress: number; // Avg topics completed
    avgQuizzes: number;
    avgCommunityActions: number;
    avgActivitiesCompleted: number;
    totalActivitiesCompleted: number; // Sum of all activities in Group B
    demotivation: GroupDemotivationStats;
  };
  comparison: {
    activityDifference: number; // Group B total minus Group A total
    groupBMorePercent: number; // How much more Group B has over Group A in percentage
  };
}

export interface ActivityEvent {
  id: string;
  timestamp: string; // ISO
  participantId: string;
  group: CohortGroup;
  eventType: 
    | 'participant_login'
    | 'screen_visited'
    | 'leaderboard_viewed'
    | 'activity_selected'
    | 'activity_completed'
    | 'exit_today'
    | 'cohort_reset';
  details: Record<string, any>;
}

export interface RankedCohortEntry {
  rank: number;
  participantId: string;
  name: string;
  group: CohortGroup;
  score: number;
  learningJourneyProgress: number; // Number of learning topics completed (1, 2, 3, 4)
  oceanKnowledgeLevel: string; // e.g. Sunlight Zone, Twilight Zone, Midnight Zone, Abyssal Zone
  learningTopicsCompletedCount: number;
  quizzesAttempted: number;
  communityActions: number;
  isCurrentParticipant: boolean;
  nudgeMessage?: string;
}
