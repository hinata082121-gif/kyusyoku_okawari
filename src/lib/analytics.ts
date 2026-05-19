import type { LunchMenu, ResultType } from '../game/types';
import { siteConfig } from '../config/site';

type AnalyticsParams = Record<string, string | number | boolean | undefined>;

let initialized = false;

export function initAnalytics(): void {
  const measurementId = siteConfig.gaMeasurementId;
  if (!measurementId || initialized) return;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = (...args: unknown[]) => {
    window.dataLayer?.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, { send_page_view: false });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);
  initialized = true;
}

export function trackPageView(path: string): void {
  sendEvent('page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

export function trackGameStart(): void {
  sendEvent('game_start');
}

export function trackMenuRevealed(menu: LunchMenu): void {
  sendEvent('menu_revealed', {
    menu_name: menu.name,
    menu_id: menu.id,
  });
}

export function trackTimingTap(menu: LunchMenu, reactionTimeMs: number, rank: number): void {
  sendEvent('timing_tap', {
    menu_name: menu.name,
    reaction_time_ms: reactionTimeMs,
    rank,
  });
}

export function trackJankenStart(menu: LunchMenu): void {
  sendEvent('janken_start', {
    menu_name: menu.name,
  });
}

export function trackJankenResult(result: 'win' | 'lose', menu: LunchMenu): void {
  sendEvent(result === 'win' ? 'janken_win' : 'janken_lose', {
    menu_name: menu.name,
  });
}

export function trackGameResult(resultType: ResultType, menu: LunchMenu, rank?: number, reactionTimeMs?: number): void {
  sendEvent('result_view', {
    result_type: resultType,
    menu_name: menu.name,
    rank,
    reaction_time_ms: reactionTimeMs,
  });
}

export function trackShareCopy(resultType: ResultType): void {
  sendEvent('share_copy_click', {
    result_type: resultType,
  });
}

export function trackRetryClick(resultType?: ResultType): void {
  sendEvent('retry_click', {
    result_type: resultType,
  });
}

function sendEvent(name: string, params: AnalyticsParams = {}): void {
  if (!siteConfig.gaMeasurementId || !window.gtag) return;
  window.gtag('event', name, params);
}
