/**
 * Cohort Simulation Data & Activity Catalog
 * 20 participants: P01 - P10 (Group A), P11 - P20 (Group B)
 */

import { ActivityOption, ParticipantProfile } from '../types';

export const AVAILABLE_ACTIVITIES: ActivityOption[] = [
  // Community Actions (High-impact participation: 15 - 20 pts)
  {
    id: 'act-ca-01',
    type: 'community_action',
    category: 'Community Action',
    title: 'Log a Coastal or Waterway Cleanup Action',
    shortDescription: 'Record items collected during a local shoreline, riverbank, or community trash cleanup.',
    points: 20,
    estimatedMinutes: '8 mins',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
  },
  {
    id: 'act-ca-02',
    type: 'community_action',
    category: 'Community Action',
    title: 'Household Single-Use Plastics Audit',
    shortDescription: 'Inspect your weekly plastic footprint and commit to three packaging reduction swaps.',
    points: 18,
    estimatedMinutes: '6 mins',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
  },
  {
    id: 'act-ca-03',
    type: 'community_action',
    category: 'Community Action',
    title: 'Citizen Science: Marine Species Observation',
    shortDescription: 'Upload a local waterway biodiversity spotting to the community observation ledger.',
    points: 20,
    estimatedMinutes: '7 mins',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
  },
  {
    id: 'act-ca-04',
    type: 'community_action',
    category: 'Community Action',
    title: 'Sustainable Seafood Pledge Commitment',
    shortDescription: 'Review regional sustainable fishing guidelines and adopt ocean-friendly dining choices.',
    points: 15,
    estimatedMinutes: '5 mins',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
  },

  // Learning Topics
  {
    id: 'act-top-01',
    type: 'topic',
    category: 'Learning Topic',
    title: 'Mariana Trench: Life in the Hadal Abyss',
    shortDescription: 'Discover snailfish, amphipods, and piezophile microbial adaptations past 10,000 meters.',
    points: 15,
    estimatedMinutes: '4 mins',
    badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-300'
  },
  {
    id: 'act-top-02',
    type: 'topic',
    category: 'Learning Topic',
    title: 'Mangrove Roots: Coastal Nursery Dynamics',
    shortDescription: 'Explore how tangled prop roots protect juvenile lemon sharks, reef fish, and coastlines.',
    points: 15,
    estimatedMinutes: '5 mins',
    badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-300'
  },
  {
    id: 'act-top-03',
    type: 'topic',
    category: 'Learning Topic',
    title: 'Hydrothermal Vents & Chemosynthesis',
    shortDescription: 'Examine black smokers that fuel teeming ecosystems using dissolved minerals without sunlight.',
    points: 15,
    estimatedMinutes: '4 mins',
    badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-300'
  },
  {
    id: 'act-top-04',
    type: 'topic',
    category: 'Learning Topic',
    title: 'Acoustic Tagging of Pelagic Predators',
    shortDescription: 'Trace oceanic migratory corridors of great white sharks and yellowfin tuna with satellite receivers.',
    points: 15,
    estimatedMinutes: '3 mins',
    badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-300'
  },

  // Knowledge Quizzes
  {
    id: 'act-qz-01',
    type: 'quiz',
    category: 'Knowledge Quiz',
    title: 'Ocean Acidification Knowledge Challenge',
    shortDescription: 'Test your understanding of carbonic acid formation and pteropod calcium carbonate shell thinning.',
    points: 10,
    estimatedMinutes: '3 mins',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300'
  },
  {
    id: 'act-qz-02',
    type: 'quiz',
    category: 'Knowledge Quiz',
    title: 'Coral Symbiosis & Thermal Tolerance Quiz',
    shortDescription: 'Explore zooxanthellae clade shifts and thermal resilience mechanisms in reef corals.',
    points: 10,
    estimatedMinutes: '3 mins',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300'
  },
  {
    id: 'act-qz-03',
    type: 'quiz',
    category: 'Knowledge Quiz',
    title: 'Blue Carbon Sediment Sequestration Quiz',
    shortDescription: 'Assess how tidal marshes and seagrass beds bury carbon at rates exceeding terrestrial forests.',
    points: 10,
    estimatedMinutes: '3 mins',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300'
  }
];

// Names for the 20 cohort members
const COHORT_NAMES: { [id: string]: string } = {
  P01: 'Kai',
  P02: 'Morgan',
  P03: 'Alex',
  P04: 'Taylor',
  P05: 'Jordan',
  P06: 'Casey',
  P07: 'Riley',
  P08: 'Sam',
  P09: 'Avery',
  P10: 'Quinn',
  P11: 'Maya',
  P12: 'Liam',
  P13: 'Noah',
  P14: 'Emma',
  P15: 'Lucas',
  P16: 'Olivia',
  P17: 'Ethan',
  P18: 'Sophia',
  P19: 'Leo',
  P20: 'Chloe'
};

