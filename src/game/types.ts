export type LunchMenuId = 'curry' | 'agepan' | 'pudding';

export type ResultType =
  | 'success'
  | 'lastOneSuccess'
  | 'soldOut'
  | 'jankenLose'
  | 'flying';

export type JankenHand = 'rock' | 'scissors' | 'paper';

export type ClassmateType = 'quick' | 'relaxed' | 'puddingLover';

export interface LunchMenu {
  id: LunchMenuId;
  name: string;
  popularity: number;
  remainingServings: number;
  timingDifficulty: 'normal' | 'hard';
  jankenRate: number;
  introText: string;
  successCopy: string;
  failCopy: string;
  color: number;
  accentColor: number;
  menuLineup: string[];
}

export interface ClassmateProfile {
  id: string;
  name: string;
  type: ClassmateType;
  quote: string;
}

export interface GameState {
  selectedMenuId: LunchMenuId;
  reactionTimeMs?: number;
  rank?: number;
  remainingServings: number;
  resultType?: ResultType;
  jankenPlayerHand?: JankenHand;
  jankenCpuHand?: JankenHand;
  shareCopy?: string;
}

export interface ResultMessage {
  title: string;
  badge: string;
  mainCopies: string[];
  shareCopies: string[];
  teacherLine: string;
  serverLine: string;
  visualMood: 'victory' | 'lastOneVictory' | 'soldOut' | 'jankenLose' | 'flying';
}
