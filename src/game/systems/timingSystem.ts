import Phaser from 'phaser';

export function getSignalWaitMs(): number {
  return Phaser.Math.Between(1500, 3300);
}

export function getReactionTimeMs(signalAt: number, tappedAt: number): number {
  return Math.max(0, Math.round(tappedAt - signalAt));
}
