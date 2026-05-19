import { siteConfig } from '../config/site';

type AnalyticsValue = string | number | boolean;
type AnalyticsParams = Record<string, AnalyticsValue | null | undefined>;
type JankenResult = 'win' | 'lose' | 'draw';

let initialized = false;
const GA_SCRIPT_ID = 'ga4-gtag-script';

export function initAnalytics(): void {
  const measurementId = siteConfig.gaMeasurementId;
  if (!measurementId || initialized) return;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = (...args: unknown[]) => {
    window.dataLayer?.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, { send_page_view: false });

  if (!document.getElementById(GA_SCRIPT_ID)) {
    const script = document.createElement('script');
    script.id = GA_SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(script);
  }
  initialized = true;
}

export function trackPageView(path: string): void {
  sendEvent('page_view', {
    page_path: path,
  });
}

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
  if (!siteConfig.gaMeasurementId || !window.gtag) return;
  window.gtag('event', name, sanitizeParams(params));
}

function sanitizeParams(params: AnalyticsParams): Record<string, AnalyticsValue> {
  return Object.fromEntries(
    Object.entries(params).filter((entry): entry is [string, AnalyticsValue] => entry[1] !== undefined && entry[1] !== null),
  );
}
