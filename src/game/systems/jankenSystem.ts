import Phaser from 'phaser';
import type { JankenHand, LunchMenu } from '../types';

export const jankenHands: JankenHand[] = ['rock', 'scissors', 'paper'];

export function getHandLabel(hand: JankenHand): string {
  const labels: Record<JankenHand, string> = {
    rock: 'グー',
    scissors: 'チョキ',
    paper: 'パー',
  };
  return labels[hand];
}

export function getRandomCpuHand(): JankenHand {
  return Phaser.Math.RND.pick(jankenHands);
}

export function judgeJanken(player: JankenHand, cpu: JankenHand): 'win' | 'lose' | 'draw' {
  if (player === cpu) return 'draw';
  if (
    (player === 'rock' && cpu === 'scissors') ||
    (player === 'scissors' && cpu === 'paper') ||
    (player === 'paper' && cpu === 'rock')
  ) {
    return 'win';
  }
  return 'lose';
}

export function shouldStartJanken(menu: LunchMenu, rank: number, remainingServings: number): boolean {
  if (menu.forceJanken || menu.rarity === 'legendary') return true;
  if (rank === remainingServings + 1) return true;
  if (remainingServings <= 2 && rank === remainingServings) {
    return Math.random() < menu.jankenRate;
  }
  if ((menu.rarity === 'rare' || menu.id === 'pudding') && rank <= remainingServings + 1) {
    return Math.random() < menu.jankenRate;
  }
  return false;
}
