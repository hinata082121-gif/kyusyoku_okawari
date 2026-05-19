export function getRankFromReaction(reactionTimeMs: number): number {
  if (reactionTimeMs <= 250) return 1;
  if (reactionTimeMs <= 500) return 2;
  if (reactionTimeMs <= 900) return 3;
  if (reactionTimeMs <= 1300) return 4;
  return 5;
}

export function getRankLabel(rank?: number): string {
  if (!rank || rank >= 5) return '出遅れ';
  return `${rank}番目`;
}

export function getRankReactionText(rank?: number): string {
  if (rank === 1) return '完璧なスタート！';
  if (rank === 2) return 'かなり早い！';
  if (rank === 3) return 'まだ間に合う！';
  return 'ちょっと出遅れた…';
}
