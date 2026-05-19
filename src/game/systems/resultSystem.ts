import type { GameState, LunchMenu, ResultType } from '../types';
import { shouldStartJanken } from './jankenSystem';

export type QueueDecision =
  | { next: 'result'; resultType: ResultType }
  | { next: 'janken' };

export function decideQueueOutcome(state: GameState, menu: LunchMenu): QueueDecision {
  if (state.resultType === 'flying') {
    return { next: 'result', resultType: 'flying' };
  }

  const rank = state.rank ?? 5;
  const remaining = state.remainingServings;

  if (shouldStartJanken(menu, rank, remaining)) {
    return { next: 'janken' };
  }

  if (rank <= remaining) {
    return { next: 'result', resultType: 'success' };
  }

  return { next: 'result', resultType: 'soldOut' };
}
