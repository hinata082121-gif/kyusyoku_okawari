import { lunchMenuList } from '../data/menus';
import type { CollectionEntry, LunchMenuId, LunchRarity } from '../types';

const STORAGE_KEY = 'kyusyoku-okawari-collection-v1';

export type CollectionMap = Record<LunchMenuId, CollectionEntry>;

export interface CollectionStats {
  total: number;
  discovered: number;
  acquired: number;
  byRarity: Record<LunchRarity, { total: number; acquired: number; discovered: number }>;
}

export interface AcquireResult {
  entry: CollectionEntry;
  isFirstAcquire: boolean;
}

const rarityOrder: LunchRarity[] = ['common', 'uncommon', 'rare', 'superRare', 'legendary'];

function createEmptyCollection(): CollectionMap {
  return Object.fromEntries(
    lunchMenuList.map((menu) => [
      menu.id,
      {
        menuId: menu.id,
        discovered: false,
        acquired: false,
        acquiredCount: 0,
      } satisfies CollectionEntry,
    ]),
  ) as CollectionMap;
}

export function getCollection(): CollectionMap {
  const fallback = createEmptyCollection();
  if (!canUseLocalStorage()) return fallback;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<Record<LunchMenuId, Partial<CollectionEntry>>>;
    return mergeCollection(parsed, fallback);
  } catch {
    saveCollection(fallback);
    return fallback;
  }
}

export function markDiscovered(menuId: LunchMenuId): CollectionEntry {
  const collection = getCollection();
  const entry = collection[menuId];
  const updated = { ...entry, discovered: true };
  collection[menuId] = updated;
  saveCollection(collection);
  return updated;
}

export function markAcquired(menuId: LunchMenuId): AcquireResult {
  const collection = getCollection();
  const entry = collection[menuId];
  const now = new Date().toISOString();
  const isFirst = !entry.acquired;
  const updated: CollectionEntry = {
    ...entry,
    discovered: true,
    acquired: true,
    acquiredCount: entry.acquiredCount + 1,
    firstAcquiredAt: entry.firstAcquiredAt ?? now,
    lastAcquiredAt: now,
  };
  collection[menuId] = updated;
  saveCollection(collection);
  return { entry: updated, isFirstAcquire: isFirst };
}

export function isFirstAcquire(menuId: LunchMenuId): boolean {
  return !getCollection()[menuId].acquired;
}

export function getCollectionStats(): CollectionStats {
  const collection = getCollection();
  const byRarity = Object.fromEntries(
    rarityOrder.map((rarity) => [rarity, { total: 0, acquired: 0, discovered: 0 }]),
  ) as CollectionStats['byRarity'];

  for (const menu of lunchMenuList) {
    const entry = collection[menu.id];
    byRarity[menu.rarity].total += 1;
    if (entry.discovered) byRarity[menu.rarity].discovered += 1;
    if (entry.acquired) byRarity[menu.rarity].acquired += 1;
  }

  return {
    total: lunchMenuList.length,
    discovered: Object.values(collection).filter((entry) => entry.discovered).length,
    acquired: Object.values(collection).filter((entry) => entry.acquired).length,
    byRarity,
  };
}

export function resetCollection(): void {
  saveCollection(createEmptyCollection());
}

function mergeCollection(
  parsed: Partial<Record<LunchMenuId, Partial<CollectionEntry>>>,
  fallback: CollectionMap,
): CollectionMap {
  const collection = { ...fallback };
  for (const menu of lunchMenuList) {
    const item = parsed[menu.id];
    if (!item) continue;
    collection[menu.id] = {
      menuId: menu.id,
      discovered: Boolean(item.discovered),
      acquired: Boolean(item.acquired),
      acquiredCount: Number.isFinite(item.acquiredCount) ? Math.max(0, Number(item.acquiredCount)) : 0,
      firstAcquiredAt: typeof item.firstAcquiredAt === 'string' ? item.firstAcquiredAt : undefined,
      lastAcquiredAt: typeof item.lastAcquiredAt === 'string' ? item.lastAcquiredAt : undefined,
    };
  }
  return collection;
}

function saveCollection(collection: CollectionMap): void {
  if (!canUseLocalStorage()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(collection));
  } catch {
    // localStorage may be unavailable in private browsing or restricted environments.
  }
}

function canUseLocalStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}