export interface ExplorerLevel {
  level: number;
  name: string;
  shortName: string;
  depth: string;
  minPoints: number;
}

export const EXPLORER_LEVELS: ExplorerLevel[] = [
  { level: 0, name: 'Surface Zone', shortName: 'Surface', depth: '0m (Surface)', minPoints: 0 },
  { level: 1, name: 'Sunlight Zone', shortName: 'Sunlight', depth: '0 - 200m', minPoints: 150 },
  { level: 2, name: 'Twilight Zone', shortName: 'Twilight', depth: '200 - 1,000m', minPoints: 250 },
  { level: 3, name: 'Midnight Zone', shortName: 'Midnight', depth: '1,000 - 4,000m', minPoints: 400 },
  { level: 4, name: 'Abyssal Zone', shortName: 'Abyssal', depth: '4,000m+', minPoints: 600 }
];

export const OCEAN_KNOWLEDGE_LEVELS = EXPLORER_LEVELS;

/**
 * Returns the Explorer Level based on the participant's Explorer Score points
 * Level 0: Surface Zone (0 points)
 * Level 1: Sunlight Zone (150 points)
 * Level 2: Twilight Zone (250 points)
 * Level 3: Midnight Zone (400 points)
 * Level 4: Abyssal Zone (600 points)
 */
export function getExplorerLevel(score: number): ExplorerLevel {
  if (score >= 600) return EXPLORER_LEVELS[4];
  if (score >= 400) return EXPLORER_LEVELS[3];
  if (score >= 250) return EXPLORER_LEVELS[2];
  if (score >= 150) return EXPLORER_LEVELS[1];
  return EXPLORER_LEVELS[0];
}

/**
 * Backwards-compatible helper returning the level zone name
 */
export function getOceanKnowledgeLevel(score: number): string {
  return getExplorerLevel(score).name;
}

/**
 * Calculate the Learning Journey Progress
 * As specified: It is strictly the count of learning topics completed (e.g. 1, 2, 3, 4)
 * (Completion of one learning topic awards 15 pts to overall score, but learning journey progress only plus 1)
 */
export function calculateLearningJourneyStage(topicsCount: number): number {
  return Math.max(0, topicsCount);
}

// Activity points specification:
// Learning topic: strictly 15 pts each
// Knowledge quiz: strictly 10 pts each
// Community action: ranges from 15 to 20 pts each (e.g. 20, 18, 15)
export const POINTS_PER_LEARNING_TOPIC = 15;
export const POINTS_PER_QUIZ = 10;

interface ParticipantActivitiesConfig {
  topics: number;
  quizzes: number;
  community: number;
  communityActionScores: number[]; // Each in range 15-20 pts
}

// Fixed dataset configurations:
// - Group B average activities (12.0) is exactly 20% more than Group A average activities (10.0)
// - Group B de-motivation monitoring: median is 12.0 activities; among the last 3 ranked (Ranks 8, 9, 10),
//   only one (Rank 8 at 33.3% diff) remains resilient (<40%), while Rank 9 (41.7%) and Rank 10 (58.3%) are de-motivated.
// - Realistic points: Topics = 15 pts, Quizzes = 10 pts, Community = 15-20 pts
// - Overall score matches exact sum of activity points

// 10 Group A (Control: Personal Progress only) configurations (Total activities = 100, Avg = 10.0)
const GROUP_A_CONFIGS: { [id: string]: ParticipantActivitiesConfig } = {
  P01: { topics: 8, quizzes: 5, community: 2, communityActionScores: [20, 18] },       // 120 + 50 + 38 = 208 pts (15 activities)
  P02: { topics: 8, quizzes: 4, community: 2, communityActionScores: [18, 16] },        // 120 + 40 + 34 = 194 pts (14 activities)
  P03: { topics: 7, quizzes: 4, community: 2, communityActionScores: [18, 15] },        // 105 + 40 + 33 = 178 pts (13 activities)
  P04: { topics: 6, quizzes: 4, community: 2, communityActionScores: [16, 15] },        // 90 + 40 + 31 = 161 pts (12 activities)
  P05: { topics: 5, quizzes: 4, community: 2, communityActionScores: [15, 15] },        // 75 + 40 + 30 = 145 pts (11 activities)
  P06: { topics: 5, quizzes: 3, community: 2, communityActionScores: [15, 15] },        // 75 + 30 + 30 = 135 pts (10 activities)
  P07: { topics: 4, quizzes: 3, community: 1, communityActionScores: [18] },            // 60 + 30 + 18 = 108 pts (8 activities)
  P08: { topics: 3, quizzes: 3, community: 1, communityActionScores: [16] },            // 45 + 30 + 16 = 91 pts (7 activities)
  P09: { topics: 3, quizzes: 2, community: 1, communityActionScores: [15] },            // 45 + 20 + 15 = 80 pts (6 activities)
  P10: { topics: 2, quizzes: 1, community: 1, communityActionScores: [15] }             // 30 + 10 + 15 = 55 pts (4 activities)
};

