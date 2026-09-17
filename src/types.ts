/** ScoreSync domain model. Shapes match what the scoring API is expected to return. */

export type BoutType = 'Professional' | 'Amateur';
export type Discipline = 'MMA' | 'BJJ' | 'K1';

export const FINISH_METHODS = [
  'Head Ko',
  'Ko Body',
  'TKO',
  'No Contest',
  'RNC',
  'Submission',
  'DQ',
] as const;
export type FinishMethod = (typeof FINISH_METHODS)[number];

export const CATEGORIES = [
  { key: 'standup', label: 'Strikes & Kicks\nStand Up Fight', short: 'Strikes & Kicks' },
  { key: 'takedowns', label: 'Takedowns', short: 'Takedowns' },
  { key: 'ground', label: 'Strikes on Ground', short: 'Strikes on Ground' },
  { key: 'grappling', label: 'Grappling & Submissions', short: 'Grappling & Submissions' },
] as const;
export type CategoryKey = (typeof CATEGORIES)[number]['key'];

export interface Judge {
  id: string;
  name: string;
  contact: string;
  bloodGroup: string;
}

export interface Referee {
  id: string;
  name: string;
}

export interface Fighter {
  id: string;
  name: string;
  record: string;
  gym: string;
  country: string;
}

export interface LeagueCounts {
  amateurMMA: number;
  proMMA: number;
  amateurBJJ: number;
  proBJJ: number;
  amateurK1: number;
}

export interface League {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  promoter: string;
  logoName: string | null;
  counts: LeagueCounts;
}

export interface Bout {
  id: string;
  leagueId: string;
  type: BoutType;
  discipline: Discipline;
  date: string;
  number: number;
  name: string;
  totalRounds: number;
  roundMinutes: number;
  ringNo: string;
  blueFighterId: string;
  redFighterId: string;
  judgeIds: string[];
  refereeId: string;
  status: 'Scheduled' | 'Live' | 'Completed';
}

/** One category line on a judge's card: points per action × number of actions. */
export interface CategoryScore {
  points: number;
  count: number;
  note: string;
}

export type CornerSheet = Record<CategoryKey, CategoryScore>;

export interface RoundSheet {
  round: number;
  blue: CornerSheet;
  red: CornerSheet;
  blueScore: number | null;
  redScore: number | null;
  locked: boolean;
}

export interface Sheet {
  boutId: string;
  judgeId: string;
  refereeName: string;
  judgeNo: string;
  finish: FinishMethod | null;
  rounds: RoundSheet[];
  elapsed: number;
  running: boolean;
}

export function emptyCorner(): CornerSheet {
  return {
    standup: { points: 1, count: 0, note: '' },
    takedowns: { points: 1, count: 0, note: '' },
    ground: { points: 1, count: 0, note: '' },
    grappling: { points: 1, count: 0, note: '' },
  };
}

export function emptyRound(round: number): RoundSheet {
  return {
    round,
    blue: emptyCorner(),
    red: emptyCorner(),
    blueScore: null,
    redScore: null,
    locked: false,
  };
}

export function cornerTotal(corner: CornerSheet): number {
  return CATEGORIES.reduce((sum, c) => sum + corner[c.key].points * corner[c.key].count, 0);
}
