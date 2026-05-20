export type LunchMenuId =
  | 'curry'
  | 'wakameRice'
  | 'jelly'
  | 'frozenMikan'
  | 'agepan'
  | 'karaage'
  | 'softMen'
  | 'coffeeMilk'
  | 'pudding'
  | 'cocoaAgepan'
  | 'milmake'
  | 'fruitPunch'
  | 'tanabataJelly'
  | 'christmasCake'
  | 'graduationCrepe'
  | 'jumboPudding'
  | 'specialCurry';

export type LunchRarity = 'common' | 'uncommon' | 'rare' | 'superRare' | 'legendary';

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
  rarity: LunchRarity;
  popularity: number;
  baseRemaining: number;
  remainingServings: number;
  timingDifficulty: 'easy' | 'normal' | 'hard';
  appearanceWeight: number;
  jankenRate: number;
  forceJanken?: boolean;
  collectionText: string;
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

export interface CollectionEntry {
  menuId: LunchMenuId;
  discovered: boolean;
  acquired: boolean;
  acquiredCount: number;
  firstAcquiredAt?: string;
  lastAcquiredAt?: string;
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