// 10 Group B (Treatment: Leaderboard + Personal Progress) configurations (Total activities = 120, Avg = 12.0 -> +20.0% more than Group A)
const GROUP_B_CONFIGS: { [id: string]: ParticipantActivitiesConfig } = {
  P11: { topics: 10, quizzes: 6, community: 2, communityActionScores: [20, 20] },      // 150 + 60 + 40 = 250 pts (18 activities)
  P12: { topics: 9, quizzes: 5, community: 2, communityActionScores: [20, 18] },       // 135 + 50 + 38 = 223 pts (16 activities)
  P13: { topics: 9, quizzes: 5, community: 2, communityActionScores: [18, 16] },       // 135 + 50 + 34 = 219 pts (16 activities)
  P14: { topics: 8, quizzes: 4, community: 2, communityActionScores: [18, 16] },       // 120 + 40 + 34 = 194 pts (14 activities)
  P15: { topics: 7, quizzes: 3, community: 2, communityActionScores: [16, 15] },       // 105 + 30 + 31 = 166 pts (12 activities)
  P16: { topics: 6, quizzes: 4, community: 2, communityActionScores: [15, 15] },       // 90 + 40 + 30 = 160 pts (12 activities)
  P17: { topics: 5, quizzes: 5, community: 2, communityActionScores: [15, 15] },       // 75 + 50 + 30 = 155 pts (12 activities)
  P18: { topics: 4, quizzes: 3, community: 1, communityActionScores: [18] },           // 60 + 30 + 18 = 108 pts (8 activities, 33.3% diff -> Resilient)
  P19: { topics: 3, quizzes: 3, community: 1, communityActionScores: [16] },           // 45 + 30 + 16 = 91 pts (7 activities, 41.7% diff -> De-motivated)
  P20: { topics: 2, quizzes: 2, community: 1, communityActionScores: [15] }            // 30 + 20 + 15 = 65 pts (5 activities, 58.3% diff -> De-motivated)
};

/**
 * Generates a realistic simulated cohort of 20 participants:
 * Group A: P01 - P10 (Personal Progress Only)
 * Group B: P11 - P20 (Personal Progress + Leaderboard)
 * 
 * Rules:
 * - Each learning topic: strictly 15 pts
 * - Each quiz: strictly 10 pts
 * - Community actions: range 15 - 20 pts
 * - Overall explorer score strictly equals the sum of points earned across all activities.
 */
export function generateRandomCohort(): ParticipantProfile[] {
  const ids = Array.from({ length: 20 }, (_, i) => {
    const num = i + 1;
    return `P${num < 10 ? '0' : ''}${num}`;
  });

  return ids.map((id, index) => {
    const num = index + 1;
    const group: 'A' | 'B' = num <= 10 ? 'A' : 'B';
    const name = COHORT_NAMES[id] || `Explorer ${id}`;

    const config = group === 'A' ? GROUP_A_CONFIGS[id] : GROUP_B_CONFIGS[id];
    const topics = config?.topics ?? 10;
    const quizzes = config?.quizzes ?? 6;
    const community = config?.community ?? 3;
    const communityScores = config?.communityActionScores ?? [20, 18, 15];

    // Compute exact score:
    // Topics: 15 pts each
    // Quizzes: 10 pts each
    // Community actions: sum of action scores (15 - 20 pts each)
    const topicsPoints = topics * POINTS_PER_LEARNING_TOPIC;
    const quizzesPoints = quizzes * POINTS_PER_QUIZ;
    const communityPoints = communityScores.reduce((sum, val) => sum + val, 0);

    const overallScore = topicsPoints + quizzesPoints + communityPoints;

    // Learning journey progress strictly represents count of topics completed
    const progressCount = topics;

    // Completed catalog activities subset
    const topicIds = ['act-top-01', 'act-top-02', 'act-top-03', 'act-top-04'].slice(0, Math.min(4, topics));
    const quizIds = ['act-qz-01', 'act-qz-02', 'act-qz-03'].slice(0, Math.min(3, quizzes));
    const commIds = ['act-ca-01', 'act-ca-02', 'act-ca-03', 'act-ca-04'].slice(0, Math.min(4, community));
    const completedActivityIds = [...topicIds, ...quizIds, ...commIds];

    return {
      id,
      name,
      group,
      overallScore,
      learningJourneyProgress: progressCount, // Strictly count of topics completed
      learningTopicsCompletedCount: topics,
      quizzesAttempted: quizzes,
      communityActionsParticipated: community,
      total_activities_completed: topics + quizzes + community,
      completedActivityIds,
      lastActiveTimestamp: new Date().toISOString()
    };
  });
}

export function generateDefaultCohort(): ParticipantProfile[] {
  return generateRandomCohort();
}
