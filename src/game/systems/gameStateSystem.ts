import { lunchMenus } from '../data/menus';
import type { GameState, LunchMenu, LunchMenuId, ResultType } from '../types';

export function isLunchMenuId(value: unknown): value is LunchMenuId {
  return typeof value === 'string' && value in lunchMenus;
}

export function isResultType(value: unknown): value is ResultType {
  return (
    value === 'success' ||
    value === 'lastOneSuccess' ||
    value === 'soldOut' ||
    value === 'jankenLose' ||
    value === 'flying'
  );
}

export function hasPlayableState(data: Partial<GameState> | undefined): data is GameState {
  return Boolean(data && isLunchMenuId(data.selectedMenuId) && typeof data.remainingServings === 'number');
}

export function getMenuFromState(state: GameState): LunchMenu {
  return lunchMenus[state.selectedMenuId];
}

export function normalizePlayableState(data: Partial<GameState> | undefined): GameState | undefined {
  if (!hasPlayableState(data)) return undefined;
  const menu = getMenuFromState(data);
  return {
    ...data,
    selectedMenuId: menu.id,
    remainingServings: Number.isFinite(data.remainingServings) ? data.remainingServings : menu.remainingServings,
  };
}

export function normalizeResultState(data: Partial<GameState> | undefined): GameState | undefined {
  const state = normalizePlayableState(data);
  if (!state || !isResultType(state.resultType)) return undefined;
  return state;
}
