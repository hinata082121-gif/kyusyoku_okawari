type AnalyticsValue = string | number | boolean;
type AnalyticsParams = Record<string, AnalyticsValue | null | undefined>;
type JankenResult = 'win' | 'lose' | 'draw';

export function trackGameStart(): void {
  sendEvent('game_start');
}

export function trackMenuRevealed(menuName: string, menuId?: string): void {
  sendEvent('menu_revealed', {
    menu_name: menuName,
    menu_id: menuId,
  });
}

export function trackTimingTap(
  menuName: string,
  reactionTimeMs: number | null,
  rank: number | null,
  isFlying = false,
): void {
  sendEvent('timing_tap', {
    menu_name: menuName,
    reaction_time_ms: reactionTimeMs,
    rank,
    is_flying: isFlying,
  });
}

export function trackJankenStart(menuName: string): void {
  sendEvent('janken_start', {
    menu_name: menuName,
  });
}

export function trackJankenResult(menuName: string, result: JankenResult): void {
  sendEvent('janken_result', {
    menu_name: menuName,
    janken_result: result,
  });
}

export function trackResultView(
  resultType: string,
  menuName: string,
  reactionTimeMs?: number | null,
  rank?: number | null,
): void {
  sendEvent('result_view', {
    result_type: resultType,
    menu_name: menuName,
    reaction_time_ms: reactionTimeMs,
    rank,
  });
}

export function trackRetryClick(resultType?: string, menuName?: string): void {
  sendEvent('retry_click', {
    result_type: resultType,
    menu_name: menuName,
  });
}

export function trackShareCopyClick(resultType: string, menuName: string): void {
  sendEvent('share_copy_click', {
    result_type: resultType,
    menu_name: menuName,
  });
}

function sendEvent(name: string, params: AnalyticsParams = {}): void {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', name, sanitizeParams(params));
}

function sanitizeParams(params: AnalyticsParams): Record<string, AnalyticsValue> {
  return Object.fromEntries(
    Object.entries(params).filter((entry): entry is [string, AnalyticsValue] => entry[1] !== undefined && entry[1] !== null),
  );
}
