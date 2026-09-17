import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react';
import { BOUTS, FIGHTERS, JUDGES, LEAGUES, PAST_LEAGUES, REFEREES } from './data';
import {
  emptyRound,
  type Bout,
  type CategoryKey,
  type FinishMethod,
  type Fighter,
  type Judge,
  type League,
  type Referee,
  type Sheet,
} from './types';

/**
 * All mutable state lives here. Components only read through `useStore()`, so
 * connecting the API means posting each action and applying server broadcasts
 * as the same actions.
 */

export interface State {
  leagues: League[];
  pastLeagues: League[];
  bouts: Bout[];
  judges: Judge[];
  referees: Referee[];
  fighters: Fighter[];
  sheets: Sheet[];
  user: string;
  toast: string | null;
  seq: number;
}

export type Action =
  | { type: 'tick' }
  | { type: 'league/create'; league: Omit<League, 'id'> }
  | { type: 'league/update'; league: League }
  | { type: 'league/delete'; id: string }
  | { type: 'bout/update'; bout: Bout }
  | { type: 'bout/create'; bout: Omit<Bout, 'id'> }
  | { type: 'judge/save'; judge: Judge }
  | { type: 'judge/delete'; id: string }
  | { type: 'sheet/ensure'; boutId: string; judgeId: string; totalRounds: number }
  | { type: 'sheet/meta'; boutId: string; judgeId: string; patch: Partial<Sheet> }
  | {
      type: 'sheet/cell';
      boutId: string;
      judgeId: string;
      round: number;
      corner: 'blue' | 'red';
      category: CategoryKey;
      patch: Partial<{ points: number; count: number; note: string }>;
    }
  | {
      type: 'sheet/finalScore';
      boutId: string;
      judgeId: string;
      round: number;
      corner: 'blue' | 'red';
      value: number | null;
    }
  | { type: 'sheet/lock'; boutId: string; judgeId: string; round: number }
  | { type: 'sheet/finish'; boutId: string; judgeId: string; finish: FinishMethod | null }
  | { type: 'clock/start'; boutId: string; judgeId: string }
  | { type: 'clock/stop'; boutId: string; judgeId: string }
  | { type: 'clock/set'; boutId: string; judgeId: string; seconds: number }
  | { type: 'toast/clear' };

export const initialState: State = {
  leagues: LEAGUES,
  pastLeagues: PAST_LEAGUES,
  bouts: BOUTS,
  judges: JUDGES,
  referees: REFEREES,
  fighters: FIGHTERS,
  sheets: [],
  user: 'Admin',
  toast: null,
  seq: 0,
};

let idSeq = 100;
const nextId = (prefix: string) => `${prefix}${(idSeq += 1)}`;

function mapSheet(state: State, boutId: string, judgeId: string, fn: (s: Sheet) => Sheet): Sheet[] {
  return state.sheets.map((s) => (s.boutId === boutId && s.judgeId === judgeId ? fn(s) : s));
}

function mapRound(sheet: Sheet, round: number, fn: (r: Sheet['rounds'][number]) => Sheet['rounds'][number]): Sheet {
  return { ...sheet, rounds: sheet.rounds.map((r) => (r.round === round ? fn(r) : r)) };
}

export function reducer(state: State, action: Action): State {
  const next = reduce(state, action);
  if (next === state) return state;
  return action.type === 'tick' ? next : { ...next, seq: state.seq + 1 };
}

