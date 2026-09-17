import type { Bout, Fighter, Judge, League, Referee } from './types';

/** First-version fixture. Swap these loaders for API calls. */

export const JUDGES: Judge[] = [
  { id: 'j1', name: 'Sushil Chandanshive', contact: '1287328328', bloodGroup: 'B+ve' },
  { id: 'j2', name: 'Ashutosh Malgaonkar', contact: '2837298371', bloodGroup: 'B+ve' },
  { id: 'j3', name: 'Poonam', contact: '2487264873', bloodGroup: 'B-ve' },
  { id: 'j4', name: 'Ayush', contact: '0123456789', bloodGroup: 'B+' },
  { id: 'j5', name: 'Sandeep', contact: '2342334543', bloodGroup: 'B+ve' },
  { id: 'j6', name: 'Sushil', contact: '2836328462', bloodGroup: 'b-ve' },
];

export const REFEREES: Referee[] = [
  { id: 'r1', name: 'Deepak' },
  { id: 'r2', name: 'Farhan' },
  { id: 'r3', name: 'Nikhil' },
];

export const FIGHTERS: Fighter[] = [
  { id: 'f1', name: 'Arjun Rane', record: '8-2-0', gym: 'Mumbai Fight Club', country: 'IN' },
  { id: 'f2', name: 'Kabir Shaikh', record: '11-3-0', gym: 'Pune Combat Academy', country: 'IN' },
  { id: 'f3', name: 'Rohit Tamang', record: '6-1-0', gym: 'Darjeeling Warriors', country: 'IN' },
  { id: 'f4', name: 'Imran Qureshi', record: '9-4-1', gym: 'Hyderabad Top Team', country: 'IN' },
  { id: 'f5', name: 'Neha Salunkhe', record: '5-0-0', gym: 'Nerul MMA', country: 'IN' },
  { id: 'f6', name: 'Priya Naik', record: '4-2-0', gym: 'Goa Grapple House', country: 'IN' },
];

export const LEAGUES: League[] = [
  {
    id: 'l1',
    name: 'Sandeep Leagues',
    date: '21/04/24',
    time: '9:00 pm',
    location: 'Noida',
    promoter: 'Sandeep Rawat',
    logoName: null,
    counts: { amateurMMA: 4, proMMA: 2, amateurBJJ: 1, proBJJ: 0, amateurK1: 2 },
  },
  {
    id: 'l2',
    name: 'WDS 8',
    date: '22/04/24',
    time: '11:30 pm',
    location: 'Nerul, Navi Mumbai',
    promoter: 'WDS Promotions',
    logoName: 'wds-8-logo.png',
    counts: { amateurMMA: 3, proMMA: 3, amateurBJJ: 2, proBJJ: 1, amateurK1: 0 },
  },
];

export const PAST_LEAGUES: League[] = [
  {
    id: 'l0',
    name: 'WDS 7',
    date: '02/03/24',
    time: '8:00 pm',
    location: 'Thane',
    promoter: 'WDS Promotions',
    logoName: 'wds-7-logo.png',
    counts: { amateurMMA: 5, proMMA: 2, amateurBJJ: 0, proBJJ: 0, amateurK1: 1 },
  },
];

export const BOUTS: Bout[] = [
  {
    id: 'b1',
    leagueId: 'l2',
    type: 'Professional',
    discipline: 'MMA',
    date: '22/04/24',
    number: 1,
    name: 'Flyweight',
    totalRounds: 3,
    roundMinutes: 1,
    ringNo: '1',
    blueFighterId: 'f1',
    redFighterId: 'f2',
    judgeIds: ['j6', 'j1', 'j2'],
    refereeId: 'r1',
    status: 'Live',
  },
  {
    id: 'b2',
    leagueId: 'l2',
    type: 'Amateur',
    discipline: 'MMA',
    date: '22/04/24',
    number: 2,
    name: 'Bantamweight',
    totalRounds: 3,
    roundMinutes: 3,
    ringNo: '1',
    blueFighterId: 'f3',
    redFighterId: 'f4',
    judgeIds: ['j1', 'j3', 'j4'],
    refereeId: 'r2',
    status: 'Scheduled',
  },
  {
    id: 'b3',
    leagueId: 'l2',
    type: 'Amateur',
    discipline: 'BJJ',
    date: '22/04/24',
    number: 3,
    name: "Women's Strawweight",
    totalRounds: 3,
    roundMinutes: 5,
    ringNo: '2',
    blueFighterId: 'f5',
    redFighterId: 'f6',
    judgeIds: ['j2', 'j5', 'j6'],
    refereeId: 'r3',
    status: 'Scheduled',
  },
  {
    id: 'b4',
    leagueId: 'l1',
    type: 'Professional',
    discipline: 'MMA',
    date: '21/04/24',
    number: 1,
    name: 'Lightweight',
    totalRounds: 5,
    roundMinutes: 5,
    ringNo: '1',
    blueFighterId: 'f2',
    redFighterId: 'f4',
    judgeIds: ['j1', 'j2', 'j3'],
    refereeId: 'r1',
    status: 'Scheduled',
  },
];

export const BLOOD_GROUPS = ['A+ve', 'A-ve', 'B+ve', 'B-ve', 'AB+ve', 'AB-ve', 'O+ve', 'O-ve'];