function reduce(state: State, action: Action): State {
  switch (action.type) {
    case 'tick':
      return {
        ...state,
        sheets: state.sheets.map((s) => (s.running ? { ...s, elapsed: s.elapsed + 1 } : s)),
      };

    case 'league/create':
      return {
        ...state,
        leagues: [...state.leagues, { ...action.league, id: nextId('l') }],
        toast: 'League saved.',
      };

    case 'league/update':
      return {
        ...state,
        leagues: state.leagues.map((l) => (l.id === action.league.id ? action.league : l)),
        toast: 'League updated.',
      };

    case 'league/delete':
      return {
        ...state,
        leagues: state.leagues.filter((l) => l.id !== action.id),
        bouts: state.bouts.filter((b) => b.leagueId !== action.id),
        toast: 'League deleted.',
      };

    case 'bout/update':
      return {
        ...state,
        bouts: state.bouts.map((b) => (b.id === action.bout.id ? action.bout : b)),
        toast: 'Bout updated.',
      };

    case 'bout/create':
      return {
        ...state,
        bouts: [...state.bouts, { ...action.bout, id: nextId('b') }],
        toast: 'Bout added.',
      };

    case 'judge/save': {
      const exists = state.judges.some((j) => j.id === action.judge.id);
      return {
        ...state,
        judges: exists
          ? state.judges.map((j) => (j.id === action.judge.id ? action.judge : j))
          : [...state.judges, { ...action.judge, id: nextId('j') }],
        toast: exists ? 'Judge updated.' : 'Judge added.',
      };
    }

    case 'judge/delete':
      return { ...state, judges: state.judges.filter((j) => j.id !== action.id), toast: 'Judge removed.' };

    case 'sheet/ensure': {
      if (state.sheets.some((s) => s.boutId === action.boutId && s.judgeId === action.judgeId)) {
        return state;
      }
      const bout = state.bouts.find((b) => b.id === action.boutId);
      const sheet: Sheet = {
        boutId: action.boutId,
        judgeId: action.judgeId,
        refereeName: state.referees.find((r) => r.id === bout?.refereeId)?.name ?? '',
        judgeNo: '',
        finish: null,
        rounds: Array.from({ length: action.totalRounds }, (_, i) => emptyRound(i + 1)),
        elapsed: 0,
        running: false,
      };
      return { ...state, sheets: [...state.sheets, sheet] };
    }

    case 'sheet/meta':
      return {
        ...state,
        sheets: mapSheet(state, action.boutId, action.judgeId, (s) => ({ ...s, ...action.patch })),
        toast: null,
      };

    case 'sheet/cell':
      return {
        ...state,
        sheets: mapSheet(state, action.boutId, action.judgeId, (s) =>
          mapRound(s, action.round, (r) => ({
            ...r,
            [action.corner]: {
              ...r[action.corner],
              [action.category]: { ...r[action.corner][action.category], ...action.patch },
            },
          })),
        ),
        toast: null,
      };

    case 'sheet/finalScore':
      return {
        ...state,
        sheets: mapSheet(state, action.boutId, action.judgeId, (s) =>
          mapRound(s, action.round, (r) => ({
            ...r,
            [action.corner === 'blue' ? 'blueScore' : 'redScore']: action.value,
          })),
        ),
        toast: null,
      };

    case 'sheet/lock':
      return {
        ...state,
        sheets: mapSheet(state, action.boutId, action.judgeId, (s) =>
          mapRound(s, action.round, (r) => ({ ...r, locked: true })),
        ),
        toast: `Round ${action.round} submitted.`,
      };

    case 'sheet/finish':
      return {
        ...state,
        sheets: mapSheet(state, action.boutId, action.judgeId, (s) => ({ ...s, finish: action.finish })),
        toast: action.finish ? `Finish recorded: ${action.finish}.` : 'Finish cleared.',
      };

    case 'clock/start':
      return {
        ...state,
        sheets: mapSheet(state, action.boutId, action.judgeId, (s) => ({ ...s, running: true })),
        toast: null,
      };

    case 'clock/stop':
      return {
        ...state,
        sheets: mapSheet(state, action.boutId, action.judgeId, (s) => ({ ...s, running: false })),
        toast: null,
      };

    case 'clock/set':
      return {
        ...state,
        sheets: mapSheet(state, action.boutId, action.judgeId, (s) => ({
          ...s,
          elapsed: Math.max(0, action.seconds),
        })),
        toast: 'Time set manually.',
      };

    case 'toast/clear':
      return { ...state, toast: null };

    default:
      return state;
  }
}

interface StoreValue {
  state: State;
  dispatch: Dispatch<Action>;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const id = window.setInterval(() => dispatch({ type: 'tick' }), 1000);
    return () => window.clearInterval(id);
  }, []);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
}
